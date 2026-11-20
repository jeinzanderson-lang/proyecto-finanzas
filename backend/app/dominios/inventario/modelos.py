from app import db


class Producto(db.Model):
    __tablename__ = "productos"

    id = db.Column(db.Integer, primary_key=True)

    codigo = db.Column(
        db.String(30),
        unique=True,
        nullable=False
    )

    nombre = db.Column(
        db.String(120),
        nullable=False
    )

    categoria = db.Column(
        db.String(80),
        nullable=False
    )

    precio = db.Column(
        db.Numeric(12, 2),
        nullable=False
    )

    costo = db.Column(
        db.Numeric(12, 2),
        nullable=False,
        default=0
    )

    stock = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    stock_minimo = db.Column(
        db.Integer,
        nullable=False,
        default=5
    )

    proveedor = db.Column(
        db.String(120),
        nullable=True
    )

    descripcion = db.Column(
        db.String(255),
        nullable=True
    )

    activo = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    def calcular_estado(self):
        if self.stock == 0:
            return "Agotado"

        if self.stock <= self.stock_minimo:
            return "Stock Bajo"

        return "Disponible"

    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "nombre": self.nombre,
            "categoria": self.categoria,
            "precio": float(self.precio),
            "costo": float(self.costo),
            "stock": self.stock,
            "stockMinimo": self.stock_minimo,
            "estado": self.calcular_estado(),
            "proveedor": self.proveedor or "",
            "descripcion": self.descripcion or ""
        }