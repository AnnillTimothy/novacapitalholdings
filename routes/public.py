from flask import Blueprint, render_template, request
from models import db, PortfolioCompany

public_bp = Blueprint("public", __name__)


def fmt_currency(value):
    if value is None:
        return "$0"
    if abs(value) >= 1_000_000_000:
        return f"${value / 1_000_000_000:.1f}B"
    if abs(value) >= 1_000_000:
        return f"${value / 1_000_000:.1f}M"
    return f"${value:,.0f}"


@public_bp.route("/")
def index():
    public_companies = PortfolioCompany.query.filter_by(is_public=True).all()
    sectors = list(dict.fromkeys(c.sector for c in public_companies))
    return render_template("index.html", public_companies=public_companies, sectors=sectors)


@public_bp.route("/about")
def about():
    return render_template("about.html")


@public_bp.route("/portfolio")
def portfolio():
    companies = PortfolioCompany.query.filter_by(is_public=True).order_by(
        PortfolioCompany.valuation.desc()
    ).all()
    total_valuation = sum(c.valuation for c in companies) if companies else 0
    total_invested = sum(c.invested for c in companies) if companies else 0
    avg_return = round((total_valuation / total_invested - 1) * 100) if total_invested else 0
    return render_template(
        "portfolio.html",
        companies=companies,
        total_valuation=fmt_currency(total_valuation),
        total_invested=fmt_currency(total_invested),
        avg_return=avg_return,
        fmt_currency=fmt_currency,
    )


@public_bp.route("/company/<company_id>")
def company_detail(company_id):
    company = PortfolioCompany.query.get_or_404(company_id)
    if not company.is_public:
        from flask import abort
        abort(404)
    # Get other companies for "More Companies" section
    other_companies = PortfolioCompany.query.filter(
        PortfolioCompany.id != company_id,
        PortfolioCompany.is_public == True
    ).limit(3).all()
    return render_template("company_detail.html", company=company, other_companies=other_companies, fmt_currency=fmt_currency)


@public_bp.route("/contact", methods=["GET", "POST"])
def contact():
    submitted = False
    if request.method == "POST":
        submitted = True
    return render_template("contact.html", submitted=submitted)
