from datetime import datetime

from app import db
from app.dominios.usuarios.modelos import Usuario
from app.dominios.usuarios.repositorios import UsuarioRepositorio
from app.seguridad import crear_token


class UsuarioServicio:

    @staticmethod
    def registrar(data):
        username = data["username"].strip()
        email = data["email"].strip().lower()

        if UsuarioRepositorio.buscar_por_username(username):
            raise ValueError(
                "El nombre de usuario ya existe."
            )

        if UsuarioRepositorio.buscar_por_email(email):
            raise ValueError(
                "El correo electrónico ya está registrado."
            )

        usuario = Usuario(
            username=username,
            full_name=data["full_name"].strip(),
            email=email,
            role=data.get("role", "VENDEDOR"),
            activo=True
        )

        usuario.establecer_password(
            data["password"]
        )

        UsuarioRepositorio.guardar(usuario)

        return usuario

    @staticmethod
    def login(username, password):
        usuario = UsuarioRepositorio.buscar_por_username(
            username
        )

        if not usuario:
            raise ValueError(
                "Usuario o contraseña incorrectos."
            )

        if not usuario.activo:
            raise ValueError(
                "El usuario está inactivo."
            )

        if not usuario.verificar_password(password):
            raise ValueError(
                "Usuario o contraseña incorrectos."
            )

        usuario.ultimo_acceso = datetime.utcnow()
        db.session.commit()

        token = crear_token(usuario)

        return {
            "token": token,
            "user": usuario.to_dict()
        }