<template>
  <q-layout view="lHh Lpr lff">
    <q-header class="bg-primary" elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="lt-md"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <q-btn flat no-caps :to="'/'">
            {{ branding.name }}
          </q-btn>
        </q-toolbar-title>

        <div class="gt-sm row items-center q-gutter-x-sm">
          <q-btn flat dense label="Inicio" to="/" />
          <q-btn flat dense label="Catálogo" to="/catalogo" />
          <q-btn flat dense label="Contacto" to="/contacto" />
          <q-btn flat dense label="Acerca" to="/acerca" />
        </div>

        <q-btn flat round dense icon="shopping_cart" class="q-ml-sm" @click="showCart = true">
          <q-badge color="red" text-color="white" floating v-if="cart.count">
            {{ cart.count }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered class="lt-md">
      <q-list padding>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/catalogo">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Catálogo</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/contacto">
          <q-item-section avatar><q-icon name="contact_support" /></q-item-section>
          <q-item-section>Contacto</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/acerca">
          <q-item-section avatar><q-icon name="info" /></q-item-section>
          <q-item-section>Acerca de</q-item-section>
        </q-item>
        <q-separator class="q-my-md" />
        <q-item>
          <q-item-section class="text-center">
            <q-img :src="branding.logo" :alt="branding.name" style="max-width: 120px" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <cart-modal v-model="showCart" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from 'src/stores/cart';
import { branding } from 'src/config/branding';

const leftDrawerOpen = ref(false);
const showCart = ref(false);
const cart = useCartStore();
</script>
