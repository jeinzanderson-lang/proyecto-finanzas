from app import db
from app.dominios.usuarios.modelos import Usuario


class UsuarioRepositorio:

    @staticmethod
    def buscar_por_username(username):
        return Usuario.query.filter_by(
            username=username
        ).first()

    @staticmethod
    def buscar_por_email(email):
        return Usuario.query.filter_by(
            email=email
        ).first()

    @staticmethod
    def guardar(usuario):
        db.session.add(usuario)
        db.session.commit()
        return usuario