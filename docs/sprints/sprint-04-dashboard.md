# Sprint 4 – Dashboard

## 1. Nombre del sprint
Dashboard.

## 2. Objetivo del sprint
Implementar el dashboard principal que muestra el resumen financiero del negocio con métricas clave, alertas y últimos movimientos.

## 3. Contexto de negocio
El dashboard es la primera pantalla que ve el usuario después del login. Debe mostrar una vista general del estado financiero: ingresos, gastos, saldo, alertas de inventario bajo y últimos movimientos.

## 4. Alcance del sprint
- Crear estructura del dashboard con cards de métricas.
- Implementar gráfico de flujo del período (ingresos vs gastos).
- Mostrar alertas de inventario bajo y cuentas por pagar vencidas.
- Listar últimos movimientos (ingresos y egresos).
- Consumir endpoints del backend para obtener datos reales.
- Implementar filtros de fecha para el dashboard.
- Crear estilos responsivos para el dashboard.

## 5. Fuera de alcance
Este sprint no implementa:
- módulos de ventas, gastos, inventario;
- reportes detallados;
- exportación de datos;
- gráficos avanzados con librerías externas.

## 6. Prerrequisitos
- Sprint 3 completado.
- Backend con endpoints de dashboard disponibles.
- Datos de ejemplo en la base de datos.

## 7. Herramientas y tecnologías usadas
- JavaScript vanilla moderno
- Bootstrap 5.3
- Fetch API
- Chart.js (opcional para gráficos)

## 8. Tareas del sprint
- Crear `src/js/modules/dashboard/dashboard.js`.
- Crear `src/js/modules/dashboard/dashboardService.js`.
- Implementar cards de métricas (ingresos, gastos, saldo, alertas).
- Implementar gráfico de flujo del período.
- Implementar tabla de últimos movimientos.
- Implementar sección de alertas.
- Consumir endpoints del backend.
- Crear estilos específicos para el dashboard.
- Implementar filtros de fecha.

## 9. Riesgos o puntos de atención
- Mostrar datos de ejemplo en lugar de datos reales.
- No manejar el caso de "sin datos".
- Olvidar actualizar el dashboard cuando cambian los datos.
- No validar permisos antes de mostrar métricas sensibles.

## 10. Criterios de aceptación
- El dashboard muestra métricas reales del backend.
- Los cards muestran ingresos, gastos, saldo y alertas.
- El gráfico de flujo del período se renderiza correctamente.
- La tabla de últimos movimientos muestra datos reales.
- Las alertas muestran inventario bajo y cuentas vencidas.
- El dashboard es responsivo.

## 11. Definition of Done
- Dashboard funcional con datos reales.
- Gráfico de flujo del período funcional.
- Alertas funcionales.
- Cambios guardados en Git.

## 12. Entregables del sprint
- `src/js/modules/dashboard/dashboard.js`.
- `src/js/modules/dashboard/dashboardService.js`.
- Dashboard completo en `index.html`.
- Estilos específicos para dashboard.