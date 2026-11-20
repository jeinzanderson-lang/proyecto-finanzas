from decimal import Decimal

from app.dominios.ventas.modelos import Venta
from app.dominios.ventas.repositorios import VentaRepositorio


class VentaServicio:

    @staticmethod
    def listar(usuario):
        if usuario["role"] == "ADMIN":
            ventas = VentaRepositorio.listar()
        else:
            ventas = VentaRepositorio.listar_por_usuario(
                int(usuario["sub"])
            )

        return [venta.to_dict() for venta in ventas]

    @staticmethod
    def obtener(venta_id, usuario):
        venta = VentaRepositorio.buscar_por_id(venta_id)

        if not venta:
            raise ValueError("Venta no encontrada.")

        if (
            usuario["role"] != "ADMIN"
            and venta.creado_por_id != int(usuario["sub"])
        ):
            raise PermissionError(
                "No tienes permiso para consultar esta venta."
            )

        return venta

    @staticmethod
    def crear(data, usuario):
        cantidad = int(data["cantidad"])
        precio = Decimal(str(data["precioUnitario"]))
        total = cantidad * precio

        venta = Venta(
            numero=VentaRepositorio.siguiente_numero(),
            cliente=data["cliente"].strip(),
            producto=data["producto"].strip(),
            cantidad=cantidad,
            precio_unitario=precio,
            total=total,
            estado=data.get("estado", "Pendiente"),
            metodo_pago=data["metodoPago"].strip(),
            creado_por_id=int(usuario["sub"])
        )

        return VentaRepositorio.guardar(venta)

    @staticmethod
    def actualizar(venta_id, data, usuario):
        venta = VentaServicio.obtener(venta_id, usuario)

        if "cliente" in data:
            venta.cliente = data["cliente"]

        if "producto" in data:
            venta.producto = data["producto"]

        if "cantidad" in data:
            venta.cantidad = int(data["cantidad"])

        if "precioUnitario" in data:
            venta.precio_unitario = Decimal(
                str(data["precioUnitario"])
            )

        if "estado" in data:
            venta.estado = data["estado"]

        if "metodoPago" in data:
            venta.metodo_pago = data["metodoPago"]

        venta.total = (
            venta.cantidad * venta.precio_unitario
        )

        VentaRepositorio.actualizar()

        return venta

    @staticmethod
    def eliminar(venta_id, usuario):
        venta = VentaServicio.obtener(venta_id, usuario)

        VentaRepositorio.eliminar(venta)