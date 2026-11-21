from flask import Blueprint, g, jsonify

from app.dominios.reportes.repositorios import ReporteRepositorio
from app.dominios.reportes.servicios import ReporteServicio
from app.seguridad import rol_requerido


reportes_bp = Blueprint(
    "reportes",
    __name__,
    url_prefix="/api/v1/reportes"
)


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/v1/dashboard"
)


@dashboard_bp.route("", methods=["GET"])
@rol_requerido("ADMIN", "VENDEDOR")
def dashboard():
    return jsonify(
        ReporteServicio.dashboard(g.usuario_actual)
    ), 200


@reportes_bp.route("/resumen", methods=["GET"])
@rol_requerido("ADMIN")
def resumen_financiero():
    return jsonify(
        ReporteServicio.resumen_financiero()
    ), 200


@reportes_bp.route("/gastos-categoria", methods=["GET"])
@rol_requerido("ADMIN")
def gastos_categoria():
    return jsonify(
        ReporteServicio.gastos_por_categoria()
    ), 200


@reportes_bp.route("/ventas-metodo-pago", methods=["GET"])
@rol_requerido("ADMIN")
def ventas_metodo_pago():
    return jsonify(
        ReporteServicio.ventas_por_metodo_pago()
    ), 200


@reportes_bp.route("/inventario-categoria", methods=["GET"])
@rol_requerido("ADMIN")
def inventario_categoria():
    return jsonify(
        ReporteServicio.inventario_por_categoria()
    ), 200


@reportes_bp.route("/top-productos", methods=["GET"])
@rol_requerido("ADMIN")
def top_productos():
    return jsonify(
        ReporteServicio.top_productos()
    ), 200


@reportes_bp.route("/ventas-cliente", methods=["GET"])
@rol_requerido("ADMIN")
def ventas_cliente():
    return jsonify(
        ReporteServicio.ventas_por_cliente()
    ), 200


@reportes_bp.route("/ventas-producto", methods=["GET"])
@rol_requerido("ADMIN")
def ventas_producto():
    return jsonify(
        ReporteServicio.ventas_por_producto()
    ), 200


@reportes_bp.route("/ventas-estado", methods=["GET"])
@rol_requerido("ADMIN")
def ventas_estado():
    return jsonify(
        ReporteServicio.ventas_por_estado()
    ), 200


@reportes_bp.route("/ventas", methods=["GET"])
@rol_requerido("ADMIN")
def todas_ventas():
    return jsonify([
        venta.to_dict()
        for venta in ReporteRepositorio.ventas()
    ]), 200