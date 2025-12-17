<template>
  <q-page padding class="q-gutter-md">
    <div class="column items-center q-gutter-xs text-center q-mb-md">
      <q-icon name="checkroom" color="primary" size="64px" />
      <div class="text-h5 text-weight-bold">Sabrina's Fashion</div>
      <div class="text-subtitle2 text-grey-7">Ofertas de ropa, calzado y más</div>
    </div>

    <offers-carousel :items="offers" />

    <div class="row q-gutter-sm q-mt-lg justify-center">
      <q-btn color="primary" icon="store" label="Ir al Mercado" to="/tienda" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import OffersCarousel from 'src/components/OffersCarousel.vue';
import { onMounted, ref } from 'vue';

interface OfferItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  shortDescription?: string;
}

const offers = ref<OfferItem[]>([]);
onMounted(async () => {
  try {
    const res = await fetch('/data/clothes.json');
    offers.value = await res.json();
  } catch (e) {
    console.error('Error cargando ropas.json', e);
  }
});
</script>

<style scoped></style>
