from flask import Blueprint, jsonify, request

from app.dominios.cuentas.dtos import validar_cuenta
from app.dominios.cuentas.servicios import CuentaServicio
from app.seguridad import rol_requerido


cuentas_bp = Blueprint(
    "cuentas",
    __name__,
    url_prefix="/api/v1/cuentas"
)


@cuentas_bp.route("", methods=["GET"])
@rol_requerido("ADMIN")
def listar_cuentas():
    return jsonify(
        CuentaServicio.listar()
    ), 200


@cuentas_bp.route("", methods=["POST"])
@rol_requerido("ADMIN")
def crear_cuenta():
    data = request.get_json()

    error = validar_cuenta(data)

    if error:
        return jsonify({
            "message": error
        }), 400

    data["tipo"] = data["tipo"].upper()

    cuenta = CuentaServicio.crear(data)

    return jsonify(
        cuenta.to_dict()
    ), 201


@cuentas_bp.route("/<int:cuenta_id>", methods=["PATCH"])
@rol_requerido("ADMIN")
def actualizar_cuenta(cuenta_id):
    try:
        data = request.get_json() or {}

        if "tipo" in data:
            data["tipo"] = data["tipo"].upper()

        cuenta = CuentaServicio.actualizar(
            cuenta_id,
            data
        )

        return jsonify(
            cuenta.to_dict()
        ), 200

    except ValueError as error:
        return jsonify({
            "message": str(error)
        }), 404


@cuentas_bp.route("/<int:cuenta_id>", methods=["DELETE"])
@rol_requerido("ADMIN")
def eliminar_cuenta(cuenta_id):
    try:
        CuentaServicio.eliminar(cuenta_id)

        return "", 204

    except ValueError as error:
        return jsonify({
            "message": str(error)
        }), 404