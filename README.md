# Nova Capital Holdings

A private investor portal for Nova Capital Holdings — built with **Flask**, **SQLAlchemy**, and **Jinja2** templates. Features a dark cinematic design with GSAP animations, Tailwind CSS, and role-based access control.

## Tech Stack

- **Backend**: Flask + SQLAlchemy (SQLite)
- **Auth**: Flask-Login + Flask-Bcrypt
- **Templates**: Jinja2 with Tailwind CSS (CDN) + GSAP animations (CDN)

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
- `/` — Landing page  
- `/about` — About  
- `/portfolio` — Portfolio companies  
- `/contact` — Contact form

### Portal (authenticated)
- `/portal` — Dashboard (all roles)
- `/portal/documents` — Documents (Viewer sees non-confidential only)
- `/portal/financials` — Financial reports (Analyst+)
- `/portal/banking` — Banking accounts (Executive+)
- `/portal/users` — User management (Admin only)
