from app import db
from app.dominios.ventas.modelos import Venta


class VentaRepositorio:

    @staticmethod
    def listar():
        return Venta.query.filter_by(
            activo=True
        ).order_by(Venta.id.desc()).all()

    @staticmethod
    def listar_por_usuario(usuario_id):
        return Venta.query.filter_by(
            creado_por_id=usuario_id,
            activo=True
        ).order_by(Venta.id.desc()).all()

    @staticmethod
    def buscar_por_id(venta_id):
        return Venta.query.filter_by(
            id=venta_id,
            activo=True
        ).first()

    @staticmethod
    def siguiente_numero():
        ultimo_id = db.session.query(
            db.func.max(Venta.id)
        ).scalar() or 0

        return f"FAC-{ultimo_id + 1:03d}"

    @staticmethod
    def guardar(venta):
        db.session.add(venta)
        db.session.commit()
        return venta

    @staticmethod
    def actualizar():
        db.session.commit()

    @staticmethod
    def eliminar(venta):
        venta.activo = False
        db.session.commit()