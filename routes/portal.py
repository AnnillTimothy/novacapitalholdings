from functools import wraps
from flask import Blueprint, render_template, redirect, url_for, abort
from flask_login import login_required, current_user
from models import db, User, Document, FinancialReport, BankingAccount, PortfolioCompany

portal_bp = Blueprint("portal", __name__)


def role_required(*roles):
    """Decorator to restrict access by role."""
    def decorator(f):
        @wraps(f)
        @login_required
        def decorated(*args, **kwargs):
            if current_user.role not in roles:
                return redirect(url_for("portal.dashboard"))
            return f(*args, **kwargs)
        return decorated
    return decorator


def fmt_currency(value):
    if value is None:
        return "$0"
    if abs(value) >= 1_000_000_000:
        return f"${value / 1_000_000_000:.1f}B"
    if abs(value) >= 1_000_000:
        return f"${value / 1_000_000:.1f}M"
    if abs(value) >= 1_000:
        return f"${value / 1_000:.1f}K"
    return f"${value:,.0f}"


@portal_bp.route("/")
@login_required
def dashboard():
    total_users = User.query.count()
    total_documents = Document.query.count()
    total_reports = FinancialReport.query.count()
    active_portfolio = PortfolioCompany.query.filter_by(status="Active").all()
    banking_accounts = BankingAccount.query.filter_by(is_active=True).all()

    total_aum = sum(a.balance for a in banking_accounts)
    total_portfolio_value = sum(c.valuation for c in active_portfolio)

    recent_documents = (
        Document.query.order_by(Document.created_at.desc())
        .limit(5)
        .all()
    )

    return render_template(
        "portal/dashboard.html",
        total_users=total_users,
        total_documents=total_documents,
        total_reports=total_reports,
        active_portfolio=active_portfolio,
        total_aum=total_aum,
        total_portfolio_value=total_portfolio_value,
        recent_documents=recent_documents,
        fmt_currency=fmt_currency,
    )


@portal_bp.route("/documents")
@login_required
def documents():
    if current_user.is_admin or current_user.is_analyst_or_above:
        docs = Document.query.order_by(Document.created_at.desc()).all()
    else:
        docs = Document.query.filter_by(is_confidential=False).order_by(
            Document.created_at.desc()
        ).all()

    categories = list(dict.fromkeys(d.category for d in docs))
    return render_template("portal/documents.html", documents=docs, categories=categories)


@portal_bp.route("/financials")
@role_required("ADMIN", "EXECUTIVE", "ANALYST")
def financials():
    reports = FinancialReport.query.order_by(FinancialReport.created_at.desc()).all()
    latest = reports[0] if reports else None
    return render_template(
        "portal/financials.html",
        reports=reports,
        latest=latest,
        fmt_currency=fmt_currency,
    )


@portal_bp.route("/banking")
@role_required("ADMIN", "EXECUTIVE")
def banking():
    accounts = BankingAccount.query.order_by(BankingAccount.balance.desc()).all()
    total_usd = sum(a.balance for a in accounts if a.currency == "USD")
    total_eur = sum(a.balance for a in accounts if a.currency == "EUR")
    active_count = sum(1 for a in accounts if a.is_active)
    return render_template(
        "portal/banking.html",
        accounts=accounts,
        total_usd=total_usd,
        total_eur=total_eur,
        active_count=active_count,
        fmt_currency=fmt_currency,
    )


@portal_bp.route("/users")
@role_required("ADMIN")
def users():
    all_users = User.query.order_by(User.role, User.name).all()
    role_count = {}
    for u in all_users:
        role_count[u.role] = role_count.get(u.role, 0) + 1
    return render_template("portal/users.html", users=all_users, role_count=role_count)
