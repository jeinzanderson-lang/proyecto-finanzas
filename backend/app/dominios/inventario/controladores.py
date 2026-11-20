from flask import Blueprint, jsonify, request

from app.dominios.inventario.dtos import validar_producto
from app.dominios.inventario.servicios import ProductoServicio
from app.seguridad import rol_requerido


inventario_bp = Blueprint(
    "inventario",
    __name__,
    url_prefix="/api/v1/inventario"
)


@inventario_bp.route("", methods=["GET"])
@rol_requerido("ADMIN", "VENDEDOR")
def listar_productos():
    return jsonify(
        ProductoServicio.listar()
    ), 200


@inventario_bp.route("/<int:producto_id>", methods=["GET"])
@rol_requerido("ADMIN", "VENDEDOR")
def obtener_producto(producto_id):
    try:
        producto = ProductoServicio.obtener(producto_id)
        return jsonify(producto.to_dict()), 200

    except ValueError as error:
        return jsonify({"message": str(error)}), 404


@inventario_bp.route("", methods=["POST"])
@rol_requerido("ADMIN")
def crear_producto():
    data = request.get_json()

    error = validar_producto(data)

    if error:
        return jsonify({"message": error}), 400

    producto = ProductoServicio.crear(data)

    return jsonify(producto.to_dict()), 201


@inventario_bp.route("/<int:producto_id>", methods=["PATCH"])
@rol_requerido("ADMIN")
def actualizar_producto(producto_id):
    try:
        producto = ProductoServicio.actualizar(
            producto_id,
            request.get_json() or {}
        )

        return jsonify(producto.to_dict()), 200

    except ValueError as error:
        return jsonify({"message": str(error)}), 404


@inventario_bp.route("/<int:producto_id>", methods=["DELETE"])
@rol_requerido("ADMIN")
def eliminar_producto(producto_id):
    try:
        ProductoServicio.eliminar(producto_id)
        return "", 204

    except ValueError as error:
        return jsonify({"message": str(error)}), 404