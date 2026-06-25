<template>
  <q-page padding class="catalog-page">
    <div class="catalog-title text-center q-mb-lg">CATÁLOGO</div>

    <CatalogView />
  </q-page>
</template>

<script setup lang="ts">
import { CatalogView } from 'src/components/catalog';
import { useMeta } from 'quasar';

useMeta({
  title: 'Ferretería VIP | Catálogo',
  meta: {
    description: { name: 'description', content: 'Catálogo de productos Ferretería VIP' },
  },
});
</script>

<style scoped>
.catalog-page {
  background: #F5F3EF;
}

.catalog-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.75rem;
  letter-spacing: 3px;
  color: #1A1A2E;
}
</style>
