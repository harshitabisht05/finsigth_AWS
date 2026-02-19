# FinSight

## Run

1. Copy env files:
- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

2. Run DB schema from `schema.sql`.
3. Install dependencies: `npm install`
4. Start app: `npm run dev`

## Build

- Frontend build: `npm run build`
- Desktop installer: `npm run desktop:build:win`

## Deployment targets

- Backend: EC2 + PM2 (`ecosystem.config.js`)
- Database: RDS MySQL
- Frontend: S3 static hosting
