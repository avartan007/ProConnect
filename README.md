# ProConnect

ProConnect is a full-stack professional networking application. Users can create accounts, publish posts, discover profiles, connect with other users, comment on posts, and maintain a professional profile.

## Stack

- **Frontend:** Next.js Pages Router, React, Redux Toolkit
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Deployment:** Vercel for the frontend and Render (or another Node host) for the backend

## Repository layout

```text
linkedin/
├── frontend/       # Next.js client application
├── backend/        # Express API and MongoDB models
├── .env            # Local backend secret configuration (not committed)
└── README.md
```

## Run locally

### 1. Configure MongoDB

The MongoDB connection string belongs to the backend, never the frontend:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=9090
FRONTEND_URL=http://localhost:3000
```

For local development, put those values in `backend/.env`. The current backend also supports the existing root `.env` connection-string format for compatibility, but the recommended format is a named `MONGO_URL` variable.

Do not commit `.env` or expose `MONGO_URL` through a `NEXT_PUBLIC_*` variable.

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:9090`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend runs at `http://localhost:3000`. Its local API configuration is:

```env
NEXT_PUBLIC_API_URL=http://localhost:9090
```

## Deployment

### Backend

Deploy `backend/` as a Node service. Configure these environment variables in the hosting provider:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=9090
FRONTEND_URL=https://your-frontend.vercel.app
```

Use `npm run prod` as the start command.

### Frontend

Deploy `frontend/` as a Vercel project and set the root directory to `frontend`. Configure:

```env
NEXT_PUBLIC_API_URL=https://your-backend.example.com
```

Use the URL of your own deployed backend. Do not use the copied Render URL that was previously in the source.

## Validation

```bash
cd backend && node --check server.js
cd frontend && npm run lint
cd frontend && npm run build
```

## API health check

After starting the backend:

```bash
curl http://localhost:9090/
```

Expected response:

```json
{"message":"RUNNING"}
```
