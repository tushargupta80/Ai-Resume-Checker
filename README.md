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
1. Push this repository to GitHub.
2. In Render, create a new **Blueprint** and select this repo.
3. Render will pick up [render.yaml](C:\ai Resume\render.yaml) and create backend service automatically.
4. In Render dashboard, set secret env vars:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel domain, e.g. `https://your-app.vercel.app`)
   - `GROK_API_KEY`
5. Deploy and confirm health endpoint:
   - `https://<render-service>.onrender.com/api/health`

### Vercel (Frontend)
1. In Vercel, import the same GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Vercel will use [vercel.json](C:\ai Resume\frontend\vercel.json).
4. Add env var:
   - `VITE_API_URL=https://<render-backend-domain>/api`
5. Deploy and open your frontend URL.

### Post Deploy
1. Update backend `CLIENT_URL` with the final Vercel URL.
2. Redeploy backend service (or trigger manual deploy).
3. Test:
   - register/login
   - upload resume
   - recruiter creates job
   - job seeker runs analyze
   - results page loads

## Notes
- `backend/uploads` is local storage. Use S3/Cloudinary in production.
- Use MongoDB Atlas for hosted deployments.
- Scanned/image PDFs are supported via OCR fallback (`Ghostscript` + `tesseract.js`).
- Render does not include Ghostscript by default. OCR for scanned PDFs may fail in cloud unless you use a custom Docker image or external OCR service.

## OCR Prerequisites (for image/scanned PDFs)
- Install Ghostscript on your machine.
- Ensure Ghostscript is available in system PATH, or install in default path (`C:\Program Files\gs\...`).
- Then restart backend server.
