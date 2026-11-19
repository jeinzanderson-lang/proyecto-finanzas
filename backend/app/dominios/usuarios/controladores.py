from flask import Blueprint, jsonify, request

from app.dominios.usuarios.dtos import (
    validar_login,
    validar_registro
)
from app.dominios.usuarios.servicios import UsuarioServicio


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/v1/auth"
)


@auth_bp.route("/register", methods=["POST"])
def registrar():
    data = request.get_json()

    error = validar_registro(data)

    if error:
        return jsonify({
            "message": error
        }), 400

    try:
        usuario = UsuarioServicio.registrar(data)

        return jsonify({
            "message": "Usuario creado correctamente.",
            "user": usuario.to_dict()
        }), 201

    except ValueError as error:
        return jsonify({
            "message": str(error)
        }), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    error = validar_login(data)

    if error:
        return jsonify({
            "message": error
        }), 400

    try:
        resultado = UsuarioServicio.login(
            data["username"],
            data["password"]
        )

        return jsonify(resultado), 200

    except ValueError as error:
        return jsonify({
            "message": str(error)
        }), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({
        "message": "Sesión cerrada correctamente."
    }), 200