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
  title: 'Catálogo | Shalom',
  meta: {
    description: { name: 'description', content: 'Catálogo de productos Shalom — alimentos, bebidas, aseo, limpieza, hogar y más.' },
    'og:title': { property: 'og:title', content: 'Catálogo | Shalom' },
    'og:description': { property: 'og:description', content: 'Catálogo de productos Shalom' },
    'og:url': { property: 'og:url', content: '/catalogo' },
    'twitter:title': { name: 'twitter:title', content: 'Catálogo | Shalom' },
    'twitter:description': { name: 'twitter:description', content: 'Catálogo de productos Shalom' },
  },
});
</script>

<style scoped>
.catalog-page {
  background: #F5F0E8;
}

.catalog-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.75rem;
  letter-spacing: 3px;
  color: #2C2C2C;
}
</style>
