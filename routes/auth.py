from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User

auth_bp = Blueprint("auth", __name__)

# Whitelist of allowed "next" paths after login, mapped to safe Flask endpoints.
# Using url_for() for all redirects prevents open-redirect vulnerabilities.
_NEXT_ENDPOINT_MAP = {
    "/portal": "portal.dashboard",
    "/portal/": "portal.dashboard",
    "/portal/documents": "portal.documents",
    "/portal/financials": "portal.financials",
    "/portal/banking": "portal.banking",
    "/portal/users": "portal.users",
}


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("portal.dashboard"))

    error = None
    if request.method == "POST":
        from app import bcrypt

        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        user = User.query.filter_by(email=email).first()

        if user and user.password and bcrypt.check_password_hash(user.password, password):
            login_user(user, remember=True)
            # Look up the next path in the whitelist; always redirect via url_for()
            # so the destination is never derived from user-provided data.
            raw_next = request.args.get("next", "")
            endpoint = _NEXT_ENDPOINT_MAP.get(raw_next, "portal.dashboard")
            return redirect(url_for(endpoint))
        else:
            error = "Invalid email or password. Please try again."

    return render_template("auth/login.html", error=error)


@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("public.index"))
