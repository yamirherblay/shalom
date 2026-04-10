<template>
  <q-page class="index-page column">
    <section class="hero-section">
      <div class="column items-center text-center q-pa-xl hero-content text-white">
        <div class="text-h3 text-weight-bold q-mb-sm">{{ branding.hero.title }}</div>
        <div class="text-subtitle1 q-mb-lg">{{ branding.hero.subtitle }}</div>
        <div class="row justify-center q-gutter-sm">
          <q-btn
            color="primary"
            size="lg"
            :label="branding.hero.ctaText"
            :to="branding.hero.ctaLink"
            unelevated
            rounded
          />
          <q-btn
            v-if="branding.hero.secondaryCtaText"
            color="secondary"
            size="lg"
            :label="branding.hero.secondaryCtaText"
            :to="branding.hero.secondaryCtaLink"
            unelevated
            rounded
          />
        </div>
      </div>
      <q-icon name="keyboard_arrow_down" size="2rem" class="scroll-hint" />
    </section>

    <section v-if="featuredProducts.length" class="featured-section q-py-lg">
      <div class="text-h5 text-center q-mb-md card-title">Destacados</div>
      <div class="featured-scroll">
        <q-card
          v-for="product in featuredProducts"
          :key="product.id"
          class="featured-card"
          flat
        >
          <q-img
            :src="product.image || '/images/placeholder.svg'"
            :ratio="16 / 9"
            class="featured-img"
          >
            <div v-if="product.oferta" class="absolute-top-right q-pa-sm">
              <q-badge color="red" text-color="white" label="Oferta" />
            </div>
            <div v-if="product.new" class="absolute-top-left q-pa-sm">
              <q-badge color="primary" text-color="white" label="Nuevo" />
            </div>
          </q-img>
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium card-title">{{ product.name }}</div>
            <div class="text-h6 text-accent">{{ formatPrice(product) }}</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              color="primary"
              label="Ver en catálogo"
              to="/catalogo"
              unelevated
              rounded
              size="sm"
            />
          </q-card-actions>
        </q-card>
      </div>
    </section>

    <section class="categories-section q-pa-lg">
      <div class="text-h5 text-center q-mb-md card-title">{{ branding.slogan }}</div>
      <div class="row q-col-gutter-md items-center justify-center">
        <q-card
          v-for="cat in defaultCategories"
          :key="cat.key"
          flat
          class="category-card cursor-pointer"
        >
          <q-card-section class="column items-center text-center">
            <q-avatar size="80px" v-if="cat.image">
              <img :src="cat.image" :alt="cat.label" />
            </q-avatar>
            <div class="q-mt-sm">
              <q-btn
                color="primary"
                size="sm"
                :label="cat.label"
                unelevated
                rounded
                :to="`/catalogo?cat=${cat.key}`"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { branding } from 'src/config/branding';
import { defaultCategories } from 'src/config/categories';
import { useProducts } from 'src/composables/useProducts';
import type { Product } from 'src/stores/types';
import { useMeta } from 'quasar';

const { products, fetchProducts } = useProducts();

const featuredProducts = computed(() =>
  products.value
    .filter((p) => (p.oferta || p.new) && p.estado !== 'Agotado')
    .slice(0, 3),
);

function formatPrice(product: Product): string {
  const price = product.descuento || product.price;
  const currency = product.currency || 'CUP';
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(price);
}

onMounted(() => {
  void fetchProducts();
});

useMeta({
  title: `${branding.name} | Inicio`,
  meta: {
    description: { name: 'description', content: branding.slogan },
    ogTitle: { property: 'og:title', content: branding.name },
    ogDescription: { property: 'og:description', content: branding.slogan },
  },
});
</script>

<style scoped>
.index-page {
  overflow-x: hidden;
}

/* Hero */
.hero-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/images/Productos-agricolas.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.scroll-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
  z-index: 1;
  color: white;
  opacity: 0.7;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

/* Destacados */
.featured-section {
  background: #ffffff;
}

.featured-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px 16px;
  scrollbar-width: none;
}

.featured-scroll::-webkit-scrollbar {
  display: none;
}

.featured-card {
  min-width: 260px;
  max-width: 280px;
  flex-shrink: 0;
  border-radius: 12px;
  scroll-snap-align: center;
}

.featured-img {
  border-radius: 12px 12px 0 0;
}

.card-title {
  color: #27272a;
}

/* Categorías */
.category-card {
  transition: transform 0.2s ease;
}

.category-card:hover {
  transform: translateY(-4px);
}
</style>
