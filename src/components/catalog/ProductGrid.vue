<template>
  <div class="product-grid">
    <div class="row q-col-gutter-md">
      <div v-for="product in products" :key="product.id" class="col-12 col-sm-12 col-md-3">
        <ProductCard
          :product="product"
          :show-whats-app="true"
          :show-add-to-cart="true"
          @whatsapp="$emit('whatsapp', $event)"
          @add-to-cart="$emit('add-to-cart', $event)"
        />
      </div>
    </div>

    <div v-if="products.length === 0" class="q-mt-xl text-grey text-center">
      <slot name="empty"> No hay productos disponibles. </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue';
import type { Product } from 'src/stores/types';

defineProps<{
  products: Product[];
}>();

defineEmits<{
  (e: 'whatsapp', product: Product): void;
  (e: 'add-to-cart', product: Product): void;
}>();
</script>

<style scoped>
.product-grid {
  min-height: 200px;
}
</style>
