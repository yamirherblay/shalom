<template>
  <q-page padding>
    <div class="text-h4 text-center q-mb-lg">{{ branding.about.title }}</div>

    <div class="row justify-center">
      <q-card class="col-12 col-md-8" flat bordered>
        <q-card-section>
          <div class="text-body1">{{ branding.about.content }}</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row justify-center q-mt-lg">
      <q-card class="col-12 col-md-8" flat bordered>
        <q-card-section>
          <div class="text-h6 q-mb-sm">Nuestra Misión</div>
          <div class="text-body1">
            Ofrecer productos de calidad a precios accesibles, brindando un excelente servicio al
            cliente.
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { branding } from 'src/config/branding';
import { useMeta } from 'quasar';

useMeta({
  title: `Acerca de | ${branding.name}`,
  meta: {
    description: { name: 'description', content: branding.about.content },
  },
});
</script>
