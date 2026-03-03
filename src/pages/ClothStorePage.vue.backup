<template>
  <q-page padding class="q-gutter-md back-page">
    <div class="column items-center q-gutter-xs text-center q-mb-md">
      <q-img
        src="images/Sabrinallogo.jpeg"
        alt="Logo Sabrina"
        ratio="1"
        style="max-width: 150px; border-radius: 50%"
        fit="contain"
      />
      <div class="text-h5 text-weight-bold">Sabrina's Fashion</div>
      <div class="text-subtitle2 text-grey-7">Ofertas de ropa, calzado y más</div>
    </div>
    <section class="q-mb-md sticky-cats">
      <q-scroll-area
        class="cat-scroll rounded-borders"
        :horizontal="true"
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
      >
        <div class="row no-wrap q-gutter-sm items-center">
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
      <MarqueeBar message="Visítanos y encontrarás esto y MUCHO MÁS..." />
    </section>

    <div>
      <div v-if="filteredOffers.length" class="row q-col-gutter-md">
        <div
          v-for="offer in filteredOffers"
          :key="offer.id"
          class="col-6 col-sm-4 col-md-3 col-lg-2 flex justify-center"
        >
          <ClothesCard :item="offer" />
        </div>
      </div>

      <div v-else-if="offers.length" class="q-my-xl text-grey text-center">
        {{
          searchQuery.trim()
            ? 'No se encontraron productos para tu búsqueda.'
            : 'No hay productos para esta categoría.'
        }}
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
import MarqueeBar from 'src/components/MarqueeBar.vue';

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
const selectedCategory = ref<string>('all');
const searchQuery = ref<string>('');

const route = useRoute();

const categories = computed<Cat[]>(() => {
  const set = new Set<string>();
  offers.value.forEach((o) => {
    if (o.category) set.add(o.category);
  });
  const arr = Array.from(set);
  return [{ key: 'all', label: 'Todas' }, ...arr.map((c) => ({ key: c, label: capitalize(c) }))];
});

const filteredOffers = computed(() => {
  let filtered = offers.value;

  // Filtrar por categoría
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((o) => o.category === selectedCategory.value);
  }

  // Filtrar por término de búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (o) =>
        o.name?.toLowerCase().includes(query) ||
        o.shortDescription?.toLowerCase().includes(query) ||
        o.category?.toLowerCase().includes(query),
    );
  }

  return filtered;
});

function selectCategory(key: string) {
  selectedCategory.value = key;
}

function applyRouteCategory() {
  const q = (route.query.cat as string | undefined) || 'all';
  const validKeys = new Set(categories.value.map((c) => c.key));
  selectedCategory.value = validKeys.has(q) ? q : 'all';
}

function applyRouteSearch() {
  searchQuery.value = (route.query.q as string | undefined) || '';
}

watch(() => route.query.cat, applyRouteCategory);
watch(() => route.query.q, applyRouteSearch);

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

onMounted(async () => {
  try {
    const res = await fetch('/data/clothes.json');
    offers.value = await res.json();
    // aplicar categoría y búsqueda desde la ruta si existe
    applyRouteCategory();
    applyRouteSearch();
  } catch (e) {
    console.error('Error cargando clothes.json', e);
  }
});
</script>

<style scoped>
.cat-scroll {
  height: 56px;
  padding: 6px 4px;
  background: #f5f5f5;
  border: 1px solid rgba(0, 0, 0, 0.05);
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
.marquee-bar {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: rgba(169, 168, 169, 0.92);
  color: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.marquee-track {
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  font-weight: 600;
  font-size: 1.125rem;
  animation: marquee-scroll 15s linear infinite;
}
@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
