# Sistema Contable AG Services

Proyecto final de **Arquitectura de Software** desarrollado como una aplicación Full Stack para la gestión contable de AG Services.

El sistema permite administrar ventas, gastos, inventario, catálogo de cuentas, reportes y un dashboard financiero, incorporando autenticación con JWT, control de acceso por roles y persistencia en MySQL.

---

## 1. Descripción general

El proyecto está compuesto por tres capas principales:

```text
Frontend
HTML5 + Tailwind CSS + JavaScript Vanilla + Vite
        ↓
API REST
Flask + JWT + arquitectura modular por dominios
        ↓
Base de datos
MySQL + SQLAlchemy + Flask-Migrate
```

El frontend consume la API REST del backend mediante solicitudes HTTP y toda la información operativa se almacena en MySQL.

---

## 2. Funcionalidades principales

El sistema incluye:

- Inicio de sesión con autenticación JWT.
- Control de acceso por roles.
- Rol `ADMIN`.
- Rol `VENDEDOR`.
- Dashboard financiero.
- Gestión de ventas.
- Gestión de gastos.
- Gestión de inventario.
- Catálogo de cuentas.
- Reportes financieros.
- Validaciones de formularios.
- Manejo de errores HTTP.
- Persistencia de información en MySQL.
- Migraciones de base de datos.
- API REST organizada por dominios funcionales.

---

## 3. Roles del sistema

### ADMIN

El administrador tiene acceso a todas las funciones del sistema:

- Dashboard.
- Ventas.
- Gastos.
- Inventario.
- Reportes.
- Catálogo de cuentas.
- Creación y modificación de registros.

Credenciales de demostración:

```text
Usuario: admin
Contraseña: admin123
```

### VENDEDOR

El vendedor tiene acceso restringido a las funciones operativas habilitadas para su rol.

Credenciales de demostración:

```text
Usuario: vendedor
Contraseña: vendedor123
```

Los permisos son validados tanto en el frontend como en el backend.

---

## 4. Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- Tailwind CSS mediante CDN
- JavaScript Vanilla
- Font Awesome
- Vite

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- Flask-Migrate
- PyJWT
- PyMySQL
- Marshmallow
- python-dotenv
- Pytest

### Base de datos

- MySQL
- SQLAlchemy ORM
- Flask-Migrate

### Herramientas de desarrollo

- Visual Studio Code
- MySQL Workbench
- Git
- GitHub
- Jira
- Mermaid

---

## 5. Arquitectura

El backend utiliza un **monolito modular organizado por dominios funcionales**.

Los principales dominios son:

```text
usuarios
ventas
gastos
inventario
cuentas
reportes
```

Cada dominio sigue una separación por capas:

```text
Controlador
    ↓
Servicio
    ↓
Repositorio
    ↓
Modelo
    ↓
Base de datos
```

También se utilizan DTOs para validaciones y transformación de datos.

---

## 6. Estructura general del proyecto

```text
proyecto-finanzas/
│
├── backend/
│   ├── app/
│   │   ├── dominios/
│   │   │   ├── usuarios/
│   │   │   ├── ventas/
│   │   │   ├── gastos/
│   │   │   ├── inventario/
│   │   │   ├── cuentas/
│   │   │   └── reportes/
│   │   │
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── seguridad.py
│   │
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   ├── seed_usuarios.py
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── documentacion/
│   ├── adr/
│   ├── api/
│   ├── diagramas/
│   └── evidencias/
│       ├── frontend/
│       ├── backend/
│       ├── base-datos/
│       └── jira/
│
└── README.md
```

---

## 7. Requisitos previos

Antes de ejecutar el proyecto se debe tener instalado:

- Python.
- MySQL Server.
- MySQL Workbench.
- Node.js.
- npm.
- Git.

---

## 8. Clonar el repositorio

```bash
git clone https://github.com/jeinzanderson-lang/proyecto-finanzas.git
```

Ingresar a la carpeta:

```bash
cd proyecto-finanzas
```

## 9. Configuración de la base de datos

Abrir MySQL Workbench y crear la base de datos:

```sql
CREATE DATABASE sistema_contable_db;
```

Después se debe configurar el archivo `.env` del backend.

---

## 10. Configuración del backend

