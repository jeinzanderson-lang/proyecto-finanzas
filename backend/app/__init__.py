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

    return app