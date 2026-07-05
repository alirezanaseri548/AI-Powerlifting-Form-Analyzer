# ML Service

FastAPI placeholder ML service for AI Powerlifting Form Analyzer.

## Run locally
`powershell
cd apps/ml-service
.\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload

## URLs

- Health: http://localhost:8001/health
- Docs: http://localhost:8001/docs
- Analyze: POST http://localhost:8001/analyze
