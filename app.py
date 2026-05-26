import os
from flask import Flask
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from models import db, User

load_dotenv()

# Extensions
bcrypt = Bcrypt()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)

    # Configuration
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:///nova.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Init extensions
    db.init_app(app)
    bcrypt.init_app(app)

    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please log in to access the portal."
    login_manager.login_message_category = "warning"

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, user_id)

    # Register blueprints
    from routes.public import public_bp
    from routes.auth import auth_bp
    from routes.portal import portal_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(portal_bp, url_prefix="/portal")

    # Template filters
    @app.template_filter("currency")
    def currency_filter(value):
        if value is None:
            return "$0"
        if abs(value) >= 1_000_000_000:
            return f"${value / 1_000_000_000:.1f}B"
        if abs(value) >= 1_000_000:
            return f"${value / 1_000_000:.1f}M"
        if abs(value) >= 1_000:
            return f"${value / 1_000:.1f}K"
        return f"${value:,.0f}"

    @app.template_filter("format_date")
    def format_date_filter(value):
        if value is None:
            return ""
        return value.strftime("%b %d, %Y")

    @app.template_filter("initials")
    def initials_filter(name):
        if not name:
            return "??"
        parts = name.split()
        return "".join(p[0] for p in parts[:2]).upper()

    return app


app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=os.environ.get("FLASK_DEBUG", "true").lower() == "true", port=5000)
