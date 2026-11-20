from datetime import date

from app import db


class Gasto(db.Model):
    __tablename__ = "gastos"

    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(20), unique=True, nullable=False)
    fecha = db.Column(db.Date, nullable=False, default=date.today)
    categoria = db.Column(db.String(80), nullable=False)
    concepto = db.Column(db.String(200), nullable=False)
    proveedor = db.Column(db.String(120), nullable=False)
    monto = db.Column(db.Numeric(12, 2), nullable=False)
    metodo_pago = db.Column(db.String(50), nullable=False)
    estado = db.Column(db.String(20), nullable=False, default="Pendiente")
    comprobante = db.Column(db.String(255), nullable=True)

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
            "categoria": self.categoria,
            "concepto": self.concepto,
            "proveedor": self.proveedor,
            "monto": float(self.monto),
            "metodoPago": self.metodo_pago,
            "estado": self.estado,
            "comprobante": self.comprobante or ""
        }