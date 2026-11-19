# Sprint 8 – Reportes

## 1. Nombre del sprint
Reportes.

## 2. Objetivo del sprint
Implementar el módulo de reportes para consultar el historial financiero por períodos y filtros de fecha.

## 3. Contexto de negocio
El módulo de reportes permite consultar el historial financiero agrupado por períodos (semanal, mensual, trimestral, semestral, anual) y filtrar por rango de fechas. Es fundamental para el análisis financiero.

## 4. Alcance del sprint
- Implementar filtros de fecha (desde/hasta).
- Implementar selector de período (semanal, mensual, etc.).
- Implementar tabla de historial de períodos.
- Implementar detalle de período con movimientos.
- Consumir endpoints del backend.
- Crear estilos específicos para el módulo.

## 5. Fuera de alcance
Este sprint no implementa:
- exportación a PDF o Excel;
- gráficos avanzados;
- reportes personalizados;
- programación de reportes automáticos.

## 6. Prerrequisitos
- Sprint 7 completado.
- Backend con endpoints de reportes disponibles.
- Datos de ejemplo en la base de datos.

## 7. Herramientas y tecnologías usadas
- JavaScript vanilla moderno
- Bootstrap 5.3
- Fetch API

## 8. Tareas del sprint
- Crear `src/js/modules/reports/reports.js`.
- Crear `src/js/modules/reports/reportsService.js`.
- Implementar filtros de fecha.
- Implementar selector de período.
- Implementar tabla de historial de períodos.
- Implementar modal de detalle de período.
- Consumir endpoints del backend.
- Crear estilos específicos para reportes.

## 9. Riesgos o puntos de atención
- No validar el rango de fechas.
- Mostrar demasiados datos sin paginación.
- No manejar el caso de "sin datos".
- Olvidar actualizar los filtros después de aplicar.

## 10. Criterios de aceptación
- Los filtros de fecha funcionan correctamente.
- El selector de período funciona correctamente.
- La tabla de historial de períodos muestra datos reales.
- Se puede ver el detalle de un período.
- Los filtros se aplican correctamente.

## 11. Definition of Done
- Filtros de fecha funcionales.
- Selector de período funcional.
- Tabla de historial funcional.
- Detalle de período funcional.
- Cambios guardados en Git.

## 12. Entregables del sprint
- `src/js/modules/reports/reports.js`.
- `src/js/modules/reports/reportsService.js`.
- Módulo de reportes completo en `index.html`.
- Estilos específicos para reportes.