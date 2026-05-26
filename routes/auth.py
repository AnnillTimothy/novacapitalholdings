from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User

auth_bp = Blueprint("auth", __name__)


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
            next_page = request.args.get("next")
            return redirect(next_page or url_for("portal.dashboard"))
        else:
            error = "Invalid email or password. Please try again."

    return render_template("auth/login.html", error=error)


@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("public.index"))
