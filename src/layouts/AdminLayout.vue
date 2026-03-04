<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="left = !left" />
        <q-toolbar-title>Admin</q-toolbar-title>
        <q-btn
          flat
          dense
          round
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleTheme"
        />
        <AdminChangeNotifications />
        <q-btn flat dense round>
          <q-icon name="person" />
          <q-menu>
            <q-item>
              <q-item-section class="text-caption">{{ auth.user?.email }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>Cerrar sesión</q-item-section>
            </q-item>
          </q-menu>
        </q-btn>
        <q-btn flat dense round icon="store" @click="$router.push({ name: 'home' })" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple @click="$router.push({ name: 'admin' })">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Productos</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push({ name: 'tienda' })">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Tienda</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push({ name: 'clothStore' })">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Sabrina Fashion</q-item-section>
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
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import AdminChangeNotifications from 'layouts/AdminChangeNotifications.vue';
import { useAuthStore } from 'src/stores/auth';

const left = ref(false);
const router = useRouter();
const auth = useAuthStore();
const $q = useQuasar();

function toggleTheme() {
  $q.dark.toggle();
}

async function logout() {
  await auth.logout();
  void router.push({ name: 'home' });
}
</script>
