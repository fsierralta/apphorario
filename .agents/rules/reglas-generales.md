---
trigger: model_decision
description: entorno general de desarrollo
---

Estándares del Proyecto: Med-SaaS (Laravel + React + Inertia)
1. Arquitectura del Backend (Laravel 13 & PHP)
Patrones de Diseño: Priorizar la Composición sobre la Herencia. Implementar principios SOLID.

Clean Architecture: Separar la lógica de negocio en Services o Actions si el controlador supera las 20 líneas.

Modelos y Eloquent: * Usar Strict Mode en desarrollo.

Definir siempre los fillable o guarded.

Utilizar API Resources para transformar los datos antes de enviarlos a Inertia.

Tipado: Usar tipado estricto de PHP 8.x (declare(strict_types=1);) en archivos de lógica core.

2. Frontend (React & Inertia.js)
Estructura de Carpetas:

resources/js/Pages: Componentes de página completa (mapeados a rutas).

resources/js/Components: Átomos y moléculas reutilizables (Botones, Inputs).

resources/js/Layouts: Envoltorios persistentes (Navegación, Sidebar).

Estado y Formularios: Utilizar el hook useForm de @inertiajs/react para la gestión de envíos y errores de validación.

Props: Documentar las props esperadas en los componentes (usando JSDoc o TypeScript si aplica) para mantener la claridad en el flujo de datos desde el controlador.

3. Estilos y UI (Tailwind CSS)
Utility First: No escribir CSS personalizado a menos que sea estrictamente necesario.

Consistencia: Usar el archivo tailwind.config.js para extender la paleta de colores o fuentes del sistema médico.

Responsive: Diseñar siempre bajo el enfoque Mobile-First.

4. Flujo de Trabajo (Workflow)
Rutas: Todas las rutas deben definirse en web.php. No usar api.php para la lógica interna de la aplicación web.

Validación: Las validaciones deben residir en FormRequests dedicados, no dentro del método del controlador.

Base de Datos: Las migraciones deben ser reversibles (down method funcional). Usar Seeders para datos de prueba iniciales (especialmente para suscripciones de doctores).

5. Reglas del IDE (Antigravity/Cursor)
Contexto: Al pedir refactorización, priorizar soluciones que reduzcan la complejidad ciclomática.

Documentación: Cada nueva función o componente debe incluir un breve comentario sobre su propósito.