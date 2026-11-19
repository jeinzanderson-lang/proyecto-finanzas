# Sprint 3 – Roles, Autorización y Guards

## 1. Nombre del sprint
Roles, Autorización y Guards.

## 2. Objetivo del sprint
Implementar el sistema de roles y permisos para controlar qué usuarios pueden acceder a cada módulo del sistema contable.

## 3. Contexto de negocio
El sistema tiene 4 roles: ADMIN, CONTADOR, VENDEDOR y BODEGUERO. Cada rol tiene permisos específicos sobre los módulos. Este sprint implementa la lógica de autorización para proteger las rutas y funcionalidades.

## 4. Alcance del sprint
- Crear estructura de roles y permisos.
- Implementar guards de rutas basados en roles.
- Mostrar/ocultar elementos del menú según el rol.
- Proteger endpoints del frontend con validación de roles.
- Implementar redirección cuando un usuario no tiene permisos.
- Crear utilidades para verificar permisos.
- Actualizar el navbar para mostrar solo las opciones permitidas.

## 5. Fuera de alcance
Este sprint no implementa:
- gestión de roles desde el backend;
- asignación dinámica de permisos;
- auditoría de accesos;
- módulos contables específicos.

## 6. Prerrequisitos
- Sprint 2 completado.
- Backend con roles implementados en el modelo User.
- Token JWT contiene el rol del usuario.

## 7. Herramientas y tecnologías usadas
- JavaScript vanilla moderno
- JWT claims
- Bootstrap 5.3

## 8. Tareas del sprint
- Crear `src/js/utils/roleManager.js`.
- Crear `src/js/utils/routeGuard.js`.
- Definir matriz de permisos por rol.
- Implementar función `hasRole(roles)`.
- Implementar función `canAccess(module)`.
- Actualizar navbar para filtrar menú según rol.
- Implementar guard en `main.js` para proteger rutas.
- Crear página de "Acceso denegado".
- Probar con diferentes roles.

## 9. Riesgos o puntos de atención
- Hardcodear roles en el frontend en lugar de leerlos del token.
- No validar el rol en cada petición al backend.
- Olvidar actualizar el navbar cuando cambia el rol.
- Permitir acceso por URL directa sin validación.

## 10. Criterios de aceptación
- El menú muestra solo las opciones permitidas para el rol actual.
- Las rutas protegidas redirigen al login si no hay token.
- Las rutas protegidas muestran "Acceso denegado" si el rol no tiene permisos.
- El token contiene el rol del usuario.
- Las peticiones incluyen validación de rol en el backend.

## 11. Definition of Done
- Guards funcionales para todas las rutas.
- Navbar dinámico según rol.
- Página de acceso denegado funcional.
- Cambios guardados en Git.

## 12. Entregables del sprint
- `src/js/utils/roleManager.js`.
- `src/js/utils/routeGuard.js`.
- Navbar actualizado con filtrado por rol.
- Página de acceso denegado.