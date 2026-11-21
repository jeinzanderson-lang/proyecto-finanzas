TIPOS_VALIDOS = [
    "ACTIVO",
    "PASIVO",
    "PATRIMONIO",
    "INGRESO",
    "GASTO"
]


def validar_cuenta(data):
    if not data:
        return "Debe enviar los datos de la cuenta."

    campos = [
        "codigo",
        "nombre",
        "tipo"
    ]

    for campo in campos:
        if not data.get(campo):
            return f"El campo {campo} es obligatorio."

    if data["tipo"].upper() not in TIPOS_VALIDOS:
        return "Tipo de cuenta inválido."

    return None