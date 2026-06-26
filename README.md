# ACEPlay Admin System

Admin panel and REST API for managing ACEPlay website content (casinos, promotions, banners, games, and more).

## Architecture

```
Admin Panel (Nuxt)  →  Auth (/api/auth) + Admin API (/api/admin)  →  MongoDB
ACEPlay Website     →  Public API (/api/public)                    →  MongoDB (published only)
```

Admins sign in at `/login` or `/register`. All admin CRUD routes require a JWT bearer token.

## Prerequisites

- Node.js 18+
- MongoDB (local Docker or Atlas)

## Backend

```bash
# From project root
cp .env.example .env   # set MONGO_URI

# Optional: start MongoDB with Docker
docker compose up -d

npm install
npm run dev            # http://localhost:5000
```

### Auth API (`/api/auth`)

| Method | Path        | Description        |
|--------|-------------|--------------------|
| POST   | `/register` | Create admin account |
| POST   | `/login`    | Get JWT token      |
| GET    | `/me`       | Current admin (Bearer token) |

### Admin API (`/api/admin`) — requires `Authorization: Bearer <token>`

| Homepage section        | Endpoint           |
|-------------------------|--------------------|
| Site & header           | `/site-settings`   |
| Navigation menu         | `/navigation`      |
| Hero banner             | `/banners`         |
| Big wins carousel       | `/big-wins`        |
| Popular games           | `/popular-games`   |
| Exclusive promotions    | `/promotions`      |
| Promotion banners       | `/banners`         |
| Casinos, games, countries | `/casinos`, `/games`, `/countries` |

### Public API (`/api/public`)

Read-only. Published content only.

- `GET /api/public/homepage` — full homepage payload for the player site
- `GET /api/public/casinos`, `/banners`, `/big-wins`, etc.

## Frontend (Nuxt)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:3000
```

Ensure the backend is running on port 5000 (or update `NUXT_PUBLIC_API_BASE`).

## Scripts

| Location | Command        | Description        |
|----------|----------------|--------------------|
| Root     | `npm run dev`  | Start API server   |
| Root     | `npm start`    | Production API     |
| frontend | `npm run dev`  | Start admin UI     |
| frontend | `npm run build`| Build admin UI     |
