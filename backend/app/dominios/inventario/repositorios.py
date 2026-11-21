from app import db
from app.dominios.inventario.modelos import Producto


class ProductoRepositorio:

    @staticmethod
    def listar():
        return Producto.query.filter_by(
            activo=True
        ).order_by(Producto.id.desc()).all()

    @staticmethod
    def buscar_por_id(producto_id):
        return Producto.query.filter_by(
            id=producto_id,
            activo=True
        ).first()

    @staticmethod
    def siguiente_codigo():
        ultimo_id = db.session.query(
            db.func.max(Producto.id)
        ).scalar() or 0

        return f"PROD-{ultimo_id + 1:03d}"

    @staticmethod
    def guardar(producto):
        db.session.add(producto)
        db.session.commit()
        return producto

    @staticmethod
    def actualizar():
        db.session.commit()

    @staticmethod
    def eliminar(producto):
        producto.activo = False
        db.session.commit()