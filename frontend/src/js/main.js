import '../css/main.css';
import '../css/detail-menu.css';

import {
  initRouter
} from './router/router.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    initRouter();
  }
);
