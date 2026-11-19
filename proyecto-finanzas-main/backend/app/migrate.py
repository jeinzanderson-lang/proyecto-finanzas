"""
Configuracion de Flask-Migrate.

La instancia migrate se crea en app/__init__.py
y este archivo permite reutilizarla si es necesario.
"""

from app import migrate  # noqa: F401