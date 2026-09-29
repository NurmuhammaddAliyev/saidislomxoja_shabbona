# Wedding Invitation — Django & React

An interactive wedding invitation with event information, RSVP responses, guest wishes and a private dashboard.

**Stack:** React · Vite · Framer Motion · Django REST Framework · SQLite / PostgreSQL

## Features

- Animated invitation, countdown, event schedule and venue sections.
- RSVP submission and a guest wishes wall.
- Password-protected dashboard endpoints for guest responses and statistics.
- Django admin for editing wedding information.
- Vite proxy for local API requests and a Render deployment blueprint.

## Run locally

Use Python 3.11 or 3.12 and Node.js 22.12+.

```bash
git clone https://github.com/NurmuhammaddAliyev/saidislomxoja_shabbona.git
cd saidislomxoja_shabbona
python -m venv .venv
```

Activate with `.venv\Scripts\Activate.ps1` on Windows PowerShell or `source .venv/bin/activate` on macOS/Linux.

### Backend

```bash
python -m pip install -r deploy_ready/config/requirements.txt
cd deploy_ready/config
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

SQLite is used when `DATABASE_URL` is unset. Visit [Django admin](http://127.0.0.1:8000/admin/) and create a wedding record. Its slug must match `WEDDING_SLUG` in [the frontend API client](wedding_react/src/lib/api.js), currently `saidislomxoja_shabbona`. Fill in the event information and choose a separate dashboard password.

### Frontend

In a second terminal, start from the repository root:

```bash
cd wedding_react
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite forwards `/api` and `/media` to Django at `http://127.0.0.1:8000`; no frontend environment variable is required for this local setup.

## Project structure

```text
deploy_ready/config/     Django application, migrations and dependencies
wedding_react/src/       React sections, animations and API client
wedding_react/public/    Images and audio
render.yaml             Hosting blueprint
```

## API overview

All routes below are under `/api/weddings/<slug>/`.

| Route | Purpose |
| --- | --- |
| `/` | Wedding details |
| `rsvp/` | Submit a guest response |
| `wishes/` | Read guest wishes |
| `dashboard/login/` | Dashboard authentication |
| `dashboard/stats/` | Dashboard statistics |
| `dashboard/guests/` | Guest response list |

Dashboard requests use the `X-Dashboard-Token` header returned by login.

## Build and deployment

Run `npm run build` inside `wedding_react/` to build the frontend. Run `python manage.py check` inside `deploy_ready/config/` to check Django configuration.

See [deployment notes](deploy_ready/RENDER_DEPLOY.md) and [render.yaml](render.yaml). Hosting prices and limits can change; verify the provider's current terms before deployment. Use your own production secret and database, and make sure API rewrites point to the actual backend hostname.

## Author

[Nurmuhammad Aliyev](https://github.com/NurmuhammaddAliyev) · [Telegram](https://t.me/nurmuhammad252505)
