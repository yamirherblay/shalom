<template>
  <q-page padding class="catalog-page">
    <div class="text-h5 text-center q-mb-lg">{{ branding.name }}</div>

    <CatalogView />
  </q-page>
</template>

<script setup lang="ts">
import { CatalogView } from 'src/components/catalog';
import { branding } from 'src/config/branding';
import { useMeta } from 'quasar';

useMeta({
  title: `${branding.name} | Catálogo`,
  meta: {
    description: { name: 'description', content: `${branding.name} - ${branding.slogan}` },
  },
});
</script>

<style scoped>
.catalog-page {
  background: #fafafa;
}
</style>
