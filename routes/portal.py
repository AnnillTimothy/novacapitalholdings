from functools import wraps
from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify
from flask_login import login_required, current_user
from models import db, User, Document, FinancialReport, BankingAccount, PortfolioCompany, CompanyDocument, VAULT_TABS, COMPANY_CATEGORIES

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


# ──────────────────────────────────────────────
# Dashboard
# ──────────────────────────────────────────────

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


# ──────────────────────────────────────────────
# Documents (global)
# ──────────────────────────────────────────────

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


# ──────────────────────────────────────────────
# Financials
# ──────────────────────────────────────────────

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


# ──────────────────────────────────────────────
# Banking
# ──────────────────────────────────────────────

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


# ──────────────────────────────────────────────
# User Management
# ──────────────────────────────────────────────

@portal_bp.route("/users")
@role_required("ADMIN")
def users():
    all_users = User.query.order_by(User.role, User.name).all()
    role_count = {}
    for u in all_users:
        role_count[u.role] = role_count.get(u.role, 0) + 1
    return render_template("portal/users.html", users=all_users, role_count=role_count)


# ──────────────────────────────────────────────
# Companies CRUD
# ──────────────────────────────────────────────

@portal_bp.route("/companies")
@login_required
def companies():
    all_companies = PortfolioCompany.query.order_by(PortfolioCompany.name).all()
    sectors = list(dict.fromkeys(c.sector for c in all_companies))
    return render_template(
        "portal/companies.html",
        companies=all_companies,
        sectors=sectors,
        categories=COMPANY_CATEGORIES,
        fmt_currency=fmt_currency,
    )


@portal_bp.route("/companies/new", methods=["GET", "POST"])
@role_required("ADMIN")
def company_new():
    if request.method == "POST":
        company = PortfolioCompany(
            name=request.form["name"],
            ticker=request.form.get("ticker", "").upper() or None,
            sector=request.form["sector"],
            description=request.form["description"],
            ownership=float(request.form.get("ownership") or 0),
            valuation=float(request.form.get("valuation") or 0),
            invested=float(request.form.get("invested") or 0),
            status=request.form.get("status", "Active"),
            employees=int(request.form.get("employees") or 0) or None,
            founded=int(request.form.get("founded") or 0) or None,
            headquarters=request.form.get("headquarters", ""),
            growth=request.form.get("growth", ""),
            color=request.form.get("color", "amber"),
            is_public=request.form.get("is_public") == "on",
        )
        db.session.add(company)
        db.session.commit()
        flash(f'Company "{company.name}" created successfully.', "success")
        return redirect(url_for("portal.companies"))
    return render_template("portal/company_form.html", company=None, categories=COMPANY_CATEGORIES)


@portal_bp.route("/companies/<company_id>/edit", methods=["GET", "POST"])
@role_required("ADMIN")
def company_edit(company_id):
    company = PortfolioCompany.query.get_or_404(company_id)
    if request.method == "POST":
        company.name = request.form["name"]
        company.ticker = request.form.get("ticker", "").upper() or None
        company.sector = request.form["sector"]
        company.description = request.form["description"]
        company.ownership = float(request.form.get("ownership") or 0)
        company.valuation = float(request.form.get("valuation") or 0)
        company.invested = float(request.form.get("invested") or 0)
        company.status = request.form.get("status", "Active")
        company.employees = int(request.form.get("employees") or 0) or None
        company.founded = int(request.form.get("founded") or 0) or None
        company.headquarters = request.form.get("headquarters", "")
        company.growth = request.form.get("growth", "")
        company.color = request.form.get("color", "amber")
        company.is_public = request.form.get("is_public") == "on"
        db.session.commit()
        flash(f'Company "{company.name}" updated successfully.', "success")
        return redirect(url_for("portal.companies"))
    return render_template("portal/company_form.html", company=company, categories=COMPANY_CATEGORIES)


@portal_bp.route("/companies/<company_id>/delete", methods=["POST"])
@role_required("ADMIN")
def company_delete(company_id):
    company = PortfolioCompany.query.get_or_404(company_id)
    name = company.name
    db.session.delete(company)
    db.session.commit()
    flash(f'Company "{name}" has been deleted.', "success")
    return redirect(url_for("portal.companies"))


@portal_bp.route("/companies/<company_id>/toggle", methods=["POST"])
@role_required("ADMIN")
def company_toggle(company_id):
    company = PortfolioCompany.query.get_or_404(company_id)
    company.is_public = not company.is_public
    db.session.commit()
    status = "visible" if company.is_public else "hidden"
    flash(f'"{company.name}" is now {status} on the public site.', "success")
    return redirect(url_for("portal.companies"))


# ──────────────────────────────────────────────
# Company Document Vault
# ──────────────────────────────────────────────

@portal_bp.route("/companies/<company_id>/vault")
@login_required
def vault(company_id):
    company = PortfolioCompany.query.get_or_404(company_id)
    active_tab = request.args.get("tab", "Financials")
    if active_tab not in VAULT_TABS:
        active_tab = "Financials"
    return render_template(
        "portal/company_vault.html",
        company=company,
        vault_tabs=VAULT_TABS,
        active_tab=active_tab,
    )


