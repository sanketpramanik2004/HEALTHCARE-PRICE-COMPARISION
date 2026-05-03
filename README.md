# Healthcare Price Navigator

Healthcare Price Navigator is a full-stack healthcare comparison and appointment platform built with Spring Boot, React, and MySQL.

It helps patients:
- compare hospitals by service price and distance
- discover doctors and hospital services
- book appointments through slot-based flows
- get AI-assisted doctor and service recommendations
- manage profile details, medical history, and reviews

It also gives hospital admins a scoped workspace to manage their own hospital's services, doctors, slots, and appointment approvals.

## Tech Stack

- Backend: Spring Boot
- Frontend: React + Tailwind CSS
- Database: MySQL
- Auth: JWT + Google sign-in for users
- AI: OpenAI-backed symptom analysis with fallback logic

## Project Structure

```text
hospital/            Spring Boot backend
hospital-frontend/   React frontend
PROJECT_UPGRADES_SUMMARY.md   detailed handoff / build history
DOCTOR_SAMPLE_DATA.sql        sample doctor seed data
```

## Core Features

- JWT authentication with `USER` and `ADMIN` roles
- hospital-specific admin isolation
- hospital price comparison by service
- nearest / best hospital lookup with location support
- doctor discovery and consultation booking
- slot-based booking workflow
- appointment lifecycle: `PENDING`, `CONFIRMED`, `COMPLETED`, `REJECTED`
- booking status email notifications
- AI symptom analysis with doctor and service suggestions
- multilingual UI
- reviews and ratings for completed appointments
- user profile and medical history
- mobile-responsive frontend and deployment-ready API/CORS configuration

## Local Setup

### 1. Clone and open the repo

```bash
git clone <your-repo-url>
cd hospital
```

### 2. Backend setup

The backend lives in `hospital/`.

Create:

`hospital/src/main/resources/application-local.properties`

Example:

```properties
DB_URL=jdbc:mysql://localhost:3306/hospital_db
DB_USERNAME=root
DB_PASSWORD=your_password

JWT_SECRET=replace_with_a_long_random_secret

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_app_password

OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

Run the backend:

```bash
cd hospital
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd hospital
.\mvnw.cmd spring-boot:run
```

### 3. Frontend setup

The frontend lives in `hospital-frontend/`.

Create:

`hospital-frontend/.env.local`

Example:

```env
REACT_APP_API_ROOT_URL=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the frontend:

```bash
cd hospital-frontend
npm install
npm start
```

## Default Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

## Important Backend Notes

- Database name used by the project: `hospital_db`
- Hibernate schema updates are enabled through `spring.jpa.hibernate.ddl-auto=update`
- If you change entities, restart the backend so schema updates are applied
- Email sending is best-effort and should not block appointment status changes

## Useful API Areas

- Auth / registration:
  - `POST /hospitals/register`
  - `POST /hospitals/login`
  - `POST /hospitals/google-login`
- Hospital comparison:
  - `GET /hospitals/compare`
  - `GET /hospitals/best`
  - `GET /hospitals/nearest`
- Slots:
  - `POST /hospitals/slots`
  - `GET /hospitals/availableSlots`
- Doctors:
  - doctor listing and search through `/doctors/...`
- Reviews:
  - `POST /reviews`
  - `GET /reviews/doctor/{doctorId}`
  - `GET /reviews/hospital/{hospitalId}`
- Profile:
  - `GET /user/profile`
  - `PUT /user/profile`
  - `GET /user/appointments`
- Medical history:
  - `POST /medical-history`
  - `GET /medical-history`
  - `DELETE /medical-history/{id}`

## Deployment Notes

For production, set:

Frontend:

```env
REACT_APP_API_ROOT_URL=https://your-backend-domain.com
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Backend:

```env
DB_URL=...
DB_USERNAME=...
DB_PASSWORD=...
JWT_SECRET=...
MAIL_HOST=...
MAIL_PORT=...
MAIL_USERNAME=...
MAIL_PASSWORD=...
OPENAI_API_KEY=...
GOOGLE_CLIENT_ID=...
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Validation

These commands have been used successfully in this repo:

Backend:

```powershell
cd hospital
.\mvnw.cmd -q -DskipTests compile
```

Frontend:

```bash
cd hospital-frontend
npm run build
```

## Notes

- `PROJECT_UPGRADES_SUMMARY.md` is the detailed handoff document for future sessions
- `hospital-frontend/README.md` is still the default Create React App README and can be replaced later if you want a cleaner frontend-specific guide

