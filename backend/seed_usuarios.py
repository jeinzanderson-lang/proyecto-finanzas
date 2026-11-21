from app import crear_app, db
from app.dominios.usuarios.modelos import Usuario


USUARIOS_DEMO = [
    {
        "username": "admin",
        "full_name": "Administrador AG Services",
        "email": "admin@agservices.com",
        "password": "admin123",
        "role": "ADMIN",
    },
    {
        "username": "vendedor",
        "full_name": "Vendedor Prueba",
        "email": "vendedor@agservices.com",
        "password": "vendedor123",
        "role": "VENDEDOR",
    },
]


def crear_o_actualizar_usuario(data):
    usuario = Usuario.query.filter_by(username=data["username"]).first()

    if usuario is None:
        usuario = Usuario(
            username=data["username"],
            full_name=data["full_name"],
            email=data["email"],
            role=data["role"],
            activo=True,
        )
        db.session.add(usuario)
        accion = "creado"
    else:
        usuario.full_name = data["full_name"]
        usuario.role = data["role"]
        usuario.activo = True
        accion = "actualizado"

    usuario.establecer_password(data["password"])

    return usuario, accion


def main():
    app = crear_app()

    with app.app_context():
        for data in USUARIOS_DEMO:
            usuario, accion = crear_o_actualizar_usuario(data)
            print(
                f"Usuario {accion}: "
                f"{usuario.username} ({usuario.role})"
            )

        db.session.commit()

        print("\nCredenciales de demostración:")
        print("ADMIN     -> admin / admin123")
        print("VENDEDOR  -> vendedor / vendedor123")


if __name__ == "__main__":
    main()
