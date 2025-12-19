<template>
  <q-page padding class="q-gutter-md back-page ">
    <div class="column items-center q-gutter-xs text-center q-mb-md">
      <div class="text-h5 text-weight-bold">Sabrina's Fashion</div>
      <div class="text-subtitle2 text-grey-7">Ofertas de ropa, calzado y más</div>
    </div>
    <section class="q-mb-md  sticky-cats" >
      <q-scroll-area class="cat-scroll  rounded-borders" :horizontal="true" :thumb-style="thumbStyle" :bar-style="barStyle">
        <div class="row no-wrap q-gutter-sm items-center ">
          <q-chip
            v-for="cat in categories"
            :key="cat.key"
            clickable
            :color="selectedCategory === cat.key ? 'primary' : 'grey-3'"
            :text-color="selectedCategory === cat.key ? 'white' : 'dark'"
            class="q-px-md q-py-xs text-weight-medium justify-center"
            @click="selectCategory(cat.key)"
          >
            <span class="q-ml-xs">{{ cat.label }}</span>
          </q-chip>
        </div>
      </q-scroll-area>
    </section>
    <div>
      <q-carousel
        v-if="filteredOffers.length"
        v-model="slide"
        swipeable
        animated
        arrows
        infinite
        autoplay
        control-color="primary"
        class="bg-transparent"
        :height="carouselHeight"
      >
        <q-carousel-slide
          v-for="(offer, idx) in filteredOffers"
          :key="offer.id"
          :name="idx"
          class="flex flex-center"
        >
          <div class="q-pa-sm" style="width: 100%; max-width: 360px;">
            <ClothesCard :item="offer" @view="viewItem" />
          </div>
        </q-carousel-slide>
      </q-carousel>

      <div v-else-if="offers.length" class="q-my-xl text-grey text-center">
        No hay productos para esta categoría.
      </div>
      <div v-else class="row justify-center q-my-xl">
        <q-spinner color="primary" size="2em" />
      </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ClothesCard from 'src/components/ClothesCard.vue';

interface OfferItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  shortDescription?: string;
  oferta?: boolean;
  estado?: string;
  category?: string;
}

type Cat = { key: string; label: string };

const offers = ref<OfferItem[]>([]);
const slide = ref(0);
const selectedCategory = ref<string>('all');

const carouselHeight = computed(() => {
  // alturas aproximadas para móvil/tablet/desktop
  const w = window.innerHeight;
  if (w < 480) return '420px';
  if (w < 1024) return '460px';
  return '500px';
});

const route = useRoute();

const categories = computed<Cat[]>(() => {
  const set = new Set<string>();
  offers.value.forEach(o => { if (o.category) set.add(o.category); });
  const arr = Array.from(set);
  return [{ key: 'all', label: 'Todas' }, ...arr.map(c => ({ key: c, label: capitalize(c) }))];
});

const filteredOffers = computed(() => {
  if (selectedCategory.value === 'all') return offers.value;
  return offers.value.filter(o => o.category === selectedCategory.value);
});

function selectCategory(key: string) {
  selectedCategory.value = key;
}

function applyRouteCategory() {
  const q = (route.query.cat as string | undefined) || 'all';
  const validKeys = new Set(categories.value.map(c => c.key));
  selectedCategory.value = validKeys.has(q) ? q : 'all';
}

watch(() => route.query.cat, applyRouteCategory);

const thumbStyle = {
  right: '2px',
  borderRadius: '4px',
  backgroundColor: 'rgba(0,0,0,0.25)',
  width: '4px',
  height: '4px',
};

const barStyle = {
  right: '2px',
  borderRadius: '4px',
  backgroundColor: 'rgba(0,0,0,0.08)',
  width: '4px',
  height: '4px',
};

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function viewItem(item: OfferItem) {
  // Placeholder: aquí podrías navegar a un detalle si existiera ruta
  console.log('ver item', item.id);
}

onMounted(async () => {
  try {
    const res = await fetch('/data/clothes.json');
    offers.value = await res.json();
    // aplicar categoría desde la ruta si existe
    applyRouteCategory();
  } catch (e) {
    console.error('Error cargando clothes.json', e);
  }
});
</script>

<style scoped>
/* Asegurar que el carrusel no cause scroll vertical innecesario */
:deep(.q-carousel__slides-container) {
  align-items: center; /* centra verticalmente la tarjeta */
}

.cat-scroll {
  height: 56px;
  padding: 6px 4px;
  background: #f5f5f5;
  border: 1px solid rgba(0,0,0,0.05);
  background: linear-gradient(to bottom, #ffffff 0%, #f5f5f5 100%);
}

.sticky-cats {
  position: sticky;
  top: 56px; /* altura del header de Quasar (aprox) */
  z-index: 10; /* sobre el contenido de la página */

}
.back-page {
  background: linear-gradient(#fdfdfd, #bd6cf4);

}
</style>