Ingresar a la carpeta:

```bash
cd backend
```

### Crear entorno virtual

En Windows:

```bash
python -m venv venv
```

### Activar entorno virtual en Git Bash

```bash
source venv/Scripts/activate
```

Cuando esté activo debe aparecer `(venv)` al inicio de la terminal.

### Instalar dependencias

```bash
pip install -r requirements.txt
```

---

## 11. Variables de entorno

Dentro de la carpeta `backend` crear un archivo llamado:

```text
.env
```

Ejemplo de configuración:

```env
DB_USER=root
DB_PASSWORD=TU_CONTRASENA_MYSQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sistema_contable_db

SECRET_KEY=clave-secreta-desarrollo
JWT_EXP_MINUTES=60

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Reemplazar:

```text
TU_CONTRASENA_MYSQL
```

por la contraseña configurada en MySQL.

No se debe subir el archivo `.env` con credenciales reales al repositorio.

---

## 12. Aplicar migraciones

Con el entorno virtual activo y ubicado dentro de `backend`:

```bash
flask --app "app:crear_app()" db upgrade
```

Esto crea o actualiza las tablas necesarias en MySQL utilizando las migraciones del proyecto.

---

## 13. Crear usuarios de demostración

Con el entorno virtual activo ejecutar:

```bash
python seed_usuarios.py
```

El script crea o actualiza los siguientes usuarios:

```text
ADMIN
Usuario: admin
Contraseña: admin123
```

```text
VENDEDOR
Usuario: vendedor
Contraseña: vendedor123
```

Las contraseñas son almacenadas de forma segura utilizando hash y no se guardan como texto plano en MySQL.

---

## 14. Ejecutar el backend

Desde la carpeta `backend` y con el entorno virtual activo:

```bash
flask --app "app:crear_app()" run
```

El backend se ejecuta normalmente en:

```text
http://127.0.0.1:5000
```

Para verificar que está funcionando:

```text
http://127.0.0.1:5000/health
```

La respuesta esperada es similar a:

```json
{
  "service": "sistema-contable-api",
  "status": "ok",
  "version": "v1"
}
```

La terminal del backend debe permanecer abierta mientras se utiliza el sistema.

---

## 15. Configuración del frontend

Abrir una segunda terminal.

Desde la raíz del proyecto:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar Vite:

```bash
npm run dev
```

El frontend normalmente estará disponible en:

```text
http://localhost:5173/
```

La terminal de Vite debe permanecer abierta mientras se utiliza el sistema.

---

## 16. Orden recomendado para ejecutar el sistema

Para trabajar localmente se deben mantener activos los siguientes componentes:

```text
1. MySQL Server
2. Backend Flask
3. Frontend Vite
```

El flujo completo es:

```text
Navegador
    ↓
http://localhost:5173
    ↓
Frontend
    ↓
http://127.0.0.1:5000/api/v1
    ↓
Flask
    ↓
SQLAlchemy
    ↓
MySQL
```

---

## 17. API REST

La API utiliza el prefijo:

```text
/api/v1
```

### Autenticación

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
POST /api/v1/auth/register
```

### Ventas

```text
GET    /api/v1/ventas
POST   /api/v1/ventas
GET    /api/v1/ventas/<id>
PATCH  /api/v1/ventas/<id>
DELETE /api/v1/ventas/<id>
```

### Gastos

```text
GET    /api/v1/gastos
POST   /api/v1/gastos
GET    /api/v1/gastos/<id>
PATCH  /api/v1/gastos/<id>
DELETE /api/v1/gastos/<id>
```

### Inventario

```text
GET    /api/v1/inventario
POST   /api/v1/inventario
GET    /api/v1/inventario/<id>
PATCH  /api/v1/inventario/<id>
DELETE /api/v1/inventario/<id>
```

### Cuentas

```text
GET    /api/v1/cuentas
POST   /api/v1/cuentas
PATCH  /api/v1/cuentas/<id>
DELETE /api/v1/cuentas/<id>
```

### Dashboard

```text
GET /api/v1/dashboard
```

### Reportes

El backend incluye endpoints de reportes para:

