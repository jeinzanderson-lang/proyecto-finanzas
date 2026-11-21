from datetime import date

from app import db


class Venta(db.Model):
    __tablename__ = "ventas"

    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False, default=date.today)
    cliente = db.Column(db.String(120), nullable=False)
    producto = db.Column(db.String(120), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_unitario = db.Column(db.Numeric(12, 2), nullable=False)
    total = db.Column(db.Numeric(12, 2), nullable=False)
    estado = db.Column(db.String(20), nullable=False, default="Pendiente")
    metodo_pago = db.Column(db.String(50), nullable=False)

    creado_por_id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        nullable=False
    )

    activo = db.Column(db.Boolean, nullable=False, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "numero": self.numero,
            "fecha": self.fecha.isoformat(),
            "cliente": self.cliente,
            "producto": self.producto,
            "cantidad": self.cantidad,
            "precioUnitario": float(self.precio_unitario),
            "total": float(self.total),
            "estado": self.estado,
            "metodoPago": self.metodo_pago
        }