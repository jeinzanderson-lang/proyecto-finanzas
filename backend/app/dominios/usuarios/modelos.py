from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from app import db


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(
        db.String(80),
        unique=True,
        nullable=False
    )

    full_name = db.Column(
        db.String(120),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False,
        default="VENDEDOR"
    )

    activo = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    ultimo_acceso = db.Column(
        db.DateTime,
        nullable=True
    )

    creado_en = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    def establecer_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verificar_password(self, password):
        return check_password_hash(
            self.password_hash,
            password
        )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "estado": "Activo" if self.activo else "Inactivo",
            "ultimoAcceso": (
                self.ultimo_acceso.strftime("%Y-%m-%d %H:%M")
                if self.ultimo_acceso
                else "Nunca"
            )
        }