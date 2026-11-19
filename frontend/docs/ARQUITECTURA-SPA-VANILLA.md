Arquitectura SPA vanilla - AG Services

## 1. Propósito del documento
Este documento describe la arquitectura del frontend SPA vanilla del proyecto AG Services (Sistema Contable).
Sirve como guía para entender:
- cómo se organiza el código;
- cómo se separan responsabilidades;
- cómo evoluciona la navegación entre Sprint 1, Sprint 2 y Sprint 3;
- cómo se conectan páginas, componentes, servicios API, sesión, router y guards;
- cómo se mantiene el proyecto escalable y entendible para estudiantes.
La idea es que la arquitectura sea clara, predecible y coherente con los tutoriales y sprints aprobados.

## 2. Principios de arquitectura
La SPA se construye sobre estos principios:
- una sola entrada HTML;
- separación de responsabilidades;
- componentes reutilizables;
- como unidades de vista;
- servicios API separados del renderizado;
- sesión centralizada;
- errores visibles normalizados;
- navegación simple en main.js mientras el proyecto todavía no separa router y guards;
- router y guards como capa explícita desde Sprint 3;
- no duplicar lógica;
- no consumir backend directamente desde cualquier archivo;
- no mezclar HTML inline con lógica dispersa;
- no implementar funcionalidades sin endpoints reales.
Estos principios ayudan a que el frontend sea comprensible, mantenible y pedagógico.

## 3. Stack técnico
La implementación principal usa únicamente:
- HTML5;
- CSS3;
- JavaScript vanilla moderno;
- Vite;
- Bootstrap 5.3;
- Bootstrap Icons;
- Fetch API;
- npm;
- Git;
- Git Bash.
El documento se limita al stack definido para este frontend y evita incorporar herramientas fuera del alcance del MVP.

## 4. Entrada única de la aplicación
La aplicación parte de index.html como única entrada HTML.
Ese archivo contiene:
- la estructura base del documento;
- los metadatos mínimos;
- el contenedor principal #app;
- la carga del módulo inicial src/js/main.js.

Ejemplo conceptual:
<div id="app"></div>
<script type="module" src="/src/js/main.js"></script>

#app es el punto de montaje donde se renderiza toda la interfaz.

src/js/main.js es el punto de arranque que prepara estilos, navegación inicial y montaje de la primera vista.

src/css/main.css concentra estilos base y ajustes globales.

La SPA cambia vistas sin recargar toda la página porque el contenido se reemplaza dentro de #app mediante JavaScript.

Progresión esperada:
- en Sprint 1, main.js muestra una pantalla base temporal;
- en Sprint 2, main.js mantiene una navegación simple para usuarios y autenticación;
- desde Sprint 3, la navegación se separa en src/js/router/routes.js y src/js/router/guards.js.

5. Estructura general esperada
La siguiente estructura corresponde al MVP del frontend y a su progresión pedagógica:

frontend-ag-services/
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── src/
    ├── css/
    │   └── main.css
    └── js/
        ├── main.js
        ├── api/
        │   ├── http.js
        │   ├── auth.api.js
        │   ├── dashboard.api.js
        │   ├── sales.api.js
        │   ├── expenses.api.js
        │   ├── inventory.api.js
        │   ├── reports.api.js
        │   └── settings.api.js
        ├── auth/
        │   ├── session.service.js
        │   └── permissions.js
        ├── router/
        │   ├── routes.js
        │   └── guards.js
        ├── components/
        │   ├── layout/
        │   │   └── Sidebar.js
        │   ├── dashboard/
        │   │   ├── MetricCard.js
        │   │   └── MovementsTable.js
        │   ├── sales/
        │   │   ├── SaleCard.js
        │   │   └── SaleForm.js
        │   ├── expenses/
        │   │   └── ExpenseForm.js
        │   ├── inventory/
        │   │   ├── ProductCard.js
        │   │   └── ProductForm.js
        │   └── settings/
        │       └── AccountForm.js
        ├── pages/
        │   ├── LoginPage.js
        │   ├── DashboardPage.js
        │   ├── SalesPage.js
        │   ├── SaleDetailPage.js
        │   ├── ExpensesPage.js
        │   ├── ExpenseDetailPage.js
        │   ├── InventoryPage.js
        │   ├── ProductDetailPage.js
        │   ├── ReportsPage.js
        │   ├── PeriodDetailPage.js
        │   ── SettingsPage.js
        └── utils/
            ├── storage.js
            ├── formatters.js
            └── errorMessages.js

En Sprint 1 y Sprint 2 todavía no existen router/routes.js ni router/guards.js; esos archivos se incorporan desde Sprint 3 para separar navegación y control de acceso.

Esta estructura corresponde al MVP actual y a su evolución prevista. No incluye carpetas para funcionalidades futuras como facturación electrónica, múltiples bodegas o integración bancaria hasta que el backend tenga endpoints reales.

## 6. Responsabilidad de cada carpeta
Cada carpeta cumple un rol específico:
- api/: comunicación con backend;
- auth/: sesión, token y usuario actual; los helpers de permisos aparecen desde Sprint 3;
- router/: rutas y guards a partir de Sprint 3;
- components/: piezas reutilizables de interfaz;
- pages/: vistas completas;
- utils/: funciones auxiliares, incluyendo storage.js, formatters.js y errorMessages.js;
- css/: estilos globales.
Mantener esta separación evita mezclar lógica de negocio, navegación y presentación en los mismos archivos.