from app import db
from app.dominios.cuentas.modelos import Cuenta


class CuentaRepositorio:

    @staticmethod
    def listar():
        return Cuenta.query.filter_by(
            activo=True
        ).order_by(Cuenta.codigo).all()

    @staticmethod
    def buscar_por_id(cuenta_id):
        return Cuenta.query.filter_by(
            id=cuenta_id,
            activo=True
        ).first()

    @staticmethod
    def guardar(cuenta):
        db.session.add(cuenta)
        db.session.commit()
        return cuenta

    @staticmethod
    def actualizar():
        db.session.commit()

    @staticmethod
    def eliminar(cuenta):
        cuenta.activo = False
        db.session.commit()