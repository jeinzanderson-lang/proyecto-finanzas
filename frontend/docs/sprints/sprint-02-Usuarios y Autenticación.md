
# Sprint 2 – Usuarios y Autenticación

## 1. Nombre del sprint
Usuarios y Autenticación.

## 2. Objetivo del sprint
Implementar el módulo de autenticación con login, registro de usuarios y gestión de sesión JWT, permitiendo que los usuarios puedan iniciar sesión y acceder al sistema.

## 3. Contexto de negocio
El sistema contable requiere que cada usuario tenga credenciales únicas y que las sesiones se manejen de forma segura mediante tokens JWT. Este sprint establece la base de seguridad para todos los módulos posteriores.

## 4. Alcance del sprint
- Crear estructura de carpetas para módulos: `src/js/modules/auth/`.
- Implementar formulario de login con validación.
- Implementar formulario de registro de usuarios.
- Consumir endpoints de autenticación del backend.
- Almacenar token JWT en localStorage.
- Implementar cierre de sesión.
- Crear utilidades para manejo de tokens.
- Implementar validación de formularios con Bootstrap.
- Mostrar mensajes de error y éxito.
- Redirigir al dashboard después del login exitoso.

## 5. Fuera de alcance
Este sprint no implementa:
- roles y permisos;
- guards de rutas;
- recuperación de contraseña;
- autenticación de dos factores;
- módulos contables;
- dashboard con datos reales.

## 6. Prerrequisitos
- Sprint 1 completado.
- Backend con endpoints de autenticación disponibles.
- Conocimientos de JavaScript async/await.

## 7. Herramientas y tecnologías usadas
- JavaScript vanilla moderno
- Bootstrap 5.3
- Fetch API
- JWT
- localStorage

## 8. Tareas del sprint
- Crear `src/js/modules/auth/login.js`.
- Crear `src/js/modules/auth/register.js`.
- Crear `src/js/modules/auth/authService.js`.
- Crear `src/js/utils/tokenManager.js`.
- Crear `src/js/utils/apiClient.js` para centralizar llamadas HTTP.
- Implementar formulario de login en `index.html`.
- Implementar formulario de registro.
- Validar credenciales contra el backend.
- Almacenar token y datos de usuario.
- Implementar logout.
- Crear estilos específicos para formularios de autenticación.

## 9. Riesgos o puntos de atención
- Almacenar información sensible en localStorage sin encriptar.
- No validar el token antes de hacer peticiones.
- Olvidar manejar errores de red.
- No limpiar el formulario después de enviar.
- Exponer credenciales en la consola del navegador.

## 10. Criterios de aceptación
- El usuario puede iniciar sesión con credenciales válidas.
- El token JWT se almacena correctamente.
- El usuario puede registrarse con datos válidos.
- Los formularios muestran validaciones en tiempo real.
- Los mensajes de error se muestran correctamente.
- El logout limpia el token y redirige al login.
- Las peticiones incluyen el token en el header Authorization.

## 11. Definition of Done
- Login funcional con backend real.
- Registro funcional con validaciones.
- Token almacenado y enviado en peticiones.
- Logout funcional.
- Cambios guardados en Git.

## 12. Entregables del sprint
- `src/js/modules/auth/login.js`.
- `src/js/modules/auth/register.js`.
- `src/js/modules/auth/authService.js`.
- `src/js/utils/tokenManager.js`.
- `src/js/utils/apiClient.js`.
- Formularios de login y registro en `index.html`.