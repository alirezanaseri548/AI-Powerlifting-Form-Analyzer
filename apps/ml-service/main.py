from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import uuid

app = FastAPI(title="AI Powerlifting ML Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ml-service",
        "version": "0.1.0"
    }

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix if file.filename else ".mp4"
    unique_name = f"{uuid.uuid4()}{ext}"
    save_path = UPLOAD_DIR / unique_name

    with save_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Placeholder response for now
    return {
        "status": "ok",
        "message": "Video received successfully",
        "filename": unique_name,
        "analysis": {
            "exercise": "squat",
            "repCount": 1,
            "angles": {
                "knee": 92,
                "hip": 78,
                "back": 165
            },
            "feedback": [
                "Keep your chest up.",
                "Try to maintain a more neutral spine.",
                "Depth looks close to parallel."
            ]
        }
    }
