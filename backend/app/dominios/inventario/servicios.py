from decimal import Decimal

from app.dominios.inventario.modelos import Producto
from app.dominios.inventario.repositorios import ProductoRepositorio


class ProductoServicio:

    @staticmethod
    def listar():
        return [
            producto.to_dict()
            for producto in ProductoRepositorio.listar()
        ]

    @staticmethod
    def obtener(producto_id):
        producto = ProductoRepositorio.buscar_por_id(producto_id)

        if not producto:
            raise ValueError("Producto no encontrado.")

        return producto

    @staticmethod
    def crear(data):
        producto = Producto(
            codigo=ProductoRepositorio.siguiente_codigo(),
            nombre=data["nombre"].strip(),
            categoria=data["categoria"].strip(),
            precio=Decimal(str(data["precio"])),
            costo=Decimal(str(data.get("costo", 0))),
            stock=int(data["stock"]),
            stock_minimo=int(data["stockMinimo"]),
            proveedor=data.get("proveedor", "").strip(),
            descripcion=data.get("descripcion", "").strip()
        )

        return ProductoRepositorio.guardar(producto)

    @staticmethod
    def actualizar(producto_id, data):
        producto = ProductoServicio.obtener(producto_id)

        if "nombre" in data:
            producto.nombre = data["nombre"]

        if "categoria" in data:
            producto.categoria = data["categoria"]

        if "precio" in data:
            producto.precio = Decimal(str(data["precio"]))

        if "costo" in data:
            producto.costo = Decimal(str(data["costo"]))

        if "stock" in data:
            producto.stock = int(data["stock"])

        if "stockMinimo" in data:
            producto.stock_minimo = int(data["stockMinimo"])

        if "proveedor" in data:
            producto.proveedor = data["proveedor"]

        if "descripcion" in data:
            producto.descripcion = data["descripcion"]

        ProductoRepositorio.actualizar()

        return producto

    @staticmethod
    def eliminar(producto_id):
        producto = ProductoServicio.obtener(producto_id)

        ProductoRepositorio.eliminar(producto)