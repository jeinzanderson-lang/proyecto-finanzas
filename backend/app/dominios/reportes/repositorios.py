from app.dominios.gastos.modelos import Gasto
from app.dominios.inventario.modelos import Producto
from app.dominios.ventas.modelos import Venta


class ReporteRepositorio:

    @staticmethod
    def ventas():
        return Venta.query.filter_by(
            activo=True
        ).all()

    @staticmethod
    def ventas_usuario(usuario_id):
        return Venta.query.filter_by(
            activo=True,
            creado_por_id=usuario_id
        ).all()

    @staticmethod
    def gastos():
        return Gasto.query.filter_by(
            activo=True
        ).all()

    @staticmethod
    def productos():
        return Producto.query.filter_by(
            activo=True
        ).all()