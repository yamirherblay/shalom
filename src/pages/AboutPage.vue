<template>
  <q-page padding class="q-gutter-lg">
    <div class="column items-center q-gutter-xs text-center">
      <q-icon name="info" color="primary" size="64px" />
      <div class="text-h5 text-weight-bold">Quiénes somos</div>
      <div class="text-subtitle2 text-grey-7">Conoce más sobre nuestro mercado y nuestra pasión por servirte</div>
    </div>

    <image-carousel :slides="slides" />
    <info-section title="Nuestra historia">
      <p>
        En Mercado Texas creemos en la cercanía, la calidad y el precio justo. Nacimos como un pequeño
        emprendimiento familiar y hoy seguimos trabajando con el mismo espíritu: ofrecer productos que
        mejoran tu día a día, con una atención amable y personalizada.
      </p>
      <p class="q-mt-sm">
        Nos encanta conectar con nuestra comunidad y complacer a los vecinos. Cada visita es una
        oportunidad para sorprenderte con algo nuevo.
      </p>
    </info-section>

    <info-section title="Dónde estamos">
      <location-card
        title="Mercado Variado Texas"
        address="Calle 24 de febrero No.190 , entre Calle Cucalambé y Calle Martí"
        city="Las Tunas, Cuba"
        phone="+53 54512675"
        email="mercadotexas@gmail.com"
        hours="Lun a Sáb: 8:00 - 19:00 · Dom: 10:00 - 16:00"
        :map-image="'/images/Mapa.png'"
      />
    </info-section>

    <div class="row q-gutter-sm justify-center">
      <q-btn color="primary" icon="store" label="Ir al mercado" to="/tienda"/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ImageCarousel, { type CarouselSlide } from 'src/components/ImageCarousel.vue';
import InfoSection from 'src/components/InfoSection.vue';
import LocationCard from 'src/components/LocationCard.vue';

const slides: CarouselSlide[] = [
  { src: '/images/About/frente.webp', alt: 'Vista Frontal del Negocio', caption: 'Frente del negocio' },
  { src: '/images/About/mercado1.webp', alt: 'Mostrador de atención', caption: 'Atención amable y cercana' },
  { src: '/images/About/mercado2.webp', alt: 'Estantes organizados', caption: 'Variedad y orden para elegir mejor' },
  { src: '/images/About/sabrina1.webp',alt:'Sabrinas Fashion' , caption: 'Variedad de ropa y calzado' },
  { src: '/images/About/sabrina2.webp',alt:'Sabrinas Fashion' , caption: 'Variedad de ropa y calzado' },
  { src: '/images/About/sabrina3.webp',alt:'Sabrinas Fashion' , caption: 'Variedad de ropa y calzado' },

];
</script>

<style scoped>
</style>
