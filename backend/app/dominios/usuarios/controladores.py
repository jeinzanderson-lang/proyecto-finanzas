from flask import Blueprint, g, jsonify, request

from app.dominios.usuarios.dtos import (
    validar_login,
    validar_registro
)
from app.dominios.usuarios.servicios import UsuarioServicio
from app.seguridad import rol_requerido, token_requerido


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/v1/auth"
)


@auth_bp.route("/register", methods=["POST"])
@rol_requerido("ADMIN")
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

@auth_bp.route("/me", methods=["GET"])
@token_requerido
def obtener_usuario_actual():
    return jsonify({
        "user": {
            "id": int(g.usuario_actual["sub"]),
            "username": g.usuario_actual["username"],
            "role": g.usuario_actual["role"]
        }
    }), 200