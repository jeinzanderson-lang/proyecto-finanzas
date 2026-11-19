// src/js/main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/main.css';

import { initRouter } from './router/router.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('AG Services: Sistema inicializado.');
  initRouter();
});