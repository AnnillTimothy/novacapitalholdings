from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
import uuid

db = SQLAlchemy()


def generate_id():
    return str(uuid.uuid4())


class UserRole:
    ADMIN = "ADMIN"
    EXECUTIVE = "EXECUTIVE"
    ANALYST = "ANALYST"
    VIEWER = "VIEWER"

    ALL = [ADMIN, EXECUTIVE, ANALYST, VIEWER]


class User(db.Model, UserMixin):
    __tablename__ = "user"

    id = db.Column(db.String(36), primary_key=True, default=generate_id)
    name = db.Column(db.String(200))
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200))
    role = db.Column(db.String(20), nullable=False, default=UserRole.VIEWER)
    department = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    documents = db.relationship("Document", backref="uploader", lazy=True)

    def get_initials(self):
        if self.name:
            parts = self.name.split()
            return "".join(p[0] for p in parts[:2]).upper()
        return "??"

    def has_role(self, *roles):
        return self.role in roles

    @property
    def is_admin(self):
        return self.role == UserRole.ADMIN

    @property
    def is_exec_or_admin(self):
        return self.role in (UserRole.ADMIN, UserRole.EXECUTIVE)

    @property
    def is_analyst_or_above(self):
        return self.role in (UserRole.ADMIN, UserRole.EXECUTIVE, UserRole.ANALYST)


class Document(db.Model):
    __tablename__ = "document"

    id = db.Column(db.String(36), primary_key=True, default=generate_id)
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)
    file_url = db.Column(db.String(500))
    file_size = db.Column(db.Integer)
    mime_type = db.Column(db.String(100))
    is_confidential = db.Column(db.Boolean, default=False)
    uploaded_by = db.Column(db.String(36), db.ForeignKey("user.id"), nullable=False)
    tags = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FinancialReport(db.Model):
    __tablename__ = "financial_report"

    id = db.Column(db.String(36), primary_key=True, default=generate_id)
    title = db.Column(db.String(500), nullable=False)
    period = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    total_assets = db.Column(db.Float, nullable=False)
    total_revenue = db.Column(db.Float, nullable=False)
    net_income = db.Column(db.Float, nullable=False)
    data = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BankingAccount(db.Model):
    __tablename__ = "banking_account"

    id = db.Column(db.String(36), primary_key=True, default=generate_id)
    account_name = db.Column(db.String(200), nullable=False)
    bank_name = db.Column(db.String(200), nullable=False)
    account_type = db.Column(db.String(100), nullable=False)
    currency = db.Column(db.String(10), default="USD")
    balance = db.Column(db.Float, default=0)
    masked_number = db.Column(db.String(50), nullable=False)
    swift_code = db.Column(db.String(50))
    routing_number = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PortfolioCompany(db.Model):
    __tablename__ = "portfolio_company"

    id = db.Column(db.String(36), primary_key=True, default=generate_id)
    name = db.Column(db.String(200), nullable=False)
    ticker = db.Column(db.String(20))
    sector = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    ownership = db.Column(db.Float, nullable=False)
    valuation = db.Column(db.Float, nullable=False)
    invested = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Active")
    logo_url = db.Column(db.String(500))
    website = db.Column(db.String(500))
    employees = db.Column(db.Integer)
    founded = db.Column(db.Integer)
    headquarters = db.Column(db.String(200))
    color = db.Column(db.String(50), default="amber")
    growth = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def roi(self):
        if self.invested and self.invested > 0:
            return ((self.valuation / self.invested) - 1) * 100
        return 0
