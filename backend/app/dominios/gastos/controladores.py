from flask import Blueprint, g, jsonify, request

from app.dominios.gastos.dtos import validar_gasto
from app.dominios.gastos.servicios import GastoServicio
from app.seguridad import rol_requerido


gastos_bp = Blueprint(
    "gastos",
    __name__,
    url_prefix="/api/v1/gastos"
)


@gastos_bp.route("", methods=["GET"])
@rol_requerido("ADMIN")
def listar_gastos():
    return jsonify(GastoServicio.listar()), 200


@gastos_bp.route("/<int:gasto_id>", methods=["GET"])
@rol_requerido("ADMIN")
def obtener_gasto(gasto_id):
    try:
        gasto = GastoServicio.obtener(gasto_id)
        return jsonify(gasto.to_dict()), 200

    except ValueError as error:
        return jsonify({"message": str(error)}), 404


@gastos_bp.route("", methods=["POST"])
@rol_requerido("ADMIN")
def crear_gasto():
    data = request.get_json()

    error = validar_gasto(data)

    if error:
        return jsonify({"message": error}), 400

    gasto = GastoServicio.crear(
        data,
        g.usuario_actual
    )

    return jsonify(gasto.to_dict()), 201


@gastos_bp.route("/<int:gasto_id>", methods=["PATCH"])
@rol_requerido("ADMIN")
def actualizar_gasto(gasto_id):
    try:
        gasto = GastoServicio.actualizar(
            gasto_id,
            request.get_json() or {}
        )

        return jsonify(gasto.to_dict()), 200

    except ValueError as error:
        return jsonify({"message": str(error)}), 404


@gastos_bp.route("/<int:gasto_id>", methods=["DELETE"])
@rol_requerido("ADMIN")
def eliminar_gasto(gasto_id):
    try:
        GastoServicio.eliminar(gasto_id)
        return "", 204

    except ValueError as error:
        return jsonify({"message": str(error)}), 404