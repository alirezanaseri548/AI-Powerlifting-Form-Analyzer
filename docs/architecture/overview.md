# Architecture Overview

The system is split into three main runtime applications:

1. React Native mobile app
2. NestJS backend API
3. FastAPI ML service

The mobile app sends workout videos to the backend. The backend stores video metadata, uploads the file to object storage, and creates an analysis job. The ML service processes the video, extracts pose landmarks, analyzes form, and returns structured feedback.
