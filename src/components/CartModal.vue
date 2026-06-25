<template>
  <q-dialog
    v-model="innerVal"
    :position="$q.screen.lt.md ? 'bottom' : 'standard'"
    :full-width="$q.screen.lt.md"
    :maximized="$q.screen.lt.md"
    :persistent="$q.screen.lt.md"
  >
    <q-card :style="$q.screen.lt.md ? '' : 'min-width: 400px; max-width: 640px; width: 100%'">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Tu carrito</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator class="bg-grey-3" />

      <q-card-section>
        <div v-if="!cart.items.length" class="text-grey-6 text-center q-py-lg">
          Tu carrito está vacío.
          <br>
          <q-btn flat color="secondary" label="Ver catálogo" to="/catalogo" class="q-mt-sm" @click="close" />
        </div>
        <q-list v-else separator>
          <q-item v-for="it in cart.items" :key="it.product.id">
            <q-item-section avatar>
              <q-img
                :src="it.product.image || '/images/placeholder.svg'"
                style="width: 58px; height: 58px; border-radius: 4px;"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ it.product.name }}</q-item-label>
              <q-item-label caption class="text-grey-7">
                <template v-if="it.product.oferta">
                  {{ formatPrice(it.product.descuento) }}
                  <span class="offer-tag">(Oferta)</span>
                </template>
                <template v-else>
                  {{ formatPrice(it.product.price) }}
                </template>
              </q-item-label>
              <div class="row items-center q-gutter-sm q-mt-xs">
                <q-btn dense round outline size="sm" icon="remove" @click="dec(it.product.id)" />
                <span class="text-weight-bold q-px-sm">{{ it.quantity }}</span>
                <q-btn dense round outline size="sm" icon="add" @click="inc(it.product.id)" />
              </div>
            </q-item-section>
            <q-item-section side top>
              <div class="text-weight-bold text-h6">
                {{ formatPrice(effectivePrice(it.product) * it.quantity) }}
              </div>
              <q-btn
                flat
                dense
                icon="delete"
                color="negative"
                size="sm"
                @click="removeItemFromCart(it.product.id, it.product.name)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator class="bg-grey-3" />

      <q-card-section v-if="cart.items.length" class="row items-center justify-between q-gutter-sm">
        <div class="text-subtitle1 text-weight-bold">
          Total: {{ formatPrice(cart.total) }}
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            color="positive"
            icon="fa-brands fa-whatsapp"
            :disable="!cart.items.length"
            @click="buyWhatsApp"
            no-caps
          >
            Pedir por WhatsApp
          </q-btn>
          <q-btn
            color="dark"
            outline
            icon="delete_sweep"
            :disable="!cart.items.length"
            @click="emptyCart"
            no-caps
          >
            Vaciar
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCartStore } from 'src/stores/cart';
import { useQuasar } from 'quasar';
import { whatsappConfig } from 'src/config/whatsapp';
import type { Product } from 'src/stores/types';

const cart = useCartStore();
const $q = useQuasar();

function effectivePrice(p: Product): number {
  return p.oferta && p.descuento ? p.descuento : p.price;
}

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>();

const innerVal = ref<boolean>(props.modelValue);
watch(() => props.modelValue, (v) => (innerVal.value = v));
watch(innerVal, (v) => emit('update:modelValue', v));

function inc(id: string) {
  const it = cart.items.find((i) => i.product.id === id);
  if (it) cart.setQuantity(id, it.quantity + 1);
}

function dec(id: string) {
  const it = cart.items.find((i) => i.product.id === id);
  if (it && it.quantity > 1) cart.setQuantity(id, it.quantity - 1);
}

function removeItemFromCart(id: string, name: string = '') {
  cart.remove(id);
  $q.notify({
    type: 'warning',
    message: `Eliminado: ${name}`,
    timeout: 2000,
    position: 'top',
  });
}

function buyWhatsApp() {
  if (!cart.items.length) return;
  const lines: string[] = [];
  lines.push(`Hola, quiero hacer el siguiente pedido:`);
  cart.items.forEach((it, idx) => {
    const label = it.product.oferta ? `${formatPrice(effectivePrice(it.product) * it.quantity)} (Oferta)` : formatPrice(effectivePrice(it.product) * it.quantity);
    lines.push(
      `${idx + 1}. ${it.product.name} x${it.quantity} — ${label}`,
    );
  });
  lines.push('');
  lines.push(`Total: ${formatPrice(cart.total)}`);
  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${whatsappConfig.number}?text=${text}`;
  window.open(url, '_blank');
}

function emptyCart() {
  cart.clear();
}

function close() {
  innerVal.value = false;
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
    maximumFractionDigits: 0,
  }).format(n);
}
</script>

<style scoped>
.offer-tag {
  font-size: 0.65rem;
  font-weight: 600;
  color: #E85D04;
  margin-left: 3px;
  text-transform: uppercase;
}
</style>
