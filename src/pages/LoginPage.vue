<template>
  <q-page class="row justify-center items-center q-pa-md" style="min-height: 70vh;">
    <q-card flat bordered class="q-pa-lg" style="max-width: 420px; width: 100%;">
      <q-card-section class="text-center">
        <div class="text-h6 q-mb-xs">Acceso de Administrador</div>
        <div class="text-caption text-grey-7">Ingrese sus credenciales para continuar</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="onSubmit" greedy>
          <q-input v-model="username" label="Usuario" dense outlined autocomplete="username" class="q-mb-md"
                   :error="error && !username"/>
          <q-input v-model="password" :type="showPass ? 'text' : 'password'" label="Contraseña" dense outlined autocomplete="current-password"
                   :error="error && !password">
            <template #append>
              <q-icon :name="showPass ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPass=!showPass" />
            </template>
          </q-input>
          <div v-if="error" class="text-negative text-caption q-mt-sm">Usuario o contraseña incorrectos</div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Cancelar" color="grey-7" no-caps @click="goHome" />
            <q-btn color="primary" label="Entrar" type="submit" no-caps />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const username = ref('')
const password = ref('')
const showPass = ref(false)
const error = ref(false)

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

function goHome(){
  void router.push({ name: 'home' })
}

function onSubmit(){
  error.value = false
  const ok = auth.login(username.value.trim(), password.value)
  if (ok) {
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect ? route.query.redirect : '/admin'
    void router.replace(redirect)
  } else {
    error.value = true
  }
}
</script>

<style scoped>
</style>
