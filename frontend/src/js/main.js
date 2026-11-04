// src/js/main.js
// 1. Importaciones globales (CSS y JS de Bootstrap)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/main.css';

// 2. Importar el Router
import { initRouter } from './router/router.js';

// 3. Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  console.log('AG Services: Sistema inicializado.');
  initRouter();
});
