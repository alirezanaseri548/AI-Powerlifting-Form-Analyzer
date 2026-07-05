# Project Status

## AI Powerlifting Form Analyzer

This repository is an early-stage full-stack project for analyzing powerlifting form using:

- Expo / React Native mobile client
- NestJS backend API
- Python ML service placeholder / future ML pipeline
- Docker-based supporting services
- MinIO for video storage
- Queue-based analysis workflow

## Current Progress

### Completed / Partially Completed

- Repository structure created.
- NestJS API backend is implemented under pps/api.
- Backend modules are loading successfully:
  - Auth
  - Users
  - Uploads
  - Analyses
  - Health
  - Queue
  - MinIO
  - Prisma
- API routes are mapped under /api.
- MinIO bucket check works.
- Docker compose file exists for infrastructure services.
- ML service directory exists under pps/ml-service.
- Mobile app UI can open and attempts to check backend health.
- Basic health-check flow exists between mobile and backend.

## Known Current Issues

### Backend

The backend compiles and initializes, but may fail if port 3000 is already in use.

Typical error:
`	xt
Error: listen EADDRINUSE: address already in use :::3000

Fix:

powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F

Then restart:

powershell
cd apps/api
npm run start:dev

### Mobile

The mobile app may show:

txt
fetch failed: java.net.NoRouteToHostException: Host unreachable

Possible causes:

- Backend is not actually running.
- Wrong LAN IP address is configured.
- Phone and laptop are not on the same Wi-Fi network.
- Windows Firewall is blocking port 3000.
- Backend is listening only on localhost.
- API base URL needs to use the computer LAN IP, for example:
  http://192.168.x.x:3000/api

### ML Service

The ML service is not fully production-ready yet.

Current blockers:

- Python 3.11 is required.
- Python 3.14 may fail while installing packages such as pydantic-core.
- uvicorn may be missing if dependencies are not installed in the correct virtual environment.

Recommended future setup:

powershell
winget install Python.Python.3.11
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install fastapi uvicorn[standard] python-multipart pydantic

## Next Tasks

### High Priority

- Fix backend port conflict permanently.
- Verify backend health from laptop browser:
  http://localhost:3000/api/health
- Verify backend health from phone browser:
  http://<LAN-IP>:3000/api/health
- Add proper CORS configuration for mobile.
- Add firewall rule or allow Node.js through Windows Firewall.
- Finalize Expo mobile project structure.
- Add environment-based API URL configuration.

### ML Roadmap

- Install Python 3.11.
- Create stable ML service environment.
- Add equirements.txt.
- Add FastAPI main.py.
- Add /health endpoint.
- Add /analyze endpoint.
- Add pose-estimation pipeline.
- Add squat, bench press, and deadlift analysis.
- Add angle calculation utilities.
- Add rep detection.
- Add feedback generation.

### Backend Roadmap

- Complete upload-to-analysis workflow.
- Connect backend worker to ML service.
- Save analysis results in database.
- Add authentication guards.
- Add validation DTOs.
- Add Swagger/OpenAPI documentation.
- Add tests.

### Mobile Roadmap

- Add login/register screens.
- Add video picker.
- Add upload progress.
- Add analysis status screen.
- Add result visualization.
- Add settings screen for API URL.
- Improve offline/error states.

## Contribution Status

This project is open for contributions.

Good first contribution areas:

- Documentation improvements
- Mobile UI improvements
- Backend tests
- ML service setup
- Docker improvements
- Bug fixes
- Issue triage
- API health/debug tools
