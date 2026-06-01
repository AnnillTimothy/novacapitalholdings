# Nova Capital Holdings

A cinematic investor portal for Nova Capital Holdings — built with **Flask**, **SQLAlchemy**, and **Jinja2** templates. Features a dark cinematic GSAP Observer scroll-driven experience on the public site, Tailwind CSS throughout, and a role-based internal portal for managing portfolio companies and document vaults.

## Tech Stack

- **Backend**: Flask + SQLAlchemy (SQLite)
- **Auth**: Flask-Login + Flask-Bcrypt (RBAC: Admin, Executive, Analyst, Viewer)
- **Frontend**: Jinja2 templates, Tailwind CSS (CDN), GSAP + Observer (CDN)
- **Database**: SQLite (file-based, auto-created on first run)

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
python seed.py
python app.py
```

App runs at `http://localhost:5000`.

## Demo Credentials

| Role      | Email                     | Password    |
|-----------|---------------------------|-------------|
| Admin     | admin@novacapital.com     | admin123!   |
| Executive | executive@novacapital.com | exec123!    |
| Analyst   | analyst@novacapital.com   | analyst123! |
| Viewer    | viewer@novacapital.com    | viewer123!  |

## Pages

### Public
- `/` — Cinematic GSAP Observer scroll experience (8-panel narrative)
- `/about` — About, mission, leadership, milestones
- `/portfolio` — Portfolio companies grid with stats
- `/company/<id>` — Individual company detail page
- `/contact` — Contact form

### Portal (authenticated)
- `/portal/` — Dashboard (all roles)
- `/portal/documents` — Documents (Viewer sees non-confidential only)
- `/portal/financials` — Financial reports (Analyst+)
- `/portal/banking` — Banking accounts (Executive+)
- `/portal/users` — User management (Admin only)
- `/portal/companies` — Company CRUD management (Admin can add/edit/delete/toggle visibility)
- `/portal/companies/<id>/vault` — Document vault per company (Financials / Legal / Operations tabs)
- `/portal/search` — Global search across companies and vault documents
