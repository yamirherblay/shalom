<template>
  <q-page class="index-page">
    <!-- Hero -->
    <section class="hero-section text-white noise-bg">
      <canvas ref="particleCanvas" class="hero-particles"></canvas>
      <div class="hero-glow"></div>
      <div class="hero-content column items-center text-center q-pa-lg">
        <q-img src="/images/logo.jpeg" alt="Shalom" class="hero-logo q-mb-lg" ratio="1" />
        <div class="hero-title hero-enter-title">SHALOM</div>
        <div class="hero-subtitle hero-enter-sub">Tu tienda de confianza</div>
        <q-btn
          color="accent"
          size="lg"
          :label="branding.hero.ctaText"
          :to="branding.hero.ctaLink"
          unelevated
          no-caps
          text-color="dark"
          class="hero-cta q-px-xl hero-enter-cta"
        />
      </div>
    </section>

    <div class="wave-divider hero-enter-rule" />

    <!-- Categories -->
    <section class="categories-section q-pa-lg section-reveal basket-texture">
      <div class="text-center q-mb-lg">
        <div class="categories-title">LO QUE TENEMOS</div>
        <div class="text-grey-9 text-caption">Explora por secciones</div>
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
            <q-card flat bordered class="category-inner bg-white" :style="{ '--cat-color': categoryColors[cat.key] || '#C17A4B' }">
              <div class="terracota-border-top"></div>
              <q-card-section class="column items-center text-center q-py-lg">
                <q-icon :name="cat.icon" size="2.5rem" class="category-icon q-mb-sm" />
                <div class="category-label">{{ cat.label }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <div class="wave-divider" />

    <!-- Featured products -->
    <section class="shelf-section q-pa-lg section-reveal">
      <div class="text-center q-mb-lg">
        <div class="shelf-title">LO QUE TODOS COMPRAN</div>
        <div class="text-grey-7 text-caption">Lo más vendido — hay ofertas</div>
      </div>
      <div v-if="loading" class="row q-col-gutter-md">
        <div v-for="n in 4" :key="n" class="col-6 col-sm-4 col-md-3">
          <div class="skeleton-card bg-white" style="border-radius: 4px; overflow: hidden">
            <q-skeleton square style="width: 100%; aspect-ratio: 1" animation="wave" />
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
            <div class="shelf-img-wrap">
              <q-img
                :src="product.image || '/images/placeholder.svg'"
                ratio="1"
                class="shelf-img cursor-pointer"
                @click.stop="preview.open(product)"
              />
              <div v-if="product.oferta" class="offer-ribbon">OFERTA</div>
            </div>
            <div class="shelf-divider"></div>
            <div class="shelf-info q-pa-sm">
              <div class="shelf-name text-weight-bold">{{ product.name }}</div>
              <div class="shelf-price" :class="{'shelf-stacked': product.oferta}">
                <template v-if="product.oferta">
                  <span class="old-price">{{ formatPrice(product.price) }}</span>
                  <span class="sale-price">{{ formatPrice(product.descuento) }}</span>
                </template>
                <template v-else>
                  <span class="sale-price">{{ formatPrice(product.price) }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center q-mt-md">
        <q-btn flat no-caps label="Visita nustra tienda →" to="/catalogo" class="shelf-link" />
      </div>
    </section>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { branding } from 'src/config/branding';
import { defaultCategories } from 'src/config/categories';

import { useProducts } from 'src/composables/useProducts';
import { useProductPreview } from 'src/composables/useProductPreview';
import { useMeta } from 'quasar';

const preview = useProductPreview();

const displayCategories = defaultCategories.filter((c) => c.key !== 'all');
const revealedCategories = ref(false);

const categoryColors: Record<string, string> = {
  alimentos: '#E8A838',
  bebidas: '#5FA8D3',
  aseo: '#C08497',
  limpieza: '#7EC8B6',
  hogar: '#D4896B',
  variado: '#C9A84C',
};

const particleCanvas = ref<HTMLCanvasElement | null>(null);
let particleAnimId = 0;

const { products, fetchProducts, loading } = useProducts();

const featuredProducts = computed(() => {
  const available = products.value.filter((p) => p.estado !== 'Agotado');
  const offers = available.filter((p) => p.oferta);
  const nonOffers = available.filter((p) => !p.oferta);

  const selectedOffers = offers.slice(0, 2);
  const remaining = 4 - selectedOffers.length;
  const shuffled = [...nonOffers].sort(() => Math.random() - 0.5);
  const selectedNonOffers = shuffled.slice(0, remaining);

  return [...selectedOffers, ...selectedNonOffers];
});

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
    maximumFractionDigits: 0,
  }).format(value);
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  opacitySpeed: number;
}

function initParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles: Particle[] = [];
  const count = 35;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1.5,
      speedY: -(Math.random() * 0.3 + 0.15),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.25 + 0.1,
      opacitySpeed: (Math.random() - 0.5) * 0.003,
    });
  }

  let lastTime = 0;

  function animate(time: number) {
    const dt = Math.min(time - lastTime, 50);
    lastTime = time;
    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.y += p.speedY * (dt / 16);
      p.x += p.speedX * (dt / 16);
      p.opacity += p.opacitySpeed * (dt / 16);

      if (p.opacity > 0.35) { p.opacity = 0.35; p.opacitySpeed = -p.opacitySpeed; }
      if (p.opacity < 0.05) { p.opacity = 0.05; p.opacitySpeed = -p.opacitySpeed; }

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }

      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx!.fill();
    }

    particleAnimId = requestAnimationFrame(animate);
  }

  particleAnimId = requestAnimationFrame(animate);

  const onResize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(particleAnimId);
    window.removeEventListener('resize', onResize);
  };
}

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  await fetchProducts();
  if (particleCanvas.value) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const cleanup = initParticles(particleCanvas.value);
      onUnmounted(() => cleanup?.());
    }
  }
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

useMeta({
  title: `${branding.name} | Inicio`,
  meta: {
    description: { name: 'description', content: branding.slogan },
    'og:title': { property: 'og:title', content: `${branding.name} | Inicio` },
    'og:description': { property: 'og:description', content: branding.slogan },
    'og:url': { property: 'og:url', content: '/' },
    'twitter:title': { name: 'twitter:title', content: `${branding.name} | Inicio` },
    'twitter:description': { name: 'twitter:description', content: branding.slogan },
  },
});
</script>

<style scoped>
.index-page {
  overflow-x: hidden;
}

/* Hero */
.hero-section {
  background: #1A2E24;
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
  background: radial-gradient(ellipse at center, rgba(232, 168, 56, 0.2) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.hero-logo {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  animation:
    hero-scale-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both,
    logo-float 4s ease-in-out infinite;
  animation-delay: 0s, 1.2s;
}

.hero-title {
  font-family: 'DM Serif Display', serif;
  font-size: 3rem;
  letter-spacing: 6px;
  color: #fff;
  line-height: 1.1;
}

.hero-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 2px;
  margin-top: 4px;
  margin-bottom: 20px;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  max-width: 480px;
}

.hero-tag {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 5px 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.3px;
}

.hero-cta {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  border-radius: 6px;
}

/* Entrance animations */
@keyframes hero-scale-in {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes hero-fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-fade-down {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes logo-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.hero-enter-title {
  animation: hero-fade-down 0.6s ease both;
  animation-delay: 0.15s;
}

.hero-enter-sub {
  animation: hero-fade-in 0.6s ease both;
  animation-delay: 0.3s;
}

.hero-enter-cta {
  animation: hero-fade-up 0.6s ease both;
  animation-delay: 0.5s;
}

.hero-enter-rule {
  animation: hero-fade-in 0.6s ease both;
  animation-delay: 0.7s;
}

/* Categories */
.categories-section {
  background: #F5F0E8;
}

.categories-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.75rem;
  letter-spacing: 2px;
  color: #2D4A3B;
}

.category-card {
  cursor: pointer;
}

.category-inner {
  border-radius: 6px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.category-inner {
  position: relative;
  overflow: hidden;
}

.category-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  background: radial-gradient(circle at 50% 40%, rgba(193, 122, 75, 0.14), transparent 70%);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.category-inner:hover::before {
  opacity: 1;
}

.category-inner:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(45, 74, 59, 0.12);
}

.category-inner:hover::before {
  opacity: 1;
}

.category-inner:hover .terracota-border-top {
  border-top-color: var(--cat-color, #C17A4B);
}

.category-icon {
  color: #196ddb;
  transition: color 0.3s ease;
}

.category-inner:hover .category-icon {
  color: var(--cat-color, #C17A4B);
}

.category-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #2C2C2C;
}

/* Shelf (featured products) */
.shelf-section {
  background: #F5F0E8;
}

.shelf-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.75rem;
  letter-spacing: 2px;
  color: #2D4A3B;
}

.shelf-card {
  border-radius: 6px;
  overflow: hidden;
  background: #FFFFFF;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.shelf-img-wrap {
  position: relative;
  overflow: hidden;
}

.offer-ribbon {
  position: absolute;
  top: 14px;
  right: -30px;
  background: #E8A838;
  color: #1A1A1A;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 3px 34px;
  transform: rotate(45deg);
  z-index: 2;
  text-transform: uppercase;
  line-height: 1.4;
  pointer-events: none;
}

.shelf-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(45, 74, 59, 0.1);
}

.shelf-divider {
  height: 1px;
  background: #C17A4B;
  opacity: 0.3;
  margin: 0;
}

.shelf-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #2C2C2C;
  line-height: 1.2;
}

.shelf-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: #2C2C2C;
  margin-top: 2px;

  .old-price {
    text-decoration: line-through;
    opacity: 0.45;
    margin-right: 6px;
    font-size: 0.85em;
    color: #dc2626;
  }

  .sale-price {
    font-weight: 600;
  }
}

.shelf-stacked {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  gap: 2px;
}

.shelf-badge {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 2px;
  margin-top: 4px;
}

.shelf-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: #C17A4B;
}

/* Responsive hero */
@media (min-width: 768px) {
  .hero-logo {
    width: 180px;
    height: 180px;
  }
  .hero-title {
    font-size: 4.5rem;
    letter-spacing: 10px;
  }
  .hero-subtitle {
    font-size: 1.2rem;
  }
  .hero-tags {
    max-width: 560px;
    gap: 10px;
  }

  .hero-tag {
    font-size: 0.85rem;
    padding: 6px 18px;
  }
}

@media (min-width: 1024px) {
  .hero-logo {
    width: 200px;
    height: 200px;
  }
  .hero-title {
    font-size: 5.5rem;
  }
}
</style>
