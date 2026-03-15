<template>
  <q-card style="max-width: 520px; width: 92vw">
    <q-card-section class="row items-center q-pb-none bg-primary">
      <div class="text-h6 text-weight-bold text-white">Eventos especiales</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup aria-label="Cerrar" />
    </q-card-section>
    <q-card-section>
      <h4 class="q-mt-none q-mb-sm">¡COMPRA Y GANA LO QUE COMPRAS!</h4>
      <h5 class="q-mt-none q-mb-sm">Desde el jueves 25 de diciembre 8:30 AM.</h5>
      <div class="text text-black">
        <p>
          Para celebrar el lanzamiento de nuestra página web, llega una promo que te va a encantar:
        </p>
        <ul class="list-unstyled">
          <li>
            Toda persona que realice su compra a través de nuestra página web quedará
            automáticamente seleccionada para participar.
          </li>
          <li>Al momento de comprar, deberá elegir un único número.</li>
          <li>
            El valor total de la compra realizada durante la semana será devuelto al ganador o
            ganadora.
          </li>
          <li>Solo las compras hechas por nuestra página web participan en la promoción.</li>
        </ul>
        <b>El ganador o ganadora será anunciado el Jueves 1ro de enero.</b>
        <h5 class="text-center">
          Así de fácil: compras, participas y puedes recuperar todo lo que compraste.
        </h5>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn color="primary" label="Entendido" v-close-popup />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
defineOptions({
  name: 'EventSpecial',
});
</script>
<style scoped>
.hero-section > * {
  position: relative;
  z-index: 1;
}
</style>
