<template>
  <q-page padding class="q-gutter-md">
    <div class="column items-center q-gutter-xs text-center q-mb-md">
      <q-icon name="checkroom" color="primary" size="64px" />
      <div class="text-h5 text-weight-bold">Sabrina's Fashion</div>
      <div class="text-subtitle2 text-grey-7">Ofertas de ropa, calzado y más</div>
    </div>

    <offers-carousel :items="offers" />

    <div class="row q-gutter-sm q-mt-lg justify-center">
      <q-btn color="primary" icon="store" label="Ir a la tienda" to="/tienda"/>
      <q-btn flat color="primary" icon="home" label="Inicio" to="/"/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import OffersCarousel from 'src/components/OffersCarousel.vue';

interface OfferItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  shortDescription?: string;
}

const offers: OfferItem[] = [
  {
    id: 'vestido-verano-01',
    name: 'Vestido de verano',
    price: 1250,
    image: '/images/ropa/vestido-verano.webp',
    shortDescription: 'Fresco y ligero, perfecto para días soleados.'
  },
  {
    id: 'zapatillas-urbanas-01',
    name: 'Zapatillas urbanas',
    price: 2200,
    image: '/images/ropa/zapatillas-urbanas.webp',
    shortDescription: 'Comodidad para el día a día.'
  },
  {
    id: 'camisa-lino-01',
    name: 'Camisa de lino',
    price: 1450,
    image: '/images/clothes/camisa-lino.webp',
    shortDescription: 'Transpirable y elegante.'
  },
  {
    id: 'bolso-mano-01',
    name: 'Bolso de mano',
    price: 980,
    image: '/images/ropa/bolso-mano.webp',
    shortDescription: 'Estilo y practicidad.'
  }
];
</script>

<style scoped>
</style>
