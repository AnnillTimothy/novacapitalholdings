"""Seed the database with demo data."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import app, bcrypt
from models import db, User, Document, FinancialReport, BankingAccount, PortfolioCompany, UserRole
from datetime import datetime, timedelta


def seed():
    with app.app_context():
        db.create_all()

        # --- Users ---
        users_data = [
            {
                "name": "Alexander Nova",
                "email": "admin@novacapital.com",
                "password": "admin123!",
                "role": UserRole.ADMIN,
                "department": "Executive",
            },
            {
                "name": "Sarah Chen",
                "email": "executive@novacapital.com",
                "password": "exec123!",
                "role": UserRole.EXECUTIVE,
                "department": "Investment",
            },
            {
                "name": "Marcus Williams",
                "email": "analyst@novacapital.com",
                "password": "analyst123!",
                "role": UserRole.ANALYST,
                "department": "Risk & Analytics",
            },
            {
                "name": "Elena Reyes",
                "email": "viewer@novacapital.com",
                "password": "viewer123!",
                "role": UserRole.VIEWER,
                "department": "Technology",
            },
        ]

        created_users = {}
        for ud in users_data:
            existing = User.query.filter_by(email=ud["email"]).first()
            if not existing:
                hashed = bcrypt.generate_password_hash(ud["password"]).decode("utf-8")
                user = User(
                    name=ud["name"],
                    email=ud["email"],
                    password=hashed,
                    role=ud["role"],
                    department=ud["department"],
                )
                db.session.add(user)
                db.session.flush()
                created_users[ud["email"]] = user
                print(f"  Created user: {ud['email']} ({ud['role']})")
            else:
                created_users[ud["email"]] = existing
                print(f"  User exists: {ud['email']}")

        db.session.commit()

        admin_user = created_users.get("admin@novacapital.com") or User.query.filter_by(
            email="admin@novacapital.com"
        ).first()

        # --- Portfolio Companies ---
        companies_data = [
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
                "color": "amber",
                "growth": "+142%",
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
                "color": "sky",
                "growth": "+89%",
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
                "color": "emerald",
                "growth": "+67%",
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
                "color": "violet",
                "growth": "+215%",
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
                "color": "orange",
                "growth": "+54%",
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
                "color": "teal",
                "growth": "+12%",
            },
        ]

        for cd in companies_data:
            if not PortfolioCompany.query.filter_by(name=cd["name"]).first():
                company = PortfolioCompany(**cd)
                db.session.add(company)
                print(f"  Created portfolio company: {cd['name']}")

        db.session.commit()

        # --- Financial Reports ---
        reports_data = [
            {
                "title": "Q4 2024 Financial Report",
                "period": "Q4 2024",
                "type": "Quarterly",
                "total_assets": 24_500_000_000,
                "total_revenue": 3_200_000_000,
                "net_income": 980_000_000,
                "data": "{}",
            },
            {
                "title": "Q3 2024 Financial Report",
                "period": "Q3 2024",
                "type": "Quarterly",
                "total_assets": 22_800_000_000,
                "total_revenue": 2_950_000_000,
                "net_income": 870_000_000,
                "data": "{}",
            },
            {
                "title": "FY 2023 Annual Report",
                "period": "FY 2023",
                "type": "Annual",
                "total_assets": 19_200_000_000,
                "total_revenue": 10_400_000_000,
                "net_income": 3_100_000_000,
                "data": "{}",
            },
            {
                "title": "Q2 2024 Financial Report",
                "period": "Q2 2024",
                "type": "Quarterly",
                "total_assets": 21_100_000_000,
                "total_revenue": 2_780_000_000,
                "net_income": 815_000_000,
                "data": "{}",
            },
            {
                "title": "Q1 2024 Financial Report",
                "period": "Q1 2024",
                "type": "Quarterly",
                "total_assets": 20_300_000_000,
                "total_revenue": 2_640_000_000,
                "net_income": 760_000_000,
                "data": "{}",
            },
        ]

        for i, rd in enumerate(reports_data):
            if not FinancialReport.query.filter_by(title=rd["title"]).first():
                report = FinancialReport(
                    **rd,
                    created_at=datetime.utcnow() - timedelta(days=i * 90),
                )
                db.session.add(report)
                print(f"  Created report: {rd['title']}")

        db.session.commit()

        # --- Banking Accounts ---
        banking_data = [
            {
                "account_name": "Nova Capital Primary Operations",
                "bank_name": "JPMorgan Chase",
                "account_type": "Checking",
                "currency": "USD",
                "balance": 485_000_000,
                "masked_number": "****4821",
                "swift_code": "CHASUS33",
                "routing_number": "021000021",
                "is_active": True,
            },
            {
                "account_name": "Investment Reserve Fund",
                "bank_name": "Goldman Sachs Bank",
                "account_type": "Investment",
                "currency": "USD",
                "balance": 2_140_000_000,
                "masked_number": "****7734",
                "swift_code": "GSCOSGSX",
                "routing_number": "026005092",
                "is_active": True,
            },
            {
                "account_name": "European Operations Account",
                "bank_name": "Deutsche Bank",
                "account_type": "Checking",
                "currency": "EUR",
                "balance": 320_000_000,
                "masked_number": "****2219",
                "swift_code": "DEUTDEDB",
                "is_active": True,
            },
            {
                "account_name": "Capital Preservation Savings",
                "bank_name": "Bank of America",
                "account_type": "Savings",
                "currency": "USD",
                "balance": 875_000_000,
                "masked_number": "****6603",
                "swift_code": "BOFAUS3N",
                "routing_number": "026009593",
                "is_active": True,
            },
        ]

        for bd in banking_data:
            if not BankingAccount.query.filter_by(account_name=bd["account_name"]).first():
                account = BankingAccount(**bd)
                db.session.add(account)
                print(f"  Created banking account: {bd['account_name']}")

        db.session.commit()

        # --- Documents ---
        if admin_user:
            documents_data = [
                {
                    "title": "Master Investment Agreement 2024",
                    "description": "Governing investment framework for all portfolio acquisitions and strategic partnerships.",
                    "category": "Legal",
                    "is_confidential": True,
                    "tags": "legal,investment,agreement,2024",
                },
                {
                    "title": "Q4 2024 Investor Relations Report",
                    "description": "Comprehensive investor relations update including portfolio performance and strategic outlook.",
                    "category": "Investor Relations",
                    "is_confidential": False,
                    "tags": "investor,quarterly,2024,performance",
                },
                {
                    "title": "NovaTech Systems Acquisition Terms",
                    "description": "Confidential terms and conditions for the NovaTech Systems stake acquisition.",
                    "category": "M&A",
                    "is_confidential": True,
                    "tags": "M&A,acquisition,NovaTech,technology",
                },
                {
                    "title": "AML Compliance Framework",
                    "description": "Anti-money laundering compliance procedures and reporting requirements.",
                    "category": "Compliance",
                    "is_confidential": True,
                    "tags": "compliance,AML,regulatory,framework",
                },
                {
                    "title": "Executive Compensation Structure",
                    "description": "Board-approved compensation and benefits framework for executive leadership.",
                    "category": "HR",
                    "is_confidential": True,
                    "tags": "HR,compensation,executive,benefits",
                },
                {
                    "title": "Portfolio Valuation Methodology",
                    "description": "Internal valuation methods used for portfolio company assessments.",
                    "category": "Finance",
                    "is_confidential": False,
                    "tags": "finance,valuation,methodology,portfolio",
                },
                {
                    "title": "ESG Policy & Reporting Standards",
                    "description": "Environmental, Social, and Governance framework for portfolio companies.",
                    "category": "Compliance",
                    "is_confidential": False,
                    "tags": "ESG,compliance,sustainability,reporting",
                },
                {
                    "title": "Quantum Energy Due Diligence Report",
                    "description": "Full due diligence documentation for Quantum Energy Corp investment.",
                    "category": "M&A",
                    "is_confidential": True,
                    "tags": "M&A,due-diligence,Quantum,energy",
                },
            ]

            for i, dd in enumerate(documents_data):
                if not Document.query.filter_by(title=dd["title"]).first():
                    doc = Document(
                        **dd,
                        uploaded_by=admin_user.id,
                        created_at=datetime.utcnow() - timedelta(days=i * 7),
                    )
                    db.session.add(doc)
                    print(f"  Created document: {dd['title']}")

            db.session.commit()

        print("\n✅ Database seeded successfully!")
        print("\nDemo credentials:")
        print("  Admin:     admin@novacapital.com     / admin123!")
        print("  Executive: executive@novacapital.com / exec123!")
        print("  Analyst:   analyst@novacapital.com   / analyst123!")
        print("  Viewer:    viewer@novacapital.com    / viewer123!")


if __name__ == "__main__":
    seed()
