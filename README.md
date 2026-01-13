# News Explorer — Backend

This repository contains the backend for the News Explorer application: user authentication, article CRUD, image handling (GridFS), validation, and JSON request/error logging.

## Quick Start

Requirements

- Node.js (recommended 18+) and npm
- A running MongoDB instance

Install

```bash
npm install
```

Environment

- Create a `.env` file or set environment variables in your environment.
- Required variables:
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — secret used to sign JWTs
  - `PORT` — optional (defaults to `3002`)

Run (development)

```bash
npm run dev   # or nodemon app.js
```

Run (production)

```bash
node app.js
```

## API Summary

All endpoints that modify or list user data require a bearer token in `Authorization: Bearer <token>`.

- `POST /auth/signup` — create account (body: `{ name, email, password }`) — returns `201`.
- `POST /auth/signin` — authenticate (body: `{ email, password }`) — returns JWT.
- `POST /auth/signout` — revoke current JWT.
- `GET /users/me` — get current user profile.

- `GET /articles` — list articles owned by authenticated user.
- `POST /articles` — create article. Accepts frontend and legacy shapes (supports `url` or `link`, `urlToImage` or `image`, `source` as string or `{ name }`). Returns `201` on success.
- `DELETE /articles/:articleId` — delete article by id (owner-only).
- `DELETE /articles` — delete by `{ url }` in request body.

- `GET /uploads/:id` — serve images from GridFS (by id) or from disk/filename fallback.

For detailed request/response examples and validation rules, see `ACCEPTANCE_CRITERIA.md`.

## Images

- The server attempts to fetch remote images provided on article creation and store them in GridFS (bucket `images`). Upload failures do not block article creation; the original image URL is retained as fallback.
- Uploaded images are served via `/uploads/:id` and include correct `Content-Type` and permissive CORP/CORS headers for embedding in the frontend.

## Logging

- JSON request logs: `logs/requests.log`.
- JSON error logs: `logs/errors.log`.
- Logs are written to files and not printed to the server console in normal operation.

## Testing

- Add automated tests (e.g., Jest + supertest) for auth flows, article CRUD, validation, and upload behavior.

## Acceptance Criteria

See `ACCEPTANCE_CRITERIA.md` for a testable checklist used to validate the backend.

## Troubleshooting

- If the server fails to start, check `MONGO_URI` and `JWT_SECRET` are set.
- If images fail to load, inspect `logs/errors.log` for GridFS upload errors and the `/articles` API response to confirm stored `urlToImage` or `imageFileId` values.

## Contributing

- Follow the acceptance criteria checklist when preparing PRs. Keep `node_modules/` out of commits.

## Deployment

front end - https://the-news-explorer.jumpingcrab.com/
back end - https://api-the-news-explorer.jumpingcrab.com/