@portal_bp.route("/companies/<company_id>/vault/add", methods=["POST"])
@role_required("ADMIN", "ANALYST")
def vault_add(company_id):
    company = PortfolioCompany.query.get_or_404(company_id)
    vault_tab = request.form.get("vault_tab", "Financials")
    if vault_tab not in VAULT_TABS:
        vault_tab = "Financials"
    doc = CompanyDocument(
        company_id=company.id,
        vault_tab=vault_tab,
        title=request.form["title"],
        description=request.form.get("description", ""),
        document_type=request.form.get("document_type", ""),
        file_url=request.form.get("file_url", ""),
        notes=request.form.get("notes", ""),
        is_confidential=request.form.get("is_confidential") == "on",
        uploaded_by=current_user.id,
    )
    db.session.add(doc)
    db.session.commit()
    flash(f'Document "{doc.title}" added to {vault_tab} vault.', "success")
    return redirect(url_for("portal.vault", company_id=company_id, tab=vault_tab))


@portal_bp.route("/companies/<company_id>/vault/<doc_id>/edit", methods=["GET", "POST"])
@role_required("ADMIN", "ANALYST")
def vault_edit(company_id, doc_id):
    company = PortfolioCompany.query.get_or_404(company_id)
    doc = CompanyDocument.query.get_or_404(doc_id)
    if doc.company_id != company_id:
        return redirect(url_for("portal.vault", company_id=company_id))
    if request.method == "POST":
        doc.title = request.form["title"]
        doc.description = request.form.get("description", "")
        doc.document_type = request.form.get("document_type", "")
        doc.file_url = request.form.get("file_url", "")
        doc.notes = request.form.get("notes", "")
        doc.is_confidential = request.form.get("is_confidential") == "on"
        db.session.commit()
        flash(f'Document "{doc.title}" updated.', "success")
        return redirect(url_for("portal.vault", company_id=company_id, tab=doc.vault_tab))
    return render_template(
        "portal/vault_doc_form.html",
        company=company,
        doc=doc,
        vault_tabs=VAULT_TABS,
    )


@portal_bp.route("/companies/<company_id>/vault/<doc_id>/delete", methods=["POST"])
@role_required("ADMIN")
def vault_delete(company_id, doc_id):
    doc = CompanyDocument.query.get_or_404(doc_id)
    tab = doc.vault_tab
    title = doc.title
    db.session.delete(doc)
    db.session.commit()
    flash(f'Document "{title}" deleted.', "success")
    return redirect(url_for("portal.vault", company_id=company_id, tab=tab))


# ──────────────────────────────────────────────
# Global Search API
# ──────────────────────────────────────────────

@portal_bp.route("/search")
@login_required
def search():
    q = request.args.get("q", "").strip().lower()
    if not q or len(q) < 2:
        return jsonify({"companies": [], "documents": [], "vault_docs": []})

    # Companies
    company_results = PortfolioCompany.query.filter(
        db.or_(
            PortfolioCompany.name.ilike(f"%{q}%"),
            PortfolioCompany.sector.ilike(f"%{q}%"),
            PortfolioCompany.description.ilike(f"%{q}%"),
            PortfolioCompany.headquarters.ilike(f"%{q}%"),
        )
    ).limit(8).all()

    # Global Documents
    doc_query = Document.query.filter(
        db.or_(
            Document.title.ilike(f"%{q}%"),
            Document.description.ilike(f"%{q}%"),
            Document.category.ilike(f"%{q}%"),
        )
    )
    if not current_user.is_analyst_or_above:
        doc_query = doc_query.filter_by(is_confidential=False)
    docs = doc_query.limit(8).all()

    # Vault Documents
    vault_query = CompanyDocument.query.filter(
        db.or_(
            CompanyDocument.title.ilike(f"%{q}%"),
            CompanyDocument.document_type.ilike(f"%{q}%"),
            CompanyDocument.description.ilike(f"%{q}%"),
        )
    )
    if not current_user.is_analyst_or_above:
        vault_query = vault_query.filter_by(is_confidential=False)
    vault_docs = vault_query.limit(8).all()

    return jsonify({
        "companies": [
            {
                "id": c.id,
                "name": c.name,
                "sector": c.sector,
                "status": c.status,
                "url": url_for("portal.vault", company_id=c.id),
            }
            for c in company_results
        ],
        "documents": [
            {
                "id": d.id,
                "title": d.title,
                "category": d.category,
                "is_confidential": d.is_confidential,
                "url": url_for("portal.documents"),
            }
            for d in docs
        ],
        "vault_docs": [
            {
                "id": d.id,
                "title": d.title,
                "vault_tab": d.vault_tab,
                "company": d.company.name,
                "document_type": d.document_type or "",
                "url": url_for("portal.vault", company_id=d.company_id, tab=d.vault_tab),
            }
            for d in vault_docs
        ],
    })
