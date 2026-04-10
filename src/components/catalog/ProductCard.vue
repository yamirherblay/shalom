<template>
  <q-card class="product-card">
    <q-img :src="product.image || '/images/placeholder.svg'" :ratio="1" :alt="product.name">
      <div v-if="product.oferta && product.estado !== 'Agotado'" class="absolute-top-right q-pa-sm">
        <q-badge color="red" text-color="white" label="Oferta" />
      </div>
      <div v-if="product.new" class="absolute-top-left q-pa-sm">
        <q-badge color="primary" text-color="white" label="Nuevo" />
      </div>
    </q-img>

    <q-card-section>
      <div class="text-subtitle1 ellipsis-2-lines">{{ product.name }}</div>
      <div v-if="product.descripcion" class="text-caption text-grey-7 ellipsis-2-lines">
        {{ product.descripcion }}
      </div>
      <div class="row items-center q-mt-sm justify-between">
        <div class="text-h6">{{ formattedPrice }}</div>
        <q-badge
          :color="product.estado === 'Disponible' ? 'green' : 'red'"
          :text-color="product.estado === 'Disponible' ? 'white' : 'grey-1'"
          :label="product.estado"
        />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        v-if="showWhatsApp"
        color="positive"
        unelevated
        size="sm"
        icon="fa-brands fa-whatsapp"
        label="Solicitar"
        @click="$emit('whatsapp', product)"
      />
      <q-btn
        v-if="showAddToCart"
        color="primary"
        unelevated
        size="sm"
        icon="shopping_cart"
        label="Añadir"
        :disable="product.estado === 'Agotado'"
        @click="$emit('add-to-cart', product)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from 'src/stores/types';

const props = defineProps<{
  product: Product;
  showWhatsApp?: boolean;
  showAddToCart?: boolean;
}>();

defineEmits<{
  (e: 'whatsapp', product: Product): void;
  (e: 'add-to-cart', product: Product): void;
}>();

const formattedPrice = computed(() => {
  const price = props.product.descuento || props.product.price;
  const currency = props.product.currency || 'CUP';
  return formatPrice(price, currency);
});

function formatPrice(value: number, currency: 'CUP' | 'USD'): string {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(value);
}
</script>

<style scoped>
.product-card {
  width: 100%;
  max-width: 320px;
  border-radius: 12px;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
