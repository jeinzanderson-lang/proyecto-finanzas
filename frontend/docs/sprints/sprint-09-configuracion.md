# Sprint 9 – Configuración

## 1. Nombre del sprint
Configuración.

## 2. Objetivo del sprint
Implementar el módulo de configuración para gestionar el catálogo de cuentas contables y preferencias generales.

## 3. Contexto de negocio
El módulo de configuración permite administrar el catálogo de cuentas contables (Activos, Pasivos, Patrimonio) y las preferencias generales del sistema. Solo accesible para ADMIN y CONTADOR.

## 4. Alcance del sprint
- Crear formulario para registrar nueva cuenta contable.
- Implementar lista de cuentas con paginación.
- Implementar edición de cuenta.
- Implementar cambio de estado (Activa/Inactiva).
- Consumir endpoints del backend.
- Implementar validaciones de formulario.
- Crear estilos específicos para el módulo.

## 5. Fuera de alcance
Este sprint no implementa:
- configuración de impuestos;
- configuración de usuarios;
- configuración de roles;
- backup de base de datos.

## 6. Prerrequisitos
- Sprint 8 completado.
- Backend con endpoints de configuración disponibles.
- Tabla de accounts creada en la base de datos.

## 7. Herramientas y tecnologías usadas
- JavaScript vanilla moderno
- Bootstrap 5.3
- Fetch API

## 8. Tareas del sprint
- Crear `src/js/modules/settings/settings.js`.
- Crear `src/js/modules/settings/settingsService.js`.
- Implementar formulario de nueva cuenta contable.
- Implementar tabla de catálogo de cuentas.
- Implementar modal de edición.
- Implementar cambio de estado.
- Consumir endpoints del backend.
- Crear estilos específicos para configuración.

## 9. Riesgos o puntos de atención
- No validar el código de cuenta.
- Permitir duplicar códigos.
- No manejar errores de red al guardar.
- Olvidar actualizar la lista después de crear/editar.

## 10. Criterios de aceptación
- Se puede registrar una nueva cuenta contable con datos válidos.
- La lista de cuentas muestra datos reales del backend.
- Se puede editar una cuenta.
- Se puede cambiar el estado de activa a inactiva.
- Las validaciones de formulario funcionan correctamente.

## 11. Definition of Done
- Formulario de nueva cuenta funcional.
- Lista de cuentas con paginación funcional.
- Edición funcional.
- Cambio de estado funcional.
- Cambios guardados en Git.

## 12. Entregables del sprint
- `src/js/modules/settings/settings.js`.
- `src/js/modules/settings/settingsService.js`.
- Módulo de configuración completo en `index.html`.
- Estilos específicos para configuración.