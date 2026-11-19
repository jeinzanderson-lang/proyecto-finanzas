# Sprint 6 – Gastos

## 1. Nombre del sprint
Gastos.

## 2. Objetivo del sprint
Implementar el módulo de gastos para registrar egresos, cuentas por pagar y gestionar el estado de pago.

## 3. Contexto de negocio
El módulo de gastos permite registrar egresos con datos del proveedor, concepto, vencimiento y estado de pago. Es fundamental para controlar los egresos del negocio.

## 4. Alcance del sprint
- Crear formulario para registrar nuevo gasto.
- Implementar lista de gastos con paginación.
- Implementar detalle de gasto.
- Implementar edición de gasto.
- Implementar cambio de estado (Pendiente/Pagado).
- Consumir endpoints del backend.
- Implementar validaciones de formulario.
- Crear estilos específicos para el módulo.

## 5. Fuera de alcance
Este sprint no implementa:
- categorías de gastos avanzadas;
- aprobación de gastos;
- integración con sistema contable externo;
- recurrentes automáticos.

## 6. Prerrequisitos
- Sprint 5 completado.
- Backend con endpoints de gastos disponibles.
- Tabla de expenses creada en la base de datos.

## 7. Herramientas y tecnologías usadas
- JavaScript vanilla moderno
- Bootstrap 5.3
- Fetch API

## 8. Tareas del sprint
- Crear `src/js/modules/expenses/expenses.js`.
- Crear `src/js/modules/expenses/expensesService.js`.
- Implementar formulario de nuevo gasto.
- Implementar tabla de historial de gastos.
- Implementar modal de detalle de gasto.
- Implementar modal de edición.
- Implementar cambio de estado.
- Consumir endpoints del backend.
- Crear estilos específicos para gastos.

## 9. Riesgos o puntos de atención
- No validar la fecha de vencimiento.
- Permitir valores negativos.
- No manejar errores de red al guardar.
- Olvidar actualizar la lista después de crear/editar.

## 10. Criterios de aceptación
- Se puede registrar un nuevo gasto con datos válidos.
- La lista de gastos muestra datos reales del backend.
- Se puede ver el detalle de un gasto.
- Se puede editar un gasto.
- Se puede cambiar el estado de pendiente a pagado.
- Las validaciones de formulario funcionan correctamente.

## 11. Definition of Done
- Formulario de nuevo gasto funcional.
- Lista de gastos con paginación funcional.
- Detalle y edición funcionales.
- Cambio de estado funcional.
- Cambios guardados en Git.

## 12. Entregables del sprint
- `src/js/modules/expenses/expenses.js`.
- `src/js/modules/expenses/expensesService.js`.
- Módulo de gastos completo en `index.html`.
- Estilos específicos para gastos.