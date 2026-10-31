## Roadmap frontend - AG Services

Este roadmap guía la construcción de una SPA vanilla profesional para consumir el backend del sistema contable AG Services. Su propósito es ordenar el aprendizaje, separar lo implementable de lo futuro y mantener el frontend independiente, pero alineado con el contrato real del backend.

## Stack del frontend
El frontend se construirá únicamente con:
- HTML5
- CSS3
- JavaScript vanilla moderno
- Bootstrap 5.3
- Bootstrap Icons
- Vite
- Fetch API
- npm
- Git
- Git Bash
- Router propio
- Componentes vanilla
- Guards de autenticación y rol
- Cliente HTTP centralizado
- Router propio y guards forman parte del MVP final, pero se incorporan desde Sprint 3. En Sprint 1 y Sprint 2 todavía no existen como archivos separados.

## Principio de trabajo
El frontend solo debe implementar funcionalidades respaldadas por endpoints reales del backend.
Las funcionalidades futuras pueden documentarse como roadmap, pero no deben implementarse hasta que el backend las soporte.

## Estado general del proyecto
El backend está organizado en 10 sprints documentados. Para el frontend:
- Los sprints 1 y 2 ya están alineados con los tutoriales aprobados.
- Los sprints 1 al 5 están documentados e implementables con tutorial.
- Los sprints 6 al 10 quedan como futuro.
Esto permite avanzar de forma ordenada sin simular funcionalidades que todavía no existen del lado del servidor.

## sprints
- SPRINT 1
 Nombre: Base SPA con Vite y Bootstrap
 Estado: Documentado / implementable con tutorial
 Tutorial: Sí
 Resultado esperado: Base técnica lista con index.html, #app, package.json, package-lock.json, vite.config.js, .env.example, src/js/main.js, src/css/main.css, Bootstrap 5.3, Bootstrap Icons y validación con npm run dev, npm run build y npm run preview.
- SPRINT 2
 Nombre: Usuarios y autenticación
 Estado: Documentado / implementable con tutorial
 Tutorial: Sí
 Resultado esperado: Login, logout, sesión local, token y usuario en localStorage, src/js/api/http.js, src/js/api/auth.api.js, src/js/auth/session.service.js, src/js/utils/storage.js, src/js/utils/errorMessages.js, sidebar según sesión, perfil protegido de forma básica y navegación simple dentro de src/js/main.js.
- SPRINT 3
 Nombre: Roles, autorización y guards
 Estado: Documentado / implementable con tutorial
 Tutorial: Sí
 Resultado esperado: Guards de ruta, roles (ADMIN, CONTADOR, VENDEDOR, BODEGUERO), lectura de 401 y 403, acceso administrativo protegido, menú dinámico según rol.
- SPRINT 4
 Nombre: Dashboard
 Estado: Documentado / implementable con tutorial
 Tutorial: Sí
 Resultado esperado: Resumen financiero con tarjetas de métricas (Ingresos, Gastos, Saldo, Alertas), tabla de últimos movimientos, gráfico de flujo del período.
- SPRINT 5
 Nombre: Ventas
 Estado: Documentado / implementable con tutorial
 Tutorial: Sí
 Resultado esperado: Listado de facturas, detalle, creación de venta, edición, cambio de estado (Pendiente/Pagada), CRUD protegido según rol.
- SPRINT 6
 Nombre: Gastos
 Estado: Futuro. Depende de endpoints no implementados en backend.
 Tutorial: No
 Resultado esperado: Preparación documental para gestión de egresos y cuentas por pagar cuando exista soporte real.
- SPRINT 7
 Nombre: Inventario
 Estado: Futuro. Depende de endpoints no implementados en backend.
 Tutorial: No
 Resultado esperado: Preparación documental del catálogo de productos, stock, costos y precios cuando el backend lo permita.
- SPRINT 8
 Nombre: Reportes
 Estado: Futuro. Depende de endpoints no implementados en backend.
 Tutorial: No
 Resultado esperado: Preparación documental para filtros de fecha, períodos financieros y detalle de movimientos con datos reales.
- SPRINT 9
 Nombre: Configuración
 Estado: Futuro. Depende de endpoints no implementados en backend.
 Tutorial: No
 Resultado esperado: Preparación documental para catálogo de cuentas contables y preferencias generales cuando existan endpoints.
- SPRINT 10
 Nombre: Integración final
 Estado: Futuro. Depende de módulos anteriores completados.
 Tutorial: No
 Resultado esperado: Preparación documental para optimización, manejo global de errores, estados de carga y build de producción.

## Entregables actuales
El proyecto cuenta con estos entregables documentados:
- documentación base;
- 10 sprints documentados;
- 10 tutoriales implementables;
- contrato backend-frontend;
- validación manual;

Los sprints resumen alcance, criterios y entregables. Los tutoriales guían la implementación paso a paso. Cada tutorial parte del anterior y los documentos deben mantenerse alineados entre sí.


## Reglas para implementación futura
Para mantener la coherencia del proyecto:
- no crear pantallas para funcionalidades sin endpoint;
- no simular gastos, inventario, reportes ni configuración reales como si existieran;
- no adelantar router formal ni guards antes de Sprint 3;
- no simular funcionalidades futuras con localStorage ni datos falsos como si fueran reales;
- usar placeholders solo cuando el documento del sprint lo indique;
- todo consumo de API debe pasar por el cliente HTTP centralizado;
- todo acceso protegido debe pasar por guards una vez que existan.

## Cierre
Este roadmap permite avanzar de forma ordenada, manteniendo el frontend independiente pero alineado con el backend real. También deja claro qué se implementa ahora y qué queda como futuro, evitando promesas técnicas que todavía no tienen soporte del lado del servidor.
