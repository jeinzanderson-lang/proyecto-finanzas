from collections import defaultdict
from datetime import date

from app.dominios.reportes.repositorios import ReporteRepositorio


class ReporteServicio:

    @staticmethod
    def resumen_financiero():
        ventas = ReporteRepositorio.ventas()
        gastos = ReporteRepositorio.gastos()

        total_ventas = sum(
            float(venta.total)
            for venta in ventas
        )

        total_gastos = sum(
            float(gasto.monto)
            for gasto in gastos
        )

        utilidad = total_ventas - total_gastos

        margen = (
            round((utilidad / total_ventas) * 100, 1)
            if total_ventas > 0
            else 0
        )

        return {
            "totalVentas": total_ventas,
            "totalGastos": total_gastos,
            "utilidad": utilidad,
            "margen": margen
        }

    @staticmethod
    def gastos_por_categoria():
        categorias = defaultdict(float)

        for gasto in ReporteRepositorio.gastos():
            categorias[gasto.categoria] += float(gasto.monto)

        return {
            "labels": list(categorias.keys()),
            "data": list(categorias.values())
        }

    @staticmethod
    def ventas_por_metodo_pago():
        metodos = defaultdict(float)

        for venta in ReporteRepositorio.ventas():
            metodos[venta.metodo_pago] += float(venta.total)

        return {
            "labels": list(metodos.keys()),
            "data": list(metodos.values())
        }

    @staticmethod
    def inventario_por_categoria():
        categorias = defaultdict(float)

        for producto in ReporteRepositorio.productos():
            valor = float(producto.precio) * producto.stock
            categorias[producto.categoria] += valor

        return {
            "labels": list(categorias.keys()),
            "data": list(categorias.values())
        }

    @staticmethod
    def top_productos():
        productos = []

        for producto in ReporteRepositorio.productos():
            datos = producto.to_dict()
            datos["valorTotal"] = (
                float(producto.precio) * producto.stock
            )
            productos.append(datos)

        productos.sort(
            key=lambda producto: producto["valorTotal"],
            reverse=True
        )

        return productos[:5]

    @staticmethod
    def ventas_por_cliente():
        clientes = defaultdict(float)

        for venta in ReporteRepositorio.ventas():
            clientes[venta.cliente] += float(venta.total)

        ordenados = sorted(
            clientes.items(),
            key=lambda item: item[1],
            reverse=True
        )[:5]

        return {
            "labels": [item[0] for item in ordenados],
            "data": [item[1] for item in ordenados]
        }

    @staticmethod
    def ventas_por_producto():
        productos = defaultdict(int)

        for venta in ReporteRepositorio.ventas():
            productos[venta.producto] += venta.cantidad

        ordenados = sorted(
            productos.items(),
            key=lambda item: item[1],
            reverse=True
        )[:5]

        return {
            "labels": [item[0] for item in ordenados],
            "data": [item[1] for item in ordenados]
        }

    @staticmethod
    def ventas_por_estado():
        estados = defaultdict(float)

        for venta in ReporteRepositorio.ventas():
            estados[venta.estado] += float(venta.total)

        return {
            "labels": list(estados.keys()),
            "data": list(estados.values())
        }

    @staticmethod
    def dashboard(usuario):
        hoy = date.today()

        if usuario["role"] == "ADMIN":
            ventas = ReporteRepositorio.ventas()
            gastos = ReporteRepositorio.gastos()
        else:
            ventas = ReporteRepositorio.ventas_usuario(
                int(usuario["sub"])
            )
            gastos = []

        ventas_mes = [
            venta
            for venta in ventas
            if venta.fecha.year == hoy.year
            and venta.fecha.month == hoy.month
        ]

        gastos_mes = [
            gasto
            for gasto in gastos
            if gasto.fecha.year == hoy.year
            and gasto.fecha.month == hoy.month
        ]

        total_ventas = sum(
            float(venta.total)
            for venta in ventas_mes
        )

        total_gastos = sum(
            float(gasto.monto)
            for gasto in gastos_mes
        )

        utilidad = total_ventas - total_gastos

        stock_bajo = sum(
            1
            for producto in ReporteRepositorio.productos()
            if producto.stock <= producto.stock_minimo
        )

        movimientos = []

        for venta in ventas:
            movimientos.append({
                "id": venta.numero,
                "tipo": "Venta",
                "cliente": venta.cliente,
                "monto": float(venta.total),
                "fecha": venta.fecha.isoformat(),
                "estado": venta.estado
            })

        for gasto in gastos:
            movimientos.append({
                "id": gasto.numero,
                "tipo": "Gasto",
                "concepto": gasto.concepto,
                "monto": float(gasto.monto),
                "fecha": gasto.fecha.isoformat(),
                "estado": gasto.estado
            })

        movimientos.sort(
            key=lambda movimiento: movimiento["fecha"],
            reverse=True
        )

        return {
            "kpis": {
                "ventasMes": {
                    "valor": total_ventas,
                    "cambio": 0,
                    "tendencia": "up",
                    "label": "Ventas del mes"
                },
                "gastosMes": {
                    "valor": total_gastos,
                    "cambio": 0,
                    "tendencia": "down",
                    "label": "Gastos del mes"
                },
                "utilidad": {
                    "valor": utilidad,
                    "cambio": 0,
                    "tendencia": (
                        "up" if utilidad >= 0 else "down"
                    ),
                    "label": "Utilidad neta"
                },
                "inventarioBajo": {
                    "valor": stock_bajo,
                    "cambio": 0,
                    "tendencia": "up",
                    "label": "Productos con stock bajo"
                }
            },
            "ultimasTransacciones": movimientos[:5]
        }