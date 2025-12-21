<template>
  <q-page class="column">

    <!-- Hero Section -->
    <section class="q-pa-xl text-white hero-section">
      <!-- Marquee message at the top of hero -->
      <div class="marquee-bar">
        <div class="marquee-track ">
          <span>--Aceptamos Moneda nacional, Zelle (Tasa Cambio Vigente) y Transferencias- </span>
          <q-btn dense @click="showMarqueeModal = true">---GRAN RIFA PARA EL 24 de DICIEMBRE--- </q-btn>
        </div>
      </div>
      <div class="column items-center text-center">
        <div class="text-h3 text-weight-bold q-mb-sm">Descubre lo mejor en nuestra Tienda</div>
        <div class="text-subtitle1 q-mb-lg">Ofertas irresistibles y productos seleccionados para ti</div>
        <q-btn color="primary" size="lg" label="Ir al MERCADO" to="/tienda" unelevated bordered rounded class="q-mt-xl" />
      </div>
    </section>

    <!-- Qué ofrecemos (categorías) -->
    <section class="q-pa-lg text-grey-light ">
      <div class="text-h5 text-center q-mb-md">¿Qué ofrecemos?</div>
      <div class="q-gutter-md">
        <div class="row q-col-gutter-md items-center justify-evenly">
            <q-card
              v-for="cat in categories"
              :key="cat.key"
              flat
              class="category-card cursor-pointer">
              <q-card-section class="column items-center text-center ">
                <q-img
                  :src="cat.image"
                  class="category-img"
                  :ratio="1"
                />
                <div class="text-subtitle2 q-mt-sm">
                  <q-btn
                    color="primary"
                    class="q-mb-xs"
                    size="sm"
                    :label="cat.label"
                    unelevated
                    rounded
                    @click="goToCategory(cat.key)"
                    />
                </div>
              </q-card-section>
            </q-card>

        </div>
      </div>
    </section>


    <!-- Modal triggered from marquee button -->
    <q-dialog v-model="showMarqueeModal">
      <q-card style="max-width: 520px; width: 92vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Información</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup aria-label="Cerrar" />
        </q-card-section>
        <q-card-section>
          <h3 class="q-mt-none q-mb-sm">Eventos y especiales</h3>
          <p>
            Muy pronto compartiremos aquí detalles sobre eventos, rifas y especiales. ¡Mantente atento!
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" label="Entendido" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useMeta} from 'quasar';
import {useRouter} from 'vue-router';

useMeta({
  title: 'Tienda online en Las Tunas | Mercado Variado Texas',
  meta: {
    description: { name: 'description', content: 'Compra cárnicos, confituras y productos del hogar en Las Tunas, Cuba. Entrega local rápida.' },
    keywords: { name: 'keywords', content: 'tienda online Las Tunas, cárnicos Las Tunas, confituras en Las Tunas, productos del hogar en Las Tunas,combos en Las Tunas, Cuba' },
    // Open Graph
    ogTitle: { property: 'og:title', content: 'Tienda online en Las Tunas | Mercado Variado Texas' },
    ogDescription: { property: 'og:description', content: 'Variedad de productos para el hogar, confituras , cárnicos.' },
    ogImage: { property: 'og:image', content: '/images/og-home.jpg' },
    ogUrl: { property: 'og:url', content: 'https://mercado-tex.vercel.app' }
  },
  link: {
    canonical: { rel: 'canonical', href: 'https://mercado-tex.vercel.app' }
  }
})

type Category = { key: string; label: string; image: string };
const $router = useRouter();
const categories = ref<Category[]>([
  { key: 'Aseo', label: 'Aseo', image: '/images/aseo.webp' },
  { key: 'Ropa', label: 'Ropa', image: '/images/tiendaRopa.jpg' },
  { key: 'hogar', label: 'Hogar', image: '/images/productosHogar.png' },
  { key: 'Ferreteria', label: 'Ferretería', image: '/images/ferreteria.png' },
  { key: 'Cárnicos', label: 'Cárnicos', image: '/images/carnicos.webp' },
  { key: 'Confituras', label: 'Confituras', image: '/images/confituras.webp' },
  { key: 'Granos', label: 'Granos', image: '/images/granos.webp' },
  { key: 'combos', label:'Combos',image:'/images/cestaProductoBasicos.png'},
  { key: 'Bebidas' , label: 'Bebidas', image: '/images/bebidas.webp' },

]);

const showMarqueeModal = ref(false);
function goToCategory(category: string) {
  if(category!=='Ropa'){
    void $router.push(`/tienda?cat=${category}`)
  }
  else{
    void $router.push('clothStore')
  }
}
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 65vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* leave space for the marquee at the very top */
  padding-top: 5rem;
}

.hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom right, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.25)),
    url('/images/fondo.jpg') center/cover no-repeat fixed;
  filter: blur(2px);
  z-index: 0;
}

.hero-section > * {
  position: relative;
  z-index: 1;
}
.category-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
.category-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  justify-content: space-between;
}
.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}
.marquee-bar {
  position: absolute;
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
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.marquee-track {
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  font-weight: 600;
  font-size: 1.125rem;
  animation: marquee-scroll 15s linear infinite;
}
.marquee-track:hover {
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  font-weight: 600;
  font-size: 1.125rem;
}
@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; padding-left: 0; }
}

</style>
