def validar_venta(data):
    if not data:
        return "Debe enviar los datos de la venta."

    campos = [
        "cliente",
        "producto",
        "cantidad",
        "precioUnitario",
        "metodoPago"
    ]

    for campo in campos:
        if data.get(campo) in (None, ""):
            return f"El campo {campo} es obligatorio."

    try:
        if int(data["cantidad"]) <= 0:
            return "La cantidad debe ser mayor que cero."

        if float(data["precioUnitario"]) < 0:
            return "El precio no puede ser negativo."

    except (ValueError, TypeError):
        return "Cantidad o precio inválido."

    return None