<template>
  <div>
    <q-carousel
      v-model="slide"
      animated
      swipeable
      navigation
      arrows
      infinite
      height="320px"
      class="rounded-borders"
    >
      <q-carousel-slide
        v-for="(item, idx) in props.slides"
        :key="idx"
        :name="idx"
      >
        <div class="full-height row no-wrap items-center">
          <q-img
            :src="item.src"
            :alt="item.alt || `imagen-${idx+1}`"
            class="col"
          >
            <template #error>
              <div class="column items-center justify-center bg-grey-3 text-grey-7" style="height:100%">
                <q-icon name="image_not_supported" size="48px" class="q-mb-sm" />
                <div>Imagen no disponible</div>
              </div>
            </template>
            <template v-if="item.caption">
              <div class="absolute-bottom text-subtitle2 bg-black-6 q-pa-sm">
                {{ item.caption }}
              </div>
            </template>
          </q-img>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface CarouselSlide {
  src: string;
  alt?: string;
  caption?: string;
}

const props = defineProps<{ slides: CarouselSlide[] }>();

const slide = ref(0);
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
  overflow: hidden;
}
</style>