- Resumen financiero.
- Ventas.
- Ventas por cliente.
- Ventas por producto.
- Ventas por estado.
- Ventas por método de pago.
- Top de productos.
- Gastos por categoría.
- Inventario por categoría.

---

## 18. Seguridad

El sistema implementa:

- Autenticación mediante JWT.
- Contraseñas almacenadas mediante hash.
- Validación de usuarios activos.
- Roles `ADMIN` y `VENDEDOR`.
- Autorización mediante decoradores.
- Protección de endpoints.
- Validaciones de datos mediante DTOs.
- Configuración CORS para comunicación entre frontend y backend.
- Variables sensibles mediante `.env`.

---

## 19. Persistencia

Los datos mostrados en la aplicación no son datos simulados.

Los módulos principales consumen información almacenada en MySQL mediante la API REST.

La comunicación implementada es:

```text
Frontend
    ↓
fetch / API REST
    ↓
Flask
    ↓
Servicios
    ↓
Repositorios
    ↓
SQLAlchemy
    ↓
MySQL
```

---

## 20. Diagramas de arquitectura

La carpeta:

```text
documentacion/diagramas/
```

contiene los diagramas desarrollados para documentar la arquitectura:

```text
01-c4-contexto
02-c4-contenedores
03-c4-componentes
04-uml-casos-uso
05-uml-clases
06-uml-secuencia-crear-venta
07-arquitectura-logica
08-despliegue
09-modelo-logico-bd
10-modelo-fisico-bd
11-api-rest
12-seguridad
```

Los diagramas están disponibles en formato fuente Mermaid (`.mmd`) y en formato visual (`.svg`).

---

## 21. Evidencias

Las evidencias de funcionamiento están almacenadas en:

```text
documentacion/evidencias/
```

Se incluyen evidencias de:

- Frontend.
- Backend Flask.
- Peticiones HTTP.
- DevTools / Network.
- Base de datos MySQL.
- Jira.
- Roles ADMIN y VENDEDOR.
- CRUD de los módulos principales.

---

## 22. Pruebas de integración

Para verificar la integración completa se recomienda:

1. Iniciar MySQL.
2. Iniciar Flask.
3. Iniciar Vite.
4. Iniciar sesión como `ADMIN`.
5. Crear una venta.
6. Crear un gasto.
7. Crear un producto.
8. Consultar el Dashboard.
9. Consultar Reportes.
10. Verificar los registros en MySQL Workbench.
11. Abrir DevTools → Network.
12. Confirmar respuestas HTTP `200` y `201`.
13. Cerrar sesión.
14. Iniciar sesión como `VENDEDOR`.
15. Verificar las restricciones correspondientes al rol.

---

## 23. Estado HTTP utilizados

La API utiliza códigos HTTP de acuerdo con la operación realizada, entre ellos:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## 24. Control de versiones

El proyecto utiliza Git y GitHub.

Ramas principales utilizadas:

```text
main
backend-diego
backend-integracion
```

La rama `backend-integracion` contiene la integración del frontend, backend, base de datos y documentación previa a la incorporación final en `main`.

---

## 25. Proyecto académico

Este proyecto fue desarrollado con fines académicos como proyecto final de la asignatura **Arquitectura de Software**.

El objetivo principal es demostrar la implementación e integración de:

- Arquitectura de software.
- Desarrollo Full Stack.
- API REST.
- Persistencia con ORM.
- Seguridad.
- Autenticación y autorización.
- Modularidad.
- Patrones de separación por capas.
- Documentación arquitectónica.
- Control de versiones.
- Integración frontend-backend-base de datos.

---

## 26. Credenciales de demostración

### Administrador

```text
Usuario: admin
Contraseña: admin123
```

### Vendedor

```text
Usuario: vendedor
Contraseña: vendedor123
```

Estas credenciales son exclusivamente para demostración académica y no deben utilizarse en un entorno de producción.

---

## 27. Repositorio

Repositorio principal:

```text
https://github.com/jeinzanderson-lang/proyecto-finanzas
```

---

## 28. Nota de ejecución

El sistema está configurado actualmente para ejecución local.

Para utilizarlo se deben mantener activos:

```text
MySQL
Flask
Vite
```

En un despliegue productivo, estos componentes serían ejecutados en servidores o servicios de infraestructura permanentes.
