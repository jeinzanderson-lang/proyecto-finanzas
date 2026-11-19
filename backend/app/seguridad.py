from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import current_app, g, jsonify, request


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


def token_requerido(funcion):
    @wraps(funcion)
    def decorador(*args, **kwargs):
        auth_header = request.headers.get(
            "Authorization",
            ""
        )

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "message": "Token requerido."
            }), 401

        token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )

            g.usuario_actual = payload

        except jwt.ExpiredSignatureError:
            return jsonify({
                "message": "El token ha expirado."
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "message": "Token inválido."
            }), 401

        return funcion(*args, **kwargs)

    return decorador


def rol_requerido(*roles_permitidos):
    def decorador(funcion):
        @wraps(funcion)
        @token_requerido
        def wrapper(*args, **kwargs):

            role = g.usuario_actual.get("role")

            if role not in roles_permitidos:
                return jsonify({
                    "message": "No tienes permisos para realizar esta acción."
                }), 403

            return funcion(*args, **kwargs)

        return wrapper

    return decorador