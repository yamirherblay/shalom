<template>
  <q-page class="about-page q-pa-lg">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="about-title text-center q-mb-lg">SHALOM</div>

        <div class="about-rule q-mx-auto q-mb-lg" style="width: 60px;"></div>

        <div class="about-content">
          <p>Shalom es tu tienda de productos para el hogar y la familia. Alimentos, bebidas, aseo personal, limpieza y artículos para tu casa — todo lo que necesitas en un solo lugar.</p>
          <p>Trabajamos con precios en CUP y puedes pedir por WhatsApp con atención personalizada y rápida.</p>
          <p>Shalom: paz, confianza y buena atención para ti y los tuyos.</p>
        </div>

        <div class="about-rule q-mx-auto q-my-lg" style="width: 60px;"></div>

        <div class="text-center text-terracota" style="letter-spacing: 8px; font-size: 1.2rem;">
          ★ ★ ★
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { branding } from 'src/config/branding';
import { useMeta } from 'quasar';

useMeta({
  title: `Acerca de | ${branding.name}`,
  meta: {
    description: { name: 'description', content: 'Conoce Shalom, tu tienda de productos de confianza.' },
    'og:title': { property: 'og:title', content: `Acerca de | ${branding.name}` },
    'og:description': { property: 'og:description', content: 'Conoce Shalom, tu tienda de productos de confianza.' },
    'og:url': { property: 'og:url', content: '/acerca' },
    'twitter:title': { name: 'twitter:title', content: `Acerca de | ${branding.name}` },
    'twitter:description': { name: 'twitter:description', content: 'Conoce Shalom, tu tienda de productos de confianza.' },
  },
});
</script>

<style scoped>
.about-page {
  background: #F5F0E8;
  min-height: 60vh;
}

.about-title {
  font-family: 'DM Serif Display', serif;
  font-size: 2rem;
  letter-spacing: 4px;
  color: #2C2C2C;
}

.about-rule {
  height: 2px;
  background: #C17A4B;
}

.about-content {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: #2C2C2C;
}

.about-content p {
  margin-bottom: 1rem;
}

.text-terracota {
  color: #C17A4B;
}
</style>
