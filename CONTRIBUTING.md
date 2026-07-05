# Contributing

Thanks for your interest in contributing to AI Powerlifting Form Analyzer.

## How to Contribute

You can contribute by:

- Reporting bugs
- Suggesting features
- Improving documentation
- Improving mobile UI
- Adding backend tests
- Improving ML service
- Adding pose-estimation logic
- Fixing Docker or setup issues

## Development Areas

### Backend

Path:

txt
apps/api

Typical commands:

powershell
cd apps/api
npm install
npm run start:dev

### ML Service

Path:

txt
apps/ml-service

Recommended Python version:

txt
Python 3.11

### Mobile

Path:

txt
apps/mobile

Typical command:

powershell
npx expo start --host lan -c

## Branch Naming

Use clear branch names:

txt
feat/mobile-upload-screen
fix/api-health-check
docs/setup-guide
ml/pose-estimation

## Commit Style

Use conventional commits:

txt
feat: add upload screen
fix(api): resolve port config issue
docs: update setup guide
chore: add GitHub templates

## Pull Request Checklist

Before opening a PR:

- Make sure the app builds.
- Explain what you changed.
- Add screenshots for UI changes.
- Link related issues if available.
- Keep PRs focused and small where possible.

## Good First Issues

Suggested starter tasks:

- Improve README setup instructions.
- Add screenshots to documentation.
- Add backend health troubleshooting guide.
- Add ML service requirements file.
- Add Expo API URL configuration guide.
- Add basic tests for health endpoints.
