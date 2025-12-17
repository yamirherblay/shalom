<template>
  <div class="offers-carousel">
    <q-carousel
      v-model="slide"
      animated
      swipeable
      infinite
      arrows
      control-color="primary"
      :autoplay="5000"
      transition-prev="slide-right"
      transition-next="slide-left"
      class="bg-grey-1 text-dark rounded-borders shadow-2"
      height="360px"
    >
      <q-carousel-slide
        v-for="(item, idx) in items"
        :key="item.id || idx"
        :name="idx"
        class="column items-center justify-center q-pa-md"
      >
        <div class="row items-center justify-between full-width">
          <div class="col-12 col-md-6 q-pa-md flex column items-start">
            <div class="text-h5 text-weight-bold">{{ item.name }}</div>
            <div v-if="item.shortDescription" class="text-body2 text-grey-7 q-mt-xs">
              {{ item.shortDescription }}
            </div>
            <div class="text-h6 q-mt-sm">{{ currency(item.price) }}</div>
            <div class="q-mt-md">
              <q-btn color="primary" icon="add_shopping_cart" label="Agregar al carrito" @click="addToCart(item)" class="q-mr-sm"/>
              <q-btn flat color="primary" icon="visibility" label="Ver" :to="{ name: 'product', params: { id: item.id } }"/>
            </div>
          </div>
          <div class="col-12 col-md-6 q-pa-md flex items-center justify-center">
            <q-img
              :src="item.image || placeholder"
              :alt="item.name"
              ratio="4/3"
              style="max-width: 420px; width: 100%"
              spinner-color="primary"
            />
          </div>
        </div>
      </q-carousel-slide>

      <template #control>
        <q-carousel-control position="bottom" class="q-gutter-xs">
          <q-btn
            v-for="(item, i) in items"
            :key="i"
            round dense size="sm"
            :color="slide === i ? 'primary' : 'grey-5'"
            @click="slide = i"
            :aria-label="`Ir a la oferta ${i + 1}`"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from 'src/stores/cart';
import type { Product } from 'src/stores/types';

export interface OfferItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  shortDescription?: string;
}

const props = defineProps<{ items: OfferItem[] }>();

const slide = ref(0);
const cart = useCartStore();
const placeholder = '/images/placeholder.svg';

const items = props.items;

function addToCart(p: OfferItem) {
  // Cast to Product shape minimally to interoperate with cart
  const product: Product = {
    id: p.id,
    name: p.name,
    price: p.price,
    categoryId: 'ropa',
    image: p.image || placeholder,
  } as Product;
  cart.add(product, 1);
}

function currency(n: number) {
  return new Intl.NumberFormat('es-CU', { style: 'currency', currency: 'CUP' }).format(n);
}
</script>

<style scoped>
.offers-carousel :deep(.q-carousel__slides-container) {
  border-radius: 8px;
}
</style>
