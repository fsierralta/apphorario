# Plan de Implementación: CRUD de Comisión Empleado

Este plan detalla los pasos requeridos para crear y habilitar el CRUD completo para la asignación de comisiones a empleados (`comision_empledos`), usando Inertia.js, React, Tailwind CSS y Laravel.

## Preguntas Abiertas / Confirmaciones del Usuario

> [!IMPORTANT]
> **Estructura de la Interfaz de Usuario:**
> ¿Prefieres que el CRUD de "Comisión Empleado" se maneje en **páginas separadas** (estilo `Comisiones`: listado, creación y edición en páginas completas) o mediante **ventanas modales** (estilo `Categorías`, donde se crea y edita a través de un diálogo emergente en el listado principal)?
> 
> *Nota: Por defecto, proponemos usar **páginas separadas** ya que facilita la interacción con selectores y validación de campos, pero podemos implementarlo como modals si lo prefieres.*

## Cambios Propuestos

---

### Base de Datos y Modelos

#### [MODIFICAR] [ComisionEmpledo.php](file:///d:/site/apphorario/app/Models/ComisionEmpledo.php)
- Configurar el nombre de la tabla como `comision_empledos`.
- Definir la propiedad `$fillable` con los campos `empleado_id` y `comision_id`.
- Agregar relaciones de Eloquent `empleado()` y `comision()` para poder obtener los datos asociados al listar.

---

### Backend: Controlador y Rutas

#### [MODIFICAR] [ComisionEmpledoController.php](file:///d:/site/apphorario/app/Http/Controllers/ComisionEmpledoController.php)
- **`index`**: Obtener todos los registros de asignación cargando las relaciones `empleado` y `comision` con Eloquent (`with(...)`), y renderizar la vista de Inertia `spad/comision_empledo/index`.
- **`create`**: Obtener todos los empleados y comisiones disponibles de la base de datos para pasarlos como props a la vista `spad/comision_empledo/create`.
- **`store`**: Validar que los campos sean requeridos y existan. Validar la regla de unicidad para evitar que se asigne la misma comisión al mismo empleado dos veces. Redirigir al listado con un mensaje de éxito.
- **`edit`**: Obtener el registro de `ComisionEmpledo` por su ID (o inyección de modelo), cargar todos los empleados y comisiones, y pasar esta información a la vista de edición `spad/comision_empledo/edit`.
- **`update`**: Validar los datos y la unicidad del par (excluyendo el registro actual). Actualizar el registro y redirigir al index.
- **`destroy`**: Eliminar el registro seleccionado y redirigir.

---

### Frontend: Vistas Inertia.js con React y Tailwind

#### [NUEVO] [index.tsx](file:///d:/site/apphorario/resources/js/pages/spad/comision_empledo/index.tsx)
- Vista del listado de asignaciones.
- Se implementará usando el layout `AppLayout` y componentes de tabla estilizados con colores de tono ámbar (`amber`) y sombras consistentes con el diseño de la aplicación.
- Mostrará columnas: ID, Empleado (Nombre completo), Comisión (Nombre), Valor (Monto/Porcentaje), y Acciones (Editar/Eliminar).
- Botón para "Asignar Comisión a Empleado".

#### [NUEVO] [create.tsx](file:///d:/site/apphorario/resources/js/pages/spad/comision_empledo/create.tsx)
- Formulario para asignar comisión a empleado.
- Contendrá selectores (`select`) estilizados para elegir el Empleado y la Comisión.
- Mostrará errores de validación de Inertia debajo de cada selector.
- Botones de "Guardar" y "Cancelar".

#### [NUEVO] [edit.tsx](file:///d:/site/apphorario/resources/js/pages/spad/comision_empledo/edit.tsx)
- Formulario para editar la asignación de comisión a empleado.
- Permite modificar el empleado y/o la comisión asignada.
- Valida los datos y maneja los errores devueltos por Laravel.

---

### Navegación y Sidebar

#### [MODIFICAR] [app-sidebar.tsx](file:///d:/site/apphorario/resources/js/components/app-sidebar.tsx)
- Agregar un nuevo item de navegación en `mainNavItems` para el listado de asignaciones de comisiones:
  ```typescript
  {
      title: 'Comisiones Empleados',
      href: route('spad.indexcomision_empledo'),
      icon: BookOpen
  }
  ```

---

## Plan de Verificación

### Pruebas Automatizadas
- Ejecutar migraciones pendientes:
  ```powershell
  php artisan migrate
  ```

### Verificación Manual
1. Abrir la aplicación y verificar que en la barra lateral (Sidebar) aparezca la opción "Comisiones Empleados".
2. Acceder a "Comisiones Empleados" y comprobar que renderice correctamente la vista de listado vacía (o con datos de prueba).
3. Hacer clic en "Asignar Comisión a Empleado", seleccionar un empleado y una comisión, y enviar el formulario.
4. Validar que la asignación guardada aparezca en la tabla del listado.
5. Intentar crear una asignación duplicada para el mismo empleado y verificar que se muestre el error de validación correspondiente.
6. Editar la asignación para cambiar la comisión o el empleado y verificar que el cambio persista.
7. Eliminar una asignación y validar que desaparezca de la tabla.
