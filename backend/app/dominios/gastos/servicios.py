from decimal import Decimal

from app.dominios.gastos.modelos import Gasto
from app.dominios.gastos.repositorios import GastoRepositorio


class GastoServicio:

    @staticmethod
    def listar():
        return [
            gasto.to_dict()
            for gasto in GastoRepositorio.listar()
        ]

    @staticmethod
    def obtener(gasto_id):
        gasto = GastoRepositorio.buscar_por_id(gasto_id)

        if not gasto:
            raise ValueError("Gasto no encontrado.")

        return gasto

    @staticmethod
    def crear(data, usuario):
        gasto = Gasto(
            numero=GastoRepositorio.siguiente_numero(),
            categoria=data["categoria"].strip(),
            concepto=data["concepto"].strip(),
            proveedor=data["proveedor"].strip(),
            monto=Decimal(str(data["monto"])),
            metodo_pago=data["metodoPago"].strip(),
            estado=data.get("estado", "Pendiente"),
            comprobante=data.get("comprobante", ""),
            creado_por_id=int(usuario["sub"])
        )

        return GastoRepositorio.guardar(gasto)

    @staticmethod
    def actualizar(gasto_id, data):
        gasto = GastoServicio.obtener(gasto_id)

        if "categoria" in data:
            gasto.categoria = data["categoria"]

        if "concepto" in data:
            gasto.concepto = data["concepto"]

        if "proveedor" in data:
            gasto.proveedor = data["proveedor"]

        if "monto" in data:
            gasto.monto = Decimal(str(data["monto"]))

        if "metodoPago" in data:
            gasto.metodo_pago = data["metodoPago"]

        if "estado" in data:
            gasto.estado = data["estado"]

        if "comprobante" in data:
            gasto.comprobante = data["comprobante"]

        GastoRepositorio.actualizar()

        return gasto

    @staticmethod
    def eliminar(gasto_id):
        gasto = GastoServicio.obtener(gasto_id)
        GastoRepositorio.eliminar(gasto)