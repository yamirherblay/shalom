<template>
  <q-card class="location-card">
    <q-card-section>
      <div class="text-caption text-grey-7 q-mb-xs">Mapa</div>
      <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d695.5272216185784!2d-76.95943339150169!3d20.959273113185922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDU3JzMzLjAiTiA3NsKwNTcnMzAuNiJX!5e0!3m2!1ses!2sus!4v1765985331427!5m2!1ses!2sus" max-width="300" height="250" style="border:0;" allowfullscreen="true" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </q-card-section>
    <q-card-section class="row items-center q-gutter-md">
      <q-icon name="place" color="primary" size="md" />
      <div>
        <div class="text-subtitle1 text-weight-medium">{{ title }}</div>
        <div class="text-body2">{{ address }}</div>
        <div v-if="city" class="text-body2">{{ city }}</div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-none">
      <div class="text-caption text-grey-7 q-mb-xs">Horario</div>
      <div class="text-body2">{{ props.hours }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="text-caption text-grey-7 q-mb-xs">Contacto</div>
      <div class="row items-center q-gutter-sm">
        <q-icon name="call" size="xs" />
        <span class="text-body2">{{ props.phone }}</span>
      </div>
      <div class="row items-center q-gutter-sm q-mt-xs" v-if="props.email">
        <q-icon name="email" size="xs" />
        <span class="text-body2">{{ props.email }}</span>
      </div>
    </q-card-section>

    <q-separator />


  </q-card>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  address: string;
  city?: string;
  phone: string;
  email?: string;
  hours: string;
  mapImage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mapImage: '/images/Mapa.png'
});

</script>

<style scoped>
.location-card {
  max-width: 900px;
  margin: 0 auto;
}
.map {
  border-radius: 6px;
  overflow: hidden;
}
</style>
