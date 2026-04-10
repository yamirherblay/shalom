<template>
  <q-page class="row justify-center items-center q-pa-md" style="min-height: 70vh">
    <q-card flat bordered class="q-pa-lg" style="max-width: 420px; width: 100%">
      <q-img src="/images/logo.png" alt="MercadoTexas" />
      <q-card-section class="text-center">
        <div class="text-h6 q-mb-xs">Acceso de Administrador</div>
        <div class="text-caption text-grey-7">Ingrese sus credenciales para continuar</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="onSubmit" greedy>
          <q-input
            v-model="email"
            label="Email"
            type="email"
            dense
            outlined
            autocomplete="email"
            class="q-mb-md"
            :error="error && !email"
          />
          <q-input
            v-model="password"
            :type="showPass ? 'text' : 'password'"
            label="Contraseña"
            dense
            outlined
            autocomplete="current-password"
            :error="error && !password"
          >
            <template #append>
              <q-icon
                :name="showPass ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPass = !showPass"
              />
            </template>
          </q-input>
          <q-checkbox v-model="rememberMe" label="Recordarme" dense class="q-mb-sm" />
          <div v-if="errorMessage" class="text-negative text-caption q-mt-sm">
            {{ errorMessage }}
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Cancelar" color="grey-7" no-caps @click="goHome" />
            <q-btn color="primary" label="Entrar" type="submit" no-caps :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const email = ref('');
const password = ref('');
const showPass = ref(false);
const error = ref(false);
const errorMessage = ref('');
const loading = ref(false);
const rememberMe = ref(false);

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

function goHome() {
  void router.push({ name: 'home' });
}

async function onSubmit() {
  error.value = false;
  errorMessage.value = '';
  loading.value = true;

  const result = await auth.login(email.value.trim(), password.value);

  loading.value = false;

  if (result.success) {
    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect
        ? route.query.redirect
        : '/mvtexas/admin';
    void router.replace(redirect);
  } else {
    error.value = true;
    errorMessage.value = result.error || 'Credenciales incorrectas';
  }
}
</script>

<style scoped></style>
