def validar_gasto(data):
    if not data:
        return "Debe enviar los datos del gasto."

    campos = [
        "categoria",
        "concepto",
        "proveedor",
        "monto",
        "metodoPago"
    ]

    for campo in campos:
        if data.get(campo) in (None, ""):
            return f"El campo {campo} es obligatorio."

    try:
        if float(data["monto"]) < 0:
            return "El monto no puede ser negativo."
    except (ValueError, TypeError):
        return "Monto inválido."

    return None