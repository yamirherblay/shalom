<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-sm">¿Cómo añadir o editar productos?</div>
    <q-separator class="q-mb-md" />
    <ol class="q-mb-md">
      <li class="q-mb-sm">
        Copie físicamente la imagen del producto dentro de la carpeta:
        <div class="text-weight-medium q-mt-xs">public/images/productos</div>
        <div class="text-caption text-grey-7">Ej.: public/images/productos/mi-foto.jpg</div>
        Para la imagen del producto de Sabrina Fashion dentro de la carpeta:
        <div class="text-weight-medium q-mt-xs">public/images/clothes</div>
        <div class="text-caption text-grey-7">Ej.: public/images/clothes/mi-foto.jpg</div>
      </li>
      <li class="q-mb-sm">
        En la página de Administración, abra "Añadir" o "Editar" y seleccione la imagen que copió. Se previsualizará y se autocompletarán el <strong>ID</strong> (a partir del nombre del archivo) y la <strong>URL de imagen</strong>.
      </li>
      <li class="q-mb-sm">
        Complete <strong>TODOS</strong> los campos del formulario (nombre, precio, categoría, estado, etc.) y presione <strong>Guardar</strong>.
      </li>
      <li class="q-mb-sm">
        Cuando termine de subir todos los cambios (crear/editar varios productos), haga clic en <strong>"Guardar en JSON"</strong> para exportar y sobrescribir el archivo <strong>products.json</strong>.
        <div class="text-caption text-grey-7 q-mt-xs">
          Nota: El guardado en JSON descarga o solicita ubicación de guardado en su equipo. Luego, reemplace manualmente <code>public/data/products.json</code> en su proyecto si lo necesita.
        </div>
      </li>
    </ol>
    <div class="q-mt-md">
      <div class="text-subtitle2 q-mb-xs">Formato esperado de la URL de imagen en productos del mercado</div>
      <code>/images/productos/&lt;nombre-del-archivo&gt;</code>
      <div class="text-subtitle2 q-mb-xs">Formato esperado de la URL de imagen en productos de Sabrina Fashion</div>
      <code>/images/clothes/&lt;nombre-del-archivo&gt;</code>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente informativo simple, sin lógica.
</script>

<style scoped>
ol {
  padding-left: 1.2rem;
}
</style>
