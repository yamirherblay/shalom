<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-sm">¿Cómo añadir o editar productos?</div>
    <q-separator class="q-mb-md" />
    <ol class="q-mb-md">
      <li class="q-mb-sm">
        Seleccione la imagen del producto haciendo clic en <strong>"Seleccionar imagen"</strong>.
        <div class="text-negative q-mt-xs">
          <q-icon name="warning" size="18px" class="q-mr-xs" />
          La imagen NO debe exceder <strong>400KB</strong>
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Si la imagen es muy grande, comprímela antes de subirla.
        </div>
      </li>
      <li class="q-mb-sm">
        Se mostrará una <strong>previsualización</strong> de la imagen y se autocompletarán:
        <ul class="q-mt-xs q-ml-md">
          <li><strong>ID</strong>: se genera automáticamente (UUID)</li>
          <li>
            <strong>URL de imagen</strong>: se completa al subir a internet (Supabase Storage)
          </li>
        </ul>
      </li>
      <li class="q-mb-sm">
        Complete <strong>TODOS</strong> los campos del formulario:
        <ul class="q-mt-xs q-ml-md">
          <li><strong>Nombre</strong> del producto</li>
          <li><strong>Precio</strong></li>
          <li><strong>Categoría</strong></li>
          <li><strong>Subcategoría</strong> (opcional)</li>
          <li><strong>Estado</strong>: Disponible o Agotado</li>
          <li><strong>Descripción</strong> (opcional)</li>
          <li><strong>Nuevo</strong> / <strong>En oferta</strong> (opcional)</li>
        </ul>
      </li>
      <li class="q-mb-sm">
        Presione <strong>"Crear"</strong> (para nuevo producto) o <strong>"Guardar"</strong> (para
        editar).
        <div class="text-caption text-grey-7 q-mt-xs">
          El producto se guarda directamente en la base de datos (Supabase).
        </div>
      </li>
    </ol>
    <q-banner class="bg-grey-3 q-mt-md" rounded>
      <template #avatar>
        <q-icon name="cloud_upload" color="primary" />
      </template>
      <div class="text-subtitle2 text-bold text-negative">Almacenamiento en la nube</div>
      <div class="text-caption text-black">
        Las imágenes se almacenan automáticamente en Supabase Storage (internet). No es necesario
        copiar archivos manualmente a carpetas del proyecto.
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
// Componente informativo simple, sin lógica.
</script>

<style scoped>
ol {
  padding-left: 1.2rem;
}
ul {
  padding-left: 1rem;
}
</style>
