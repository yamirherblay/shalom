<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="error-icon q-mb-md">🕊️</div>
      <div class="error-code">404</div>

      <div class="error-message">Esta página encontró la paz...<br>pero no existe.</div>

      <q-btn
        class="q-mt-xl"
        color="accent"
        text-color="dark"
        unelevated
        to="/"
        label="Volver a Shalom"
        no-caps
        size="lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMeta } from 'quasar';

useMeta({
  title: '404 | Shalom',
  meta: {
    robots: { name: 'robots', content: 'noindex, nofollow' },
  },
});
</script>

<style scoped>
.error-icon {
  font-size: 4rem;
}

.error-code {
  font-family: 'DM Serif Display', serif;
  font-size: 5rem;
  letter-spacing: 6px;
  line-height: 1;
}

.error-message {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  opacity: 0.7;
  line-height: 1.5;
}
</style>
