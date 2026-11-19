from datetime import datetime, timedelta, timezone

import jwt
from flask import current_app


def crear_token(usuario):
    ahora = datetime.now(timezone.utc)

    payload = {
        "sub": str(usuario.id),
        "username": usuario.username,
        "role": usuario.role,
        "iat": ahora,
        "exp": ahora + timedelta(
            minutes=current_app.config["JWT_EXP_MINUTES"]
        )
    }

    return jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )