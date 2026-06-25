<template>
  <q-page class="index-page">
    <!-- Hero -->
    <section class="hero-section text-white noise-bg">
      <div class="hero-glow"></div>
      <div class="hero-content column items-center text-center q-pa-lg">
        <q-img
          src="/images/logo.jpeg"
          alt="Ferretería VIP"
          class="hero-logo q-mb-lg"
          ratio="1"
        />
        <div class="hero-subtitle text-grey-4 q-mb-lg hero-enter-sub">
          {{ branding.hero.subtitle }}
        </div>
        <q-btn
          color="accent"
          size="lg"
          :label="branding.hero.ctaText"
          :to="branding.hero.ctaLink"
          unelevated
          no-caps
          class="hero-cta q-px-xl hero-enter-cta"
        />
      </div>
    </section>

    <hr class="brass-rule hero-enter-rule" />

    <!-- Categories -->
    <section class="categories-section q-pa-lg section-reveal">
      <div class="text-center q-mb-lg">
        <div class="categories-title text-weight-bold">CATEGORÍAS</div>
        <div class="text-grey-7 text-caption">Explora por secciones</div>
      </div>
      <div class="row q-col-gutter-md justify-center">
        <div
          v-for="(cat, index) in displayCategories"
          :key="cat.key"
          class="col-6 col-sm-4 col-md-3"
        >
          <div
            class="category-card scroll-reveal"
            :class="{ revealed: revealedCategories }"
            :style="{ transitionDelay: `${index * 80}ms` }"
            @click="$router.push(`/catalogo?cat=${cat.key}`)"
          >
            <q-card flat bordered class="category-inner bg-white">
              <div class="gold-border-top"></div>
              <q-card-section class="column items-center text-center q-py-lg">
                <q-icon :name="cat.icon" size="2.5rem" class="category-icon q-mb-sm" />
                <div class="category-label text-weight-bold">{{ cat.label }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <hr class="brass-rule" />

    <!-- Featured products -->
    <section class="shelf-section q-pa-lg section-reveal">
      <div class="text-center q-mb-lg">
        <div class="shelf-title text-weight-bold">PRODUCTOS DESTACADOS</div>
        <div class="text-grey-7 text-caption">Lo más vendido de la semana</div>
      </div>
      <div v-if="loading" class="row q-col-gutter-md">
        <div v-for="n in 4" :key="n" class="col-6 col-sm-4 col-md-3">
          <div class="skeleton-card bg-white" style="border-radius: 4px; overflow: hidden;">
            <q-skeleton square style="width: 100%; aspect-ratio: 1;" animation="wave" />
            <div class="q-pa-sm">
              <q-skeleton type="text" width="80%" height="14px" animation="wave" />
              <q-skeleton type="text" width="50%" height="16px" class="q-mt-xs" animation="wave" />
              <q-skeleton type="text" width="30%" height="12px" class="q-mt-xs" animation="wave" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="row q-col-gutter-md">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="col-6 col-sm-4 col-md-3 cursor-pointer"
          @click="$router.push('/catalogo')"
        >
          <div class="shelf-card bg-white">
            <q-img
              :src="product.image || '/images/placeholder.svg'"
              ratio="1"
              class="shelf-img cursor-pointer"
              @click.stop="preview.open(product)"
            />
            <div class="shelf-divider"></div>
            <div class="shelf-info q-pa-sm">
              <div class="shelf-name text-weight-bold">{{ product.name }}</div>
              <div class="shelf-price">{{ formatPrice(product.descuento || product.price) }}</div>
              <q-badge
                :color="product.estado === 'Disponible' ? 'positive' : 'negative'"
                :label="product.estado"
                class="shelf-badge"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-center q-mt-md">
        <q-btn
          flat
          no-caps
          label="Ver catálogo completo →"
          to="/catalogo"
          class="shelf-link"
        />
      </div>
    </section>

    <hr class="brass-rule" />

    <!-- WhatsApp CTA -->
    <section class="cta-section bg-primary text-white q-pa-lg section-reveal">
      <div class="column items-center text-center">
        <q-icon name="fa-brands fa-whatsapp" size="3rem" class="q-mb-md" style="color: #25D366;" />
        <div class="cta-title text-weight-bold" style="font-family: 'Oswald', sans-serif; letter-spacing: 3px; font-size: 1.5rem;">¿NECESITAS AYUDA?</div>
        <div class="cta-subtitle text-grey-4 q-mb-md q-mt-sm">
          Escríbenos por WhatsApp y te asesoramos
        </div>
        <q-btn
          color="positive"
          size="md"
          label="Escribir por WhatsApp"
          unelevated
          no-caps
          class="q-px-xl"
          style="border-radius: 2px;"
          @click="openWhatsApp"
        >
          <template v-slot:default>
            <q-icon name="fa-brands fa-whatsapp" />
          </template>
        </q-btn>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { branding } from 'src/config/branding';
import { defaultCategories } from 'src/config/categories';
import { whatsappConfig, formatWhatsAppUrl } from 'src/config/whatsapp';
import { useProducts } from 'src/composables/useProducts';
import { useProductPreview } from 'src/composables/useProductPreview';
import { useMeta } from 'quasar';

const preview = useProductPreview();

const displayCategories = defaultCategories.filter((c) => c.key !== 'all');
const revealedCategories = ref(false);

const { products, fetchProducts, loading } = useProducts();

const featuredProducts = computed(() =>
  products.value.filter((p) => p.estado !== 'Agotado').slice(0, 4),
);

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
    maximumFractionDigits: 0,
  }).format(value);
}

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  await fetchProducts();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.classList.contains('categories-section')) {
            revealedCategories.value = true;
          }
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  const els = document.querySelectorAll('.section-reveal');
  if (els.length) {
    els.forEach((el) => observer?.observe(el));
  }
});

onUnmounted(() => {
  observer?.disconnect();
});

function openWhatsApp() {
  const url = formatWhatsAppUrl(whatsappConfig.messageTemplates.contact());
  window.open(url, '_blank');
}

useMeta({
  title: `${branding.name} | Inicio`,
  meta: {
    description: { name: 'description', content: branding.slogan },
  },
});
</script>

<style scoped>
.index-page {
  overflow-x: hidden;
}

/* Hero */
.hero-section {
  background: #0C1A2E;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse at center, rgba(200, 150, 62, 0.25) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-logo {
  width: 260px;
  height: 260px;
  border-radius: 50%;
  animation:
    hero-scale-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both,
    logo-float 4s ease-in-out infinite;
  animation-delay: 0s, 1.2s;
}

.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  max-width: 320px;
}

.hero-cta {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 2px;
}

/* Entrance animations */
@keyframes hero-scale-in {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes hero-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes hero-rule-expand {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

.hero-enter-sub {
  animation: hero-fade-in 0.6s ease both;
  animation-delay: 0.25s;
}

.hero-enter-cta {
  animation: hero-fade-up 0.6s ease both;
  animation-delay: 0.5s;
}

.hero-enter-rule {
  animation: hero-rule-expand 0.5s ease both;
  animation-delay: 0.8s;
  transform-origin: center;
}

/* Categories */
.categories-section {
  background: #F5F3EF;
}

.categories-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 3px;
}

.category-card {
  cursor: pointer;
}

.category-inner {
  border-radius: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-inner:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.category-icon {
  color: #C8963E;
}

.category-label {
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  letter-spacing: 1px;
}

/* Shelf (featured products) */
.shelf-section {
  background: #FFFFFF;
}

.shelf-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 3px;
}

.shelf-card {
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.shelf-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.shelf-divider {
  height: 1px;
  background: #8C929A;
  margin: 0;
}

.shelf-name {
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #1A1A2E;
  line-height: 1.2;
}

.shelf-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: #1A1A2E;
  margin-top: 2px;
}

.shelf-badge {
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 2px;
  margin-top: 4px;
}

.shelf-link {
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  letter-spacing: 1px;
  color: #C8963E;
}

/* CTA section */
.cta-title {
  font-family: 'Oswald', sans-serif;
}

.cta-subtitle {
  font-family: 'Inter', sans-serif;
}

/* Responsive hero */
@media (min-width: 768px) {
  .hero-logo {
    width: 380px;
    height: 380px;
  }
  .hero-subtitle {
    font-size: 1.15rem;
    max-width: 400px;
  }
}

@media (min-width: 1024px) {
  .hero-logo {
    width: 420px;
    height: 420px;
  }
}
</style>
