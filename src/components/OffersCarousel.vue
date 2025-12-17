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
            <div class="col-12 col-md-6 q-pa-md flex items-center justify-center">
              <q-img
                :src="item.image || placeholder"
                :alt="item.name"
                spinner-color="primary"
              />
            </div>
            <div class="text-h5 text-weight-bold">{{ item.name }}</div>

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


export interface OfferItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  shortDescription?: string;
}

const props = defineProps<{ items: OfferItem[] }>();

const slide = ref(0);

const placeholder = '/images/placeholder.svg';

const items = props.items;

</script>

<style scoped>
.offers-carousel :deep(.q-carousel__slides-container) {
  border-radius: 8px;
}
</style>
