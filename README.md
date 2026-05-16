# Notes Web App

A real-time collaborative note-taking application with rich-text editing, label organization, sharing, full-text search, and offline (PWA) support.

**Official Website:** [https://shikii.dev](https://shikii.dev)

---

## Description

Notes Web App is a full-stack note-taking platform built around three coordinated services:

- A **Laravel 13** REST API (source of truth for users, notes, labels, sharing, images).
- A **React 19 + TypeScript + Vite** PWA frontend with a Tiptap-based rich-text editor.
- A **Hocuspocus / Yjs** Node.js server that powers conflict-free real-time collaboration on shared notes.

Auxiliary services include MySQL (data), Redis (cache/queue), Meilisearch (full-text search), Cloudinary (image hosting), and an optional Cloudflare Tunnel for public exposure. The whole stack is containerized with Docker Compose for one-command setup.

---

## Features

- **Authentication** — register, login, logout, email verification, password reset (Sanctum + queued mailers).
- **Rich-text notes** — Tiptap editor with images, placeholders, and starter formatting extensions.
- **Labels** — create, assign, and filter notes by label.
- **Archive & Trash** — soft-archive, soft-delete, restore, and permanently delete notes.
- **Note locking** — protect individual notes behind an unlock check.
- **Real-time collaboration** — multi-user editing on shared notes via Yjs CRDT through Hocuspocus, with collaboration carets showing who is editing.
- **Sharing & permissions** — invite users to a note and manage their access level.
- **Image uploads** — direct upload to Cloudinary, automatic optimization and resizing.
- **Full-text search** — Meilisearch-powered search across your notes (`/notes/search`).
- **Offline / PWA** — installable PWA with service worker, IndexedDB-backed React Query persistence, and background sync.
- **Avatars & profile** — user avatar upload and account settings.
- **Async email** — verification and password reset emails run through Laravel queues.

---

## Tech Stack

| Layer | Stack |
| --- | --- |
| Backend | Laravel 13, PHP 8.3, Sanctum, Scout, Intervention Image, Cloudinary SDK |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, Tiptap 3, TanStack Query, React Router 7 |
| Realtime | Node.js, Hocuspocus, Yjs |
| Data | MySQL 8, Redis, Meilisearch |
| Infra | Docker Compose, Nginx, Cloudflare Tunnel |

---

## Installation

### Prerequisites

- Docker & Docker Compose, **or** a local toolchain with PHP 8.3+, Composer, Node.js 20+, pnpm, MySQL 8, Redis.
- A Cloudinary account (for image uploads) and Mailtrap / SMTP credentials (for email).

### Option A — Docker Compose (recommended)

```bash
# 1. Clone the repository
git clone https://github.com/ShikiHTM/notes-app-api.git
cd notes-app-api

# 2. Create environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp yjs-server/.env.example yjs-server/.env

# 3. Fill in credentials in .env
#    - DB_DATABASE / DB_USERNAME / DB_PASSWORD
#    - CLOUDINARY_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
#    - MAIL_* (Mailtrap or your SMTP provider)
#    - MEILISEARCH_KEY
#    - CLOUDFLARE_TUNNEL_TOKEN (optional — only if exposing publicly)

# 4. Start the stack
docker compose up -d

# 5. Run migrations inside the backend container
docker compose exec backend php artisan migrate
docker compose exec backend php artisan key:generate
```

The app will be available at `http://localhost:8000` (Nginx fronts both the API and the frontend bundle).

### Option B — Local development

**Backend**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
composer dev   # runs serve + queue + pail + vite concurrently
```

**Frontend**
```bash
cd frontend
pnpm install
pnpm dev
```

**Yjs collaboration server**
```bash
cd yjs-server
pnpm install
pnpm dev
```

---

## Project Structure

```
notes-app-api/
├── backend/                  # Laravel 13 REST API
│   ├── app/
│   │   ├── Http/             # Controllers, Requests, Resources, Middleware
│   │   ├── Models/           # Eloquent models (User, Note, Label, NoteShare, ...)
│   │   ├── Events/           # Domain events
│   │   ├── Mail/             # Mailables (verification, password reset)
│   │   ├── Notifications/
│   │   ├── Providers/
│   │   └── Services/         # Application services
│   ├── database/             # Migrations, seeders, factories
│   ├── routes/api.php        # API v1 routes
│   ├── tests/                # PHPUnit feature + unit tests
│   └── Dockerfile
│
├── frontend/                 # React 19 + Vite PWA
│   ├── src/
│   │   ├── api/              # Axios client + API modules
│   │   ├── components/       # auth, modal, note, settings, ui
│   │   ├── pages/            # notes, archive, trash, labels, shared, auth, settings
│   │   ├── hooks/            # custom hooks (incl. NoteCollab.hook.ts)
│   │   ├── context/          # React contexts
│   │   ├── core/             # editor / collab core wiring
│   │   ├── routes/           # route definitions
│   │   ├── types/
│   │   └── test/             # Vitest + Testing Library setup
│   ├── public/
│   └── Dockerfile
│
├── yjs-server/               # Hocuspocus + Yjs collaboration server
│   ├── index.mts             # Server entry
│   ├── axios.mts             # Backend webhook client
│   ├── logger.mts            # Winston logger
│   └── Dockerfile
│
├── docker/                   # Nginx config for the webserver container
│   └── nginx.conf
├── docker-compose.yml        # Orchestrates frontend / backend / nginx / db / redis / hocuspocus / meilisearch / tunnel
├── .env.example
└── README.md
```

### Service map (docker-compose)

| Service | Image | Role |
| --- | --- | --- |
| `frontend` | `notes-app-frontend` | Static React PWA bundle |
| `backend` | `notes-app-backend` | Laravel API (PHP-FPM) |
| `webserver` | `notes-app-nginx` | Nginx reverse proxy, port `8000` |
| `db` | `mysql:8.0` | Primary database |
| `redis` | `redis:alpine` | Cache / queue driver |
| `hocuspocus` | `notes-app-yjs` | Yjs realtime collaboration server |
| `meilisearch` | `getmeili/meilisearch` | Full-text search engine |
| `tunnel` | `cloudflare/cloudflared` | Optional public tunnel |

---

## Contributing

Contributions are welcome! Whether it's a bug fix, a new feature, docs, or tests — please follow the workflow below.

### 1. Fork & branch

```bash
# Fork on GitHub, then:
git clone https://github.com/<your-username>/notes-app-api.git
cd notes-app-api
git checkout -b feat/<short-description>
```

Branch naming: `feat/...`, `fix/...`, `docs/...`, `refactor/...`, `test/...`.

### 2. Set up locally

Follow the [Installation](#installation) section. Make sure migrations and the dev servers run cleanly before you start changing code.

### 3. Code style

- **Backend** — `composer pint` for PHP CS Fixer / Laravel Pint formatting. Keep controllers thin; put business logic in `app/Services`.
- **Frontend** — `pnpm lint` (ESLint + typescript-eslint) and Prettier. TypeScript is strict — no `any` unless justified.
- **Yjs server** — same Prettier config as the frontend.

### 4. Tests

- Backend: `php artisan test` (PHPUnit feature + unit tests under `backend/tests`).
- Frontend: `pnpm test` (Vitest + Testing Library).

Add tests for any new behavior. Bug fixes should ship with a regression test.

### 5. Commit messages

This repo follows **Conventional Commits**:

```
feat: add note sharing dialog
fix(api): prevent duplicate label assignment
docs: document yjs webhook payload
chore(deps): bump tiptap to 3.23.4
```

Scopes are optional. Keep subject lines under ~72 chars.

### 6. Pull request

- Target the `master` branch.
- Describe **what** changed and **why**. Link any related issue.
- Include screenshots or short clips for UI changes.
- Make sure CI is green and there are no merge conflicts.

### 7. Reporting issues

Open a GitHub issue with:
- Reproduction steps
- Expected vs. actual behavior
- Environment (OS, browser, Docker vs. local)
- Relevant logs (`docker compose logs <service>`)

---

## License

This project is open-sourced under the **MIT License**.
