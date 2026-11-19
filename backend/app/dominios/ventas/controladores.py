from flask import Blueprint, g, jsonify, request

from app.dominios.ventas.dtos import validar_venta
from app.dominios.ventas.servicios import VentaServicio
from app.seguridad import rol_requerido


ventas_bp = Blueprint(
    "ventas",
    __name__,
    url_prefix="/api/v1/ventas"
)


@ventas_bp.route("", methods=["GET"])
@rol_requerido("ADMIN", "VENDEDOR")
def listar_ventas():
    return jsonify(
        VentaServicio.listar(g.usuario_actual)
    ), 200


@ventas_bp.route("/<int:venta_id>", methods=["GET"])
@rol_requerido("ADMIN", "VENDEDOR")
def obtener_venta(venta_id):
    try:
        venta = VentaServicio.obtener(
            venta_id,
            g.usuario_actual
        )

        return jsonify(venta.to_dict()), 200

    except ValueError as error:
        return jsonify({"message": str(error)}), 404

    except PermissionError as error:
        return jsonify({"message": str(error)}), 403


@ventas_bp.route("", methods=["POST"])
@rol_requerido("ADMIN", "VENDEDOR")
def crear_venta():
    data = request.get_json()

    error = validar_venta(data)

    if error:
        return jsonify({"message": error}), 400

    venta = VentaServicio.crear(
        data,
        g.usuario_actual
    )

    return jsonify(venta.to_dict()), 201


@ventas_bp.route("/<int:venta_id>", methods=["PATCH"])
@rol_requerido("ADMIN", "VENDEDOR")
def actualizar_venta(venta_id):
    try:
        venta = VentaServicio.actualizar(
            venta_id,
            request.get_json() or {},
            g.usuario_actual
        )

        return jsonify(venta.to_dict()), 200

    except ValueError as error:
        return jsonify({"message": str(error)}), 404

    except PermissionError as error:
        return jsonify({"message": str(error)}), 403


@ventas_bp.route("/<int:venta_id>", methods=["DELETE"])
@rol_requerido("ADMIN", "VENDEDOR")
def eliminar_venta(venta_id):
    try:
        VentaServicio.eliminar(
            venta_id,
            g.usuario_actual
        )

        return "", 204

    except ValueError as error:
        return jsonify({"message": str(error)}), 404

    except PermissionError as error:
        return jsonify({"message": str(error)}), 403