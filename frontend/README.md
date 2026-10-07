# ProConnect

ProConnect is a small professional networking app built with Next.js, React, and Redux Toolkit. Users can create an account, publish posts, discover profiles, connect with other users, comment on posts, and maintain a lightweight professional profile.

## Project structure

```text
frontend/
├── src/pages/                  # Next.js Pages Router routes
├── src/components/             # Shared UI components
├── src/layout/                 # Public and authenticated layouts
├── src/config/                 # API client and Redux store/actions
├── public/                     # Static assets
├── .env.example                # Safe frontend environment template
└── next.config.mjs             # Vercel/Next.js configuration
```

## Local development

Requirements: Node.js 18.18+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Available scripts:

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run start     # Serve the production build
```

## Environment variables

The browser-facing frontend only needs the public URL of the API:

```env
NEXT_PUBLIC_API_URL=http://localhost:9090
```

The MongoDB connection string **must not be placed in this frontend**. A browser bundle is public, so exposing `MONGODB_URI` would give anyone database credentials.

The MongoDB URI belongs in the backend service that owns the API routes. In the Render dashboard for that backend, add:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
```

The backend must read that variable with its MongoDB driver or ODM and connect before serving requests. This repository currently contains only the frontend; it does not contain the Render backend or its database connection code. Therefore, frontend actions update MongoDB only when the deployed backend is correctly connected to MongoDB.

## Vercel deployment

Set the Vercel project root directory to `frontend`. Vercel will use the existing `build` script.

For local development, use:

```env
NEXT_PUBLIC_API_URL=http://localhost:9090
```

For Vercel, replace the value with your own deployed backend URL, for example:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

Do not use the old copied Render URL.

## API expectations

The frontend currently expects the backend to provide endpoints for authentication, profiles, posts, comments, connections, profile pictures, and resume downloads. The API base URL is centralized in `src/config/index.jsx`.

If the backend URL changes, update `NEXT_PUBLIC_API_URL`; do not hardcode a new URL in individual pages.

## Notes for contributors

- Keep secrets out of Git and out of `NEXT_PUBLIC_*` variables.
- Keep API calls in Redux actions or the shared API client rather than scattering Axios configuration through pages.
- Test `npm run lint` and `npm run build` before opening a pull request.
- The app uses the Pages Router intentionally; do not add a second top-level `app/` router without migrating the existing routes.
