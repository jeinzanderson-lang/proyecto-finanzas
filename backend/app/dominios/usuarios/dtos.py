ROLES_VALIDOS = ["ADMIN", "VENDEDOR"]


def validar_login(data):
    if not data:
        return "Debe enviar los datos de inicio de sesión."

    if not data.get("username"):
        return "El usuario es obligatorio."

    if not data.get("password"):
        return "La contraseña es obligatoria."

    return None


def validar_registro(data):
    campos = [
        "username",
        "full_name",
        "email",
        "password"
    ]

    for campo in campos:
        if not data.get(campo):
            return f"El campo {campo} es obligatorio."

    role = data.get("role", "VENDEDOR")

    if role not in ROLES_VALIDOS:
        return "Rol inválido."

    return None