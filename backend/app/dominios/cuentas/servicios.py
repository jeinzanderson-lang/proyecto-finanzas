from app.dominios.cuentas.modelos import Cuenta
from app.dominios.cuentas.repositorios import CuentaRepositorio


class CuentaServicio:

    @staticmethod
    def listar():
        return [
            cuenta.to_dict()
            for cuenta in CuentaRepositorio.listar()
        ]

    @staticmethod
    def crear(data):
        cuenta = Cuenta(
            codigo=data["codigo"],
            nombre=data["nombre"],
            tipo=data["tipo"],
            descripcion=data.get("descripcion", "")
        )

        return CuentaRepositorio.guardar(cuenta)

    @staticmethod
    def actualizar(cuenta_id, data):
        cuenta = CuentaRepositorio.buscar_por_id(cuenta_id)

        if not cuenta:
            raise ValueError("Cuenta no encontrada.")

        if "codigo" in data:
            cuenta.codigo = data["codigo"]

        if "nombre" in data:
            cuenta.nombre = data["nombre"]

        if "tipo" in data:
            cuenta.tipo = data["tipo"]

        if "descripcion" in data:
            cuenta.descripcion = data["descripcion"]

        CuentaRepositorio.actualizar()

        return cuenta

    @staticmethod
    def eliminar(cuenta_id):
        cuenta = CuentaRepositorio.buscar_por_id(cuenta_id)

        if not cuenta:
            raise ValueError("Cuenta no encontrada.")

        CuentaRepositorio.eliminar(cuenta)