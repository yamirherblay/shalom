<template>
  <q-page class="column">
    <section class="hero-section">
      <div class="column items-center text-center q-pa-xl">
        <div class="text-h3 text-weight-bold q-mb-sm">{{ branding.hero.title }}</div>
        <div class="text-subtitle1 q-mb-lg">{{ branding.hero.subtitle }}</div>
        <div class="row justify-center q-gutter-sm">
          <q-btn
            color="primary"
            size="lg"
            :label="branding.hero.ctaText"
            :to="branding.hero.ctaLink"
            unelevated
            rounded
          />
          <q-btn
            v-if="branding.hero.secondaryCtaText"
            color="secondary"
            size="lg"
            :label="branding.hero.secondaryCtaText"
            :to="branding.hero.secondaryCtaLink"
            unelevated
            rounded
          />
        </div>
      </div>
    </section>

    <section class="q-pa-lg">
      <div class="text-h5 text-center q-mb-md">{{ branding.slogan }}</div>
      <div class="row q-col-gutter-md items-center justify-center">
        <q-card
          v-for="cat in defaultCategories"
          :key="cat.key"
          flat
          class="category-card cursor-pointer"
        >
          <q-card-section class="column items-center text-center">
            <q-avatar size="80px" v-if="cat.image">
              <img :src="cat.image" :alt="cat.label" />
            </q-avatar>
            <div class="q-mt-sm">
              <q-btn
                color="primary"
                size="sm"
                :label="cat.label"
                unelevated
                rounded
                :to="`/catalogo?cat=${cat.key}`"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { branding } from 'src/config/branding';
import { defaultCategories } from 'src/config/categories';
import { useMeta } from 'quasar';

useMeta({
  title: `${branding.name} | Inicio`,
  meta: {
    description: { name: 'description', content: branding.slogan },
    ogTitle: { property: 'og:title', content: branding.name },
    ogDescription: { property: 'og:description', content: branding.slogan },
  },
});
</script>

<style scoped>
.hero-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.category-card {
  transition: transform 0.2s ease;
}

.category-card:hover {
  transform: translateY(-4px);
}
</style>
