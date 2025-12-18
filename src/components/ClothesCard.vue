<template>
  <q-card class="clothes-card">
    <q-img :src="item.image || '/images/placeholder.svg'" :alt="item.name">
      <div class="absolute-top-right q-pa-sm" v-if="item.oferta">
        <q-badge color="red" text-color="white" label="Oferta" />
      </div>
    </q-img>

    <q-card-section>
      <div class="text-subtitle1 ellipsis-2-lines">{{ item.name }}</div>
      <div v-if="item.shortDescription" class="text-caption text-grey-7 ellipsis-2-lines">
        {{ item.shortDescription }}
      </div>
      <div class="row items-center q-mt-sm justify-between">
        <div class="text-h6">{{ currency(item.price) }}</div>
        <q-badge :color="statusColor" :label="item.estado || '—'" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn color="positive" unelevated size="sm" icon="fa-brands fa-whatsapp" aria-label="Comprar por WhatsApp" title="Comprar por WhatsApp" alt="Comprar por WhatsApp" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface ClothesItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  oferta?: boolean;
  estado?: string;
  shortDescription?: string;
}

const props = defineProps<{ item: ClothesItem }>();

function currency(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

const statusColor = computed(() => {
  const st = (props.item.estado || '').toLowerCase();
  if (st.includes('dispon')) return 'positive';
  if (st.includes('agota')) return 'negative';
  return 'grey-6';
});
</script>

<style scoped>
.clothes-card {
  width: 100%;
  max-width: 320px;
}

/* two-line clamp utility */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
