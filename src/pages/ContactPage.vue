<template>
  <q-page padding>
    <div class="text-h4 text-center q-mb-lg">{{ branding.name }}</div>

    <div class="row q-col-gutter-lg justify-center">
      <q-card class="col-12 col-md-6" flat bordered>
        <q-card-section>
          <div class="text-h6 q-mb-md">Contáctanos</div>

          <q-list>
            <q-item v-if="branding.contact.email">
              <q-item-section avatar>
                <q-icon name="email" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Email</q-item-label>
                <q-item-label caption>{{ branding.contact.email }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="branding.contact.phone">
              <q-item-section avatar>
                <q-icon name="phone" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Teléfono</q-item-label>
                <q-item-label caption>{{ branding.contact.phone }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="branding.contact.address">
              <q-item-section avatar>
                <q-icon name="location_on" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dirección</q-item-label>
                <q-item-label caption>{{ branding.contact.address }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-btn
            color="positive"
            icon="fa-brands fa-whatsapp"
            label="Escribir por WhatsApp"
            class="q-mt-lg full-width"
            unelevated
            size="lg"
            @click="sendContactMessage"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { branding } from 'src/config/branding';
import { useWhatsApp } from 'src/composables/useWhatsApp';
import { useMeta } from 'quasar';

useMeta({
  title: `Contacto | ${branding.name}`,
  meta: {
    description: { name: 'description', content: `Contacto con ${branding.name}` },
  },
});

const { sendContactMessage } = useWhatsApp();
</script>
