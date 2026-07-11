import math, tempfile, os
from typing import List, Dict
import cv2, numpy as np, mediapipe as mp
from fastapi import FastAPI, UploadFile, File, HTTPException

app = FastAPI(title="Powerlifting ML Service")
mp_pose = mp.solutions.pose
L = mp_pose.PoseLandmark

def angle(a,b,c):
    ba=np.array([a[0]-b[0],a[1]-b[1]]); bc=np.array([c[0]-b[0],c[1]-b[1]])
    cos=np.dot(ba,bc)/(np.linalg.norm(ba)*np.linalg.norm(bc)+1e-9)
    return math.degrees(math.acos(np.clip(cos,-1,1)))

def frame_angles(lm)->Dict[str,float]:
    p=lambda i:(lm[i].x,lm[i].y)
    return {"knee":angle(p(L.LEFT_HIP),p(L.LEFT_KNEE),p(L.LEFT_ANKLE)),
            "hip":angle(p(L.LEFT_SHOULDER),p(L.LEFT_HIP),p(L.LEFT_KNEE)),
            "elbow":angle(p(L.LEFT_SHOULDER),p(L.LEFT_ELBOW),p(L.LEFT_WRIST)),
            "back":angle(p(L.LEFT_SHOULDER),p(L.LEFT_HIP),p(L.LEFT_ANKLE))}

def classify(fr):
    kr=max(f["knee"] for f in fr)-min(f["knee"] for f in fr)
    er=max(f["elbow"] for f in fr)-min(f["elbow"] for f in fr)
    hr=max(f["hip"] for f in fr)-min(f["hip"] for f in fr)
    if er>60 and kr<30: return "bench_press"
    if kr>50 and hr>40:
        return "squat" if min(f["knee"] for f in fr)<100 else "deadlift"
    return "unknown"

def count_reps(fr,key="knee",dn=110,up=150):
    reps,ph=0,"up"
    for f in fr:
        if ph=="up" and f[key]<dn: ph="down"
        elif ph=="down" and f[key]>up: ph="up"; reps+=1
    return reps

RULES={"squat":[(lambda fr:min(f["knee"] for f in fr)<=100,"Depth OK.","Squat deeper: bottom knee angle should reach ~100."),
                (lambda fr:min(f["back"] for f in fr)>=140,"Back angle safe.","Too much forward lean: keep chest up.")],
       "deadlift":[(lambda fr:min(f["back"] for f in fr)>=145,"Neutral spine.","Rounded back: brace core, keep spine neutral."),
                   (lambda fr:max(f["hip"] for f in fr)>=165,"Full lockout.","Incomplete lockout: extend hips fully.")],
       "bench_press":[(lambda fr:min(f["elbow"] for f in fr)<=75,"Full ROM to chest.","Lower the bar further (elbow <=75)."),
                      (lambda fr:max(f["elbow"] for f in fr)>=160,"Full extension.","Lock out elbows fully at top.")]}

def score(ex,fr):
    ch=RULES.get(ex,[]); ok=0; fb=[]
    for r,g,b in ch:
        if r(fr): ok+=1; fb.append({"status":"ok","message":g})
        else: fb.append({"status":"fix","message":b})
    return (round(100*ok/len(ch)) if ch else 0), fb

@app.get("/health")
def health(): return {"status":"ok","service":"ml-service"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    sfx=os.path.splitext(file.filename or "v.mp4")[1] or ".mp4"
    with tempfile.NamedTemporaryFile(delete=False,suffix=sfx) as t:
        t.write(await file.read()); path=t.name
    try:
        cap=cv2.VideoCapture(path)
        if not cap.isOpened(): raise HTTPException(400,"Cannot read video.")
        fr=[]
        with mp_pose.Pose(model_complexity=1) as pose:
            i=0
            while True:
                ok,img=cap.read()
                if not ok: break
                if i%3==0:
                    r=pose.process(cv2.cvtColor(img,cv2.COLOR_BGR2RGB))
                    if r.pose_landmarks: fr.append(frame_angles(r.pose_landmarks.landmark))
                i+=1
        cap.release()
        if len(fr)<10: raise HTTPException(422,"Not enough pose data - full body must be visible.")
        ex=classify(fr)
        key="elbow" if ex=="bench_press" else "knee"
        s,fb=score(ex,fr)
        return {"exercise":ex,"reps":count_reps(fr,key),"form_score":s,
                "verdict":"correct" if s>=80 else "needs_improvement",
                "feedback":fb,"frames_analyzed":len(fr)}
    finally: os.unlink(path)
