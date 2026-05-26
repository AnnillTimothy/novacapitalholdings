from flask import Blueprint, render_template, request, flash, redirect, url_for
from models import db, PortfolioCompany

public_bp = Blueprint("public", __name__)

PORTFOLIO_COMPANIES = [
    {
        "name": "NovaTech Systems",
        "ticker": "NTS",
        "sector": "Technology",
        "description": "AI-powered enterprise software solutions revolutionizing how Fortune 500 companies manage operations, supply chains, and customer intelligence.",
        "ownership": 67.5,
        "valuation": 4_200_000_000,
        "invested": 850_000_000,
        "status": "Active",
        "employees": 2400,
        "founded": 2018,
        "headquarters": "San Francisco, CA",
        "growth": "+142%",
        "color": "amber",
    },
    {
        "name": "Quantum Energy Corp",
        "ticker": "QEC",
        "sector": "Clean Energy",
        "description": "Next-generation fusion and large-scale solar solutions, pioneering the transition to zero-carbon industrial energy with proprietary reactor technology.",
        "ownership": 42.0,
        "valuation": 8_700_000_000,
        "invested": 1_200_000_000,
        "status": "Active",
        "employees": 5600,
        "founded": 2015,
        "headquarters": "Houston, TX",
        "growth": "+89%",
        "color": "sky",
    },
    {
        "name": "BioNova Pharmaceuticals",
        "ticker": "BNP",
        "sector": "Healthcare",
        "description": "Gene therapy and precision medicine platform developing personalized treatments for rare diseases and oncology with breakthrough clinical trial results.",
        "ownership": 31.2,
        "valuation": 3_100_000_000,
        "invested": 620_000_000,
        "status": "Active",
        "employees": 1800,
        "founded": 2019,
        "headquarters": "Boston, MA",
        "growth": "+67%",
        "color": "emerald",
    },
    {
        "name": "MetaVerse Realty",
        "ticker": "MVR",
        "sector": "Real Estate",
        "description": "Converging digital and physical real estate markets through blockchain-based property tokenization and immersive virtual property experiences.",
        "ownership": 55.8,
        "valuation": 1_900_000_000,
        "invested": 310_000_000,
        "status": "Active",
        "employees": 890,
        "founded": 2021,
        "headquarters": "Miami, FL",
        "growth": "+215%",
        "color": "violet",
    },
    {
        "name": "Arctic Logistics",
        "ticker": "ARL",
        "sector": "Logistics",
        "description": "Autonomous supply chain and last-mile delivery infrastructure operator, leveraging robotics and AI to reduce logistics costs by up to 40%.",
        "ownership": 78.4,
        "valuation": 2_600_000_000,
        "invested": 450_000_000,
        "status": "Active",
        "employees": 7200,
        "founded": 2017,
        "headquarters": "Chicago, IL",
        "growth": "+54%",
        "color": "orange",
    },
    {
        "name": "DeepSea Mining Inc",
        "ticker": "DSM",
        "sector": "Resources",
        "description": "Sustainable deep-sea mineral extraction targeting critical battery materials with proprietary low-impact technology, supporting the global energy transition.",
        "ownership": 23.9,
        "valuation": 950_000_000,
        "invested": 180_000_000,
        "status": "Developing",
        "employees": 340,
        "founded": 2022,
        "headquarters": "Seattle, WA",
        "growth": "+12%",
        "color": "teal",
    },
]


def fmt_currency(value):
    if abs(value) >= 1_000_000_000:
        return f"${value / 1_000_000_000:.1f}B"
    if abs(value) >= 1_000_000:
        return f"${value / 1_000_000:.1f}M"
    return f"${value:,.0f}"


@public_bp.route("/")
def index():
    return render_template("index.html")


@public_bp.route("/about")
def about():
    return render_template("about.html")


@public_bp.route("/portfolio")
def portfolio():
    companies = PORTFOLIO_COMPANIES
    total_valuation = sum(c["valuation"] for c in companies)
    total_invested = sum(c["invested"] for c in companies)
    avg_return = round((total_valuation / total_invested - 1) * 100)
    return render_template(
        "portfolio.html",
        companies=companies,
        total_valuation=fmt_currency(total_valuation),
        total_invested=fmt_currency(total_invested),
        avg_return=avg_return,
        fmt_currency=fmt_currency,
    )


@public_bp.route("/contact", methods=["GET", "POST"])
def contact():
    submitted = False
    if request.method == "POST":
        submitted = True
    return render_template("contact.html", submitted=submitted)
