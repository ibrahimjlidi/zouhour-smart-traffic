Deployment using Docker Compose

Prerequisites
- Docker and Docker Compose installed on the host

Quick start
1. Copy `.env.example` to `Smart/.env` and set secure values (especially `JWT_SECRET`).

2. Build and start services:

```bash
docker-compose up --build -d
```

3. Access the frontend at `http://localhost:5173/` and backend at `http://localhost:5000`.

Notes
- The `frontend` service uses nginx to serve the Vite production build.
- The `backend` service runs `npm start` and expects `MONGO_URI` to point at the `mongo` service when using the provided `docker-compose.yml`.
- For production use consider:
  - Using a reverse proxy (Traefik/Nginx) with HTTPS.
  - Running `npm audit` and reviewing vulnerabilities.
  - Using secrets management for `JWT_SECRET` (do not store secrets in plaintext `.env` in production).
