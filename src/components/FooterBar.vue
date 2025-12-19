<template>
  <q-footer :class="isClothStore ? 'custom-footer text-white' : 'bg-secondary text-accent'" bordered>
    <q-toolbar class="q-py-sm q-px-md">
      <div class="row items-center justify-between full-width q-col-gutter-md">
        <!-- Brand / Logo -->
        <div class="row items-center q-gutter-sm">
          <q-img src="/images/logo.png" alt="Mercado Variado Texas" width="28px" height="28px" ratio="1"  />
          <div class="text-subtitle2 text-weight-medium text-accent">{{ brand }}</div>
        </div>

        <!-- Contact / Social -->
        <div class="row items-center q-gutter-xs">
          <q-btn flat round dense icon="home" to="/" :aria-label="'Ir a inicio'"></q-btn>
          <q-btn v-if="phone" flat round dense icon="call" :href="`tel:${phone}`" :aria-label="`Llamar al ${phone}`" />
          <q-btn v-if="email" flat round dense icon="email" :href="`mailto:${email}`" aria-label="Enviar correo" />
          <q-btn v-if="whatsapp" flat round dense icon="fa-brands fa-whatsapp" :href="`https://wa.me/${whatsapp}`" target="_blank" aria-label="WhatsApp" />
        </div>
      </div>
    </q-toolbar>

    <q-separator />

    <div class="q-px-md q-py-sm text-caption text-center text-white">
      © {{ year }} {{ brand }} — Todos los derechos reservados.
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface Props {
  brand?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
}

const props = withDefaults(defineProps<Props>(), {
  brand: 'Mercado Texas',
  phone: '+53 54512675',
  email: 'mercadotexas@gmail.com',
  whatsapp: '+5354512675'
});

const year = computed(() => new Date().getFullYear());

// expose props for template (script setup auto-exposes)
const { brand, phone, email, whatsapp } = props;

const route = useRoute();
const isClothStore = computed(() => route.name === 'clothStore' || route.path === '/clothStore');
</script>

<style scoped>
.custom-footer {
  background: rgba(176, 146, 243, 0.83);
}
</style>
