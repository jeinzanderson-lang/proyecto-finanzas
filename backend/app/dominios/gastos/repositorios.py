from app import db
from app.dominios.gastos.modelos import Gasto


class GastoRepositorio:

    @staticmethod
    def listar():
        return Gasto.query.filter_by(
            activo=True
        ).order_by(Gasto.id.desc()).all()

    @staticmethod
    def buscar_por_id(gasto_id):
        return Gasto.query.filter_by(
            id=gasto_id,
            activo=True
        ).first()

    @staticmethod
    def siguiente_numero():
        ultimo_id = db.session.query(
            db.func.max(Gasto.id)
        ).scalar() or 0

        return f"GAS-{ultimo_id + 1:03d}"

    @staticmethod
    def guardar(gasto):
        db.session.add(gasto)
        db.session.commit()
        return gasto

    @staticmethod
    def actualizar():
        db.session.commit()

    @staticmethod
    def eliminar(gasto):
        gasto.activo = False
        db.session.commit()