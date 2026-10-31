# Sprint 7 – Inventario

## 1. Nombre del sprint
Inventario.

## 2. Objetivo del sprint
Implementar el módulo de inventario para gestionar productos, stock, costos y precios.

## 3. Contexto de negocio
El módulo de inventario permite registrar productos con SKU, descripción, stock, costo y precio. Es fundamental para controlar el stock y alertar cuando un producto está bajo el mínimo.

## 4. Alcance del sprint
- Crear formulario para registrar nuevo producto.
- Implementar lista de productos con paginación.
- Implementar detalle de producto.
- Implementar edición de producto.
- Implementar alertas de stock bajo.
- Consumir endpoints del backend.
- Implementar validaciones de formulario.
- Crear estilos específicos para el módulo.

## 5. Fuera de alcance
Este sprint no implementa:
- gestión de múltiples bodegas;
- trazabilidad de movimientos;
- integración con sistema de ventas;
- códigos de barras.

## 6. Prerrequisitos
- Sprint 6 completado.
- Backend con endpoints de inventario disponibles.
- Tabla de inventory creada en la base de datos.

## 7. Herramientas y tecnologías usadas
- JavaScript vanilla moderno
- Bootstrap 5.3
- Fetch API

## 8. Tareas del sprint
- Crear `src/js/modules/inventory/inventory.js`.
- Crear `src/js/modules/inventory/inventoryService.js`.
- Implementar formulario de nuevo producto.
- Implementar tabla de catálogo de inventario.
- Implementar modal de detalle de producto.
- Implementar modal de edición.
- Implementar alertas de stock bajo.
- Consumir endpoints del backend.
- Crear estilos específicos para inventario.

## 9. Riesgos o puntos de atención
- No validar que el stock sea mayor o igual a cero.
- Permitir costos o precios negativos.
- No manejar errores de red al guardar.
- Olvidar actualizar la lista después de crear/editar.

## 10. Criterios de aceptación
- Se puede registrar un nuevo producto con datos válidos.
- La lista de productos muestra datos reales del backend.
- Se puede ver el detalle de un producto.
- Se puede editar un producto.
- Las alertas de stock bajo funcionan correctamente.
- Las validaciones de formulario funcionan correctamente.

## 11. Definition of Done
- Formulario de nuevo producto funcional.
- Lista de productos con paginación funcional.
- Detalle y edición funcionales.
- Alertas de stock bajo funcionales.
- Cambios guardados en Git.

## 12. Entregables del sprint
- `src/js/modules/inventory/inventory.js`.
- `src/js/modules/inventory/inventoryService.js`.
- Módulo de inventario completo en `index.html`.
- Estilos específicos para inventario.