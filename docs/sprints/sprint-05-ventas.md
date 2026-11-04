# Sprint 5 – Ventas

## 1. Nombre del sprint
Ventas.

## 2. Objetivo del sprint
Implementar el módulo de ventas para registrar facturas, consultar historial y gestionar el estado de pago.

## 3. Contexto de negocio
El módulo de ventas permite registrar facturas con datos del cliente, concepto, valor y estado de pago. Es fundamental para el flujo de ingresos del negocio.

## 4. Alcance del sprint
- Crear formulario para registrar nueva venta.
- Implementar lista de ventas con paginación.
- Implementar detalle de venta.
- Implementar edición de venta.
- Implementar cambio de estado (Pendiente/Pagada).
- Consumir endpoints del backend.
- Implementar validaciones de formulario.
- Crear estilos específicos para el módulo.

## 5. Fuera de alcance
Este sprint no implementa:
- generación de PDF de factura;
- integración con sistema de facturación electrónica;
- descuentos e impuestos avanzados;
- múltiples productos por factura.

## 6. Prerrequisitos
- Sprint 4 completado.
- Backend con endpoints de ventas disponibles.
- Tabla de invoices creada en la base de datos.

## 7. Herramientas y tecnologías usadas
- JavaScript vanilla moderno
- Bootstrap 5.3
- Fetch API

## 8. Tareas del sprint
- Crear `src/js/modules/sales/sales.js`.
- Crear `src/js/modules/sales/salesService.js`.
- Implementar formulario de nueva venta.
- Implementar tabla de historial de ventas.
- Implementar modal de detalle de venta.
- Implementar modal de edición.
- Implementar cambio de estado.
- Consumir endpoints del backend.
- Crear estilos específicos para ventas.

## 9. Riesgos o puntos de atención
- No validar que el valor sea mayor a cero.
- Permitir duplicar números de factura.
- No manejar errores de red al guardar.
- Olvidar actualizar la lista después de crear/editar.

## 10. Criterios de aceptación
- Se puede registrar una nueva venta con datos válidos.
- La lista de ventas muestra datos reales del backend.
- Se puede ver el detalle de una venta.
- Se puede editar una venta.
- Se puede cambiar el estado de pendiente a pagada.
- Las validaciones de formulario funcionan correctamente.

## 11. Definition of Done
- Formulario de nueva venta funcional.
- Lista de ventas con paginación funcional.
- Detalle y edición funcionales.
- Cambio de estado funcional.
- Cambios guardados en Git.

## 12. Entregables del sprint
- `src/js/modules/sales/sales.js`.
- `src/js/modules/sales/salesService.js`.
- Módulo de ventas completo en `index.html`.
- Estilos específicos para ventas.