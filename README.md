# AI Resume Analyzer & Job Match Platform

## Tech Stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT
- File Upload: Multer
- PDF Parsing: pdf-parse
- AI: Grok API (x.ai)

## Folder Structure
- `backend/` Express API and MongoDB models
- `frontend/` React app

## Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Required Environment Variables
Backend (`backend/.env`):
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `GROK_API_KEY`
- `GROK_BASE_URL`
- `GROK_MODEL`

Frontend (`frontend/.env`):
- `VITE_API_URL`

## API Routes
- `/api/auth`
  - `POST /register`
  - `POST /login`
- `/api/resume`
  - `POST /upload`
  - `GET /my-resumes`
- `/api/jobs`
  - `POST /create`
  - `GET /all`
- `/api/match`
  - `POST /analyze`
  - `GET /results`

## Deployment

### Render (Backend)
1. Create a Web Service pointing to `backend`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Configure backend env vars.
5. Set `CLIENT_URL` to your Vercel frontend domain.

### Vercel (Frontend)
1. Import project from `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_URL=https://<render-backend-domain>/api`

## Notes
- `backend/uploads` is local storage. Use S3/Cloudinary in production.
- Use MongoDB Atlas for hosted deployments.
- Scanned/image PDFs are supported via OCR fallback (`Ghostscript` + `tesseract.js`).

## OCR Prerequisites (for image/scanned PDFs)
- Install Ghostscript on your machine.
- Ensure Ghostscript is available in system PATH, or install in default path (`C:\Program Files\gs\...`).
- Then restart backend server.
