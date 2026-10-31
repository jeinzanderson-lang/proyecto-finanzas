from app import crear_app


# Crear la aplicacion Flask
app = crear_app()


if __name__ == "__main__":
    # Ejecutar servidor en modo desarrollo
    app.run(
        debug=True,
        port=5000
    )