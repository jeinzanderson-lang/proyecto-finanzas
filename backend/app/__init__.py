from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from app.config import Config


# Version de nuestra API
API_VERSION = "v1"


# Base de datos
db = SQLAlchemy()


# Sistema de migraciones
migrate = Migrate()


def crear_app():
    """
    App Factory.

    Esta funcion crea y configura nuestra aplicacion Flask.
    """

    app = Flask(__name__)

    # Cargar configuracion
    app.config.from_object(Config)

    # Inicializar base de datos
    db.init_app(app)

    # Inicializar migraciones
    migrate.init_app(app, db)
    # Importar modelos para las migraciones
    from app.dominios.usuarios.modelos import Usuario  # noqa: F401
    from app.dominios.ventas.modelos import Venta  # noqa: F401
    from app.dominios.gastos.modelos import Gasto  # noqa: F401
    from app.dominios.inventario.modelos import Producto  # noqa: F401
    from app.dominios.cuentas.modelos import Cuenta  # noqa: F401
    # Permitir conexion con el frontend
    CORS(
        app,
        origins=app.config["CORS_ALLOWED_ORIGINS"]
    )

    # ------------------------------------------------------
    # ENDPOINT DE PRUEBA
    # ------------------------------------------------------
    @app.route("/health", methods=["GET"])
    def health():
        return {
            "status": "ok",
            "service": "sistema-contable-api",
            "version": API_VERSION
        }, 200

    # ------------------------------------------------------
    # ERRORES GENERALES
    # ------------------------------------------------------
    @app.errorhandler(404)
    def recurso_no_encontrado(error):
        return {
            "success": False,
            "error": {
                "message": "Recurso no encontrado"
            }
        }, 404

    @app.errorhandler(500)
    def error_interno(error):
        return {
            "success": False,
            "error": {
                "message": "Error interno del servidor"
            }
        }, 500
    from app.dominios.usuarios.controladores import auth_bp
    from app.dominios.ventas.controladores import ventas_bp
    from app.dominios.gastos.controladores import gastos_bp
    from app.dominios.inventario.controladores import inventario_bp
    from app.dominios.cuentas.controladores import cuentas_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(ventas_bp)
    app.register_blueprint(gastos_bp)
    app.register_blueprint(inventario_bp)
    app.register_blueprint(cuentas_bp)
    
    return app