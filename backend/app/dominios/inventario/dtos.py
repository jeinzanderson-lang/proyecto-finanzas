def validar_producto(data):
    if not data:
        return "Debe enviar los datos del producto."

    campos = [
        "nombre",
        "categoria",
        "precio",
        "stock",
        "stockMinimo"
    ]

    for campo in campos:
        if data.get(campo) in (None, ""):
            return f"El campo {campo} es obligatorio."

    try:
        if float(data["precio"]) < 0:
            return "El precio no puede ser negativo."

        if int(data["stock"]) < 0:
            return "El stock no puede ser negativo."

        if int(data["stockMinimo"]) < 0:
            return "El stock mínimo no puede ser negativo."

    except (ValueError, TypeError):
        return "Precio o stock inválido."

    return None