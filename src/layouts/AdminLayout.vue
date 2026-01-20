<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="left = !left" />
        <q-toolbar-title>Admin</q-toolbar-title>
        <AdminChangeNotifications />
        <q-btn flat dense round icon="store" @click="$router.push({ name: 'home' })" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple @click="$router.push({ name: 'admin' })">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Productos</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push({ name: 'admin-clothes' })">
          <q-item-section avatar><q-icon name="checkroom" /></q-item-section>
          <q-item-section>Ropa</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push({ name: 'tienda' })">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Mercado</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push({ name: 'admin-mayorista' })">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Mayorista</q-item-section>
        </q-item>
        <q-item class="text-center justify-center">
          <q-item-section>
            <q-img src="/images/logo.png" alt="MercadoTexas" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminChangeNotifications from 'layouts/AdminChangeNotifications.vue';

const left = ref(false);
</script>
