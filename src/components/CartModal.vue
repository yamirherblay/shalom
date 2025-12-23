<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="min-width: 340px; max-width: 640px; width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Tus productos en cesta:</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator/>
      <q-card-section>
        <div v-if="!cart.items.length" class="text-grey">Tu carrito está vacío</div>
        <q-list v-else bordered separator>
          <q-item v-for="it in cart.items" :key="it.product.id">
            <q-item-section avatar>
              <q-img :src="it.product.image || '/images/placeholder.svg'" style="width:58px;height:58px"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ it.product.name }}</q-item-label>
              <q-item-label caption>{{ currency(it.product.price, cart.getCurrency(it.product.id)) }}</q-item-label>
              <div class="row items-center q-gutter-sm q-mt-xs">
                <q-btn dense round icon="remove" @click="dec(it.product.id)"/>
                <q-input dense outlined v-model.number="buffer[it.product.id]" type="number" style="width:70px" @blur="apply(it.product.id)"/>
                <q-btn dense round icon="add" @click="inc(it.product.id)"/>
              </div>
            </q-item-section>
            <q-item-section side top>
              <div class="text-weight-bold">{{ currency(it.product.price * it.quantity, cart.getCurrency(it.product.id)) }}</div>
              <q-btn flat dense icon="delete" color="negative" @click="cart.remove(it.product.id)"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section class="row items-center justify-between q-gutter-sm">
        <div>
          <div class="text-subtitle1">Totales por moneda:
            <template v-for="(amount, code) in cart.totalsByCurrency" :key="code">
              <span class="q-ml-sm">{{ code }}: {{ currency(amount as number, code as any) }}</span>
            </template>
          </div>
          <div class="text-caption q-mt-xs">
            Total CUP: {{ currency(cart.totalCUP, 'CUP') }} | Total USD: {{ currency(cart.totalUSD, 'USD') }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn color="positive" icon="fa-brands fa-whatsapp" :disable="!cart.items.length" @click="buyWhatsApp">Solicitar por WhatsApp</q-btn>
          <q-btn color="primary"
                 icon="trash"
                 :disable="!cart.items.length"
                 @click="emptyCarshop">
            Vaciar carrito.
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCartStore } from 'src/stores/cart';


const cart = useCartStore();

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>();
type CurrencyCode = 'CUP' | 'USD';
const modelValue = ref<boolean>(props.modelValue);
watch(() => props.modelValue, v => modelValue.value = v);
watch(modelValue, v => emit('update:modelValue', v));

const buffer = ref<Record<string, number>>({});
watch(() => cart.items, (items) => {
  const next: Record<string, number> = {};
  items.forEach(it => { next[it.product.id] = it.quantity; });
  buffer.value = next;
}, { deep: true, immediate: true });

function inc(id: string) { const q = (buffer.value[id] || 1) + 1; buffer.value[id] = q; cart.setQuantity(id, q); }
function dec(id: string) { const q = Math.max(1, (buffer.value[id] || 1) - 1); buffer.value[id] = q; cart.setQuantity(id, q); }
function apply(id: string) { const q = Math.max(1, buffer.value[id] || 1); cart.setQuantity(id, q); }

const WHATSAPP_NUMBER = '5354512675';
function buyWhatsApp() {
  if (!cart.items.length) return;
  const lines: string[] = [];
  lines.push(`Hola, me interesa comprar en MercadoTexas los siguientes productos: `);
  cart.items.forEach((it, idx) => {
    const code = cart.getCurrency(it.product.id);
    lines.push(`${idx + 1}. ${it.product.name} x${it.quantity} — ${currency(it.product.price, code)} c/u = ${currency(it.product.price * it.quantity, code)}`);
  });
  lines.push('');
  lines.push('Totales por moneda:');
  (Object.entries(cart.totalsByCurrency) as Array<[CurrencyCode,number]>).forEach(([code, amount]) => {
    lines.push(`- ${code}: ${currency(amount, code )}`);
  });
  lines.push(`Total CUP: ${currency(cart.totalCUP, 'CUP')} | Total USD: ${currency(cart.totalUSD, 'USD')}`);
  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  window.open(url, '_blank');

}
function emptyCarshop(){
  cart.clear();
}

function currency(n: number, code: 'CUP' | 'USD' = 'CUP') {
  const locale = code === 'USD' ? 'en-US' : 'es-CU';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: code }).format(n);
}
</script>
