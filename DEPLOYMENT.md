# Deployment Guide

This project is set up to deploy with:

- Frontend: Vercel
- Backend: Render
- Database: MySQL on Render

## Recommended Architecture

1. Deploy MySQL on Render
2. Deploy Spring Boot backend on Render
3. Deploy React frontend on Vercel
4. Point the frontend to the Render backend URL
5. Add the Vercel frontend URL to backend CORS

## 1. Deploy MySQL on Render

Render currently supports deploying MySQL as a service with persistent disk storage. Create that first so the backend has a database target.

In Render:

1. Create a new MySQL service
2. Choose MySQL 8 unless you have a legacy reason not to
3. Save the internal connection details

Build your `DB_URL` in this format:

```text
jdbc:mysql://<render-mysql-host>:3306/hospital_db
```

Use the MySQL username and password Render gives you for:

- `DB_USERNAME`
- `DB_PASSWORD`

## 2. Deploy Backend on Render

The backend now supports Render's `PORT` environment variable and includes a Dockerfile at:

- `hospital/Dockerfile`

In Render:

1. New -> Web Service
2. Connect your GitHub repo
3. Choose branch: `main`
4. Runtime: `Docker`
5. Root directory: `hospital`
6. Dockerfile path: `./Dockerfile`

Set these environment variables in Render:

```text
PORT=10000
DB_URL=jdbc:mysql://<render-mysql-host>:3306/hospital_db
DB_USERNAME=<your_mysql_username>
DB_PASSWORD=<your_mysql_password>
JWT_SECRET=<a_long_random_secret_at_least_32_bytes>
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<your_email>
MAIL_PASSWORD=<your_app_password>
OPENAI_API_KEY=<your_openai_key>
GOOGLE_CLIENT_ID=<your_google_client_id>
CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>
```

Optional:

- If you do not want email immediately, you can leave the mail values empty, but booking emails will not work
- If you do not want AI immediately, you can leave `OPENAI_API_KEY` empty and fallback logic will be used

After deploy, copy the backend URL. It will look something like:

```text
https://your-backend-name.onrender.com
```

## 3. Deploy Frontend on Vercel

The frontend includes a Vercel SPA routing config at:

- `hospital-frontend/vercel.json`

This matters because the app uses client-side routing, and Vercel recommends SPA rewrites for this pattern.

In Vercel:

1. Add New Project
2. Import your GitHub repo
3. Set the root directory to `hospital-frontend`
4. Framework preset: Create React App or Other
5. Build command: `npm run build`
6. Output directory: `build`

Set these environment variables in Vercel:

```text
REACT_APP_API_ROOT_URL=https://your-backend-name.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=<your_google_client_id>
```

Deploy, then copy the frontend URL. It will look something like:

```text
https://your-project.vercel.app
```

## 4. Update Backend CORS

Once Vercel gives you the real frontend URL, update this Render environment variable:

```text
CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
```

If you use a custom domain later, update it again:

```text
CORS_ALLOWED_ORIGINS=https://app.yourdomain.com
```

Then redeploy the backend.

## 5. Google Sign-In Setup

If you use Google sign-in, make sure the Google OAuth client includes:

- local frontend origin
- Vercel production origin

Typical authorized JavaScript origins:

```text
http://localhost:3000
https://your-project.vercel.app
```

## 6. First Deployment Checklist

- Backend loads successfully on Render
- Frontend loads successfully on Vercel
- Register/login works
- Booking works
- Admin login works
- Hospital search and map work
- AI assistant works or falls back cleanly
- Review submission works after completed appointment
- CORS errors do not appear in browser console

## Troubleshooting

### Frontend works at `/` but refresh on `/profile` or `/explore` fails

Make sure Vercel is using `hospital-frontend/vercel.json`.

That file rewrites all routes to `index.html`, which Vercel documents as a common SPA setup.

### Backend deploys but does not start

Check:

- `PORT` is set
- Render is using the `hospital` root directory
- Dockerfile path is `./Dockerfile`
- required env vars are present

### API calls fail from frontend

Check:

- `REACT_APP_API_ROOT_URL` points to the Render backend
- `CORS_ALLOWED_ORIGINS` includes the exact Vercel domain
- backend redeployed after env change

### Google sign-in fails

Check:

- backend `GOOGLE_CLIENT_ID`
- frontend `REACT_APP_GOOGLE_CLIENT_ID`
- authorized origins in Google Cloud Console

## Sources

- Render says web services must bind to `0.0.0.0` on a configured port, with `10000` as the default expected port: https://render.com/docs/web-services
- Render documents `PORT` as the environment variable for a web service port: https://render.com/docs/environment-variables
- Render supports Docker-based deploys from a repo Dockerfile: https://render.com/docs/docker
- Render documents MySQL deployment on the platform: https://render.com/docs/deploy-mysql
- Vercel documents SPA rewrites with `/(.*) -> /index.html` in `vercel.json`: https://vercel.com/docs/project-configuration/vercel-json
