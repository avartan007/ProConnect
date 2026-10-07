# ProConnect API

Express and MongoDB API for the ProConnect frontend.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

The API listens on `http://localhost:9090` by default.

## Environment variables

Set `MONGO_URL` in `backend/.env` for local development. The legacy `MONGO_DB_URI` name is also supported:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=9090
FRONTEND_URL=http://localhost:3000
```

For Render or another host, configure these values in the service's environment settings instead of committing `.env`.

`MONGO_URL` is used by `server.js` when calling `mongoose.connect`. The frontend must never receive this value. The frontend only needs `NEXT_PUBLIC_API_URL`, which should point at the deployed backend.

## Scripts

```bash
npm run dev   # Start with nodemon
npm run prod  # Start the production server
npm run seed:demo # Add/update the fictional demo network and 20 posts
```

The demo seed is safe to rerun. It replaces only posts marked `[ProConnect demo]` and upserts the seven demo users by username. It does not delete real users or real posts.
