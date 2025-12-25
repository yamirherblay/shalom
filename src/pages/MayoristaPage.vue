<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md text-center">
      <div class="text-h5 text-weight-bold text-primary">Ofertas Mayoristas</div>
      <div class="text-subtitle2 text-grey-8">
        Productos para compras al por mayor — coordinar por WhatsApp
      </div>
    </div>

    <section>
      <div class="row q-col-gutter-md">
        <div
          v-for="product in mayoristaProducts"
          :key="product.id"
          class="col-6 col-sm-4 col-md-3 col-lg-2"
        >
          <q-card flat bordered class="product-card column full-height">
            <q-img :src="product.image" :ratio="1" spinner-color="primary" class="product-image">
              <div
                class="absolute-top-right q-pa-sm"
                v-if="product.oferta && product.estado !== 'Agotado'"
              >
                <q-badge color="red" text-color="white" label="En Oferta" />
              </div>
              <div
                class="absolute-top-left q-pa-sm"
                v-if="product.category === 'combos' || product.category === 'Zelle'"
              >
                <q-badge color="primary" text-color="white" label="Pagar via Zelle" />
              </div>
            </q-img>
            <q-card-section class="q-pb-none">
              <q-badge
                :label="product.estado"
                dense
                class="q-px-md q-py-xs fa-text-height"
                :color="product.estado === 'Disponible' ? 'blue' : 'red'"
                :text-color="product.estado === 'Disponible' ? 'white' : 'grey'"
              />
            </q-card-section>
            <q-card-section class="q-pb-none">
              <div class="text-subtitle2 ellipsis-2-lines" :title="product.name">
                {{ product.name }}
              </div>
              <div class="text-primary text-weight-bold" v-if="product.estado !== 'Agotado'">
                {{ formatProductPrice(product) }}
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="between" class="q-pa-sm">
              <div class="row q-gutter-xs" v-if="product.estado == 'Disponible'">
                <q-btn
                  color="positive"
                  unelevated
                  size="sm"
                  icon="fa-brands fa-whatsapp"
                  label="Solicitar"
                  aria-label="Solicitar por WhatsApp"
                  title="Solicitar por WhatsApp"
                  @click="requestB2B(product)"
                />
                <q-btn
                  v-if="product.category === 'combos' && product.descripcion"
                  color="secondary"
                  outline
                  size="sm"
                  icon="visibility"
                  label="Ver"
                  @click="openCombo(product)"
                />
                <!-- Nota: Sin botón de añadir al carrito en página mayorista -->
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <div v-if="mayoristaProducts.length === 0" class="q-mt-xl text-grey text-center">
        No hay productos mayoristas disponibles en este momento.
      </div>
    </section>

    <!-- Modal para descripción de combo (reutilizable) -->
    <q-dialog v-model="showComboDialog">
      <q-card style="max-width: 640px; width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedCombo?.name || 'Combo' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-if="selectedCombo">
            <q-img :src="selectedCombo.image" ratio="1" class="q-mb-md" />
            <ul v-if="selectedCombo?.descripcion" class="q-pl-md q-my-sm">
              <li v-for="(item, i) in splitDescripcion(selectedCombo.descripcion || '')" :key="i">
                {{ item }}
              </li>
            </ul>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useMeta } from 'quasar';

type Product = {
  id: string;
  name: string;
  price: number;
  oferta: boolean;
  image: string;
  category: string;
  currency?: string;
  subcategory?: string | null;
  estado: string;
  descripcion?: string | null;
};

useMeta({
  title: 'Ofertas Mayoristas | Mercado Texas',
  meta: {
    description: {
      name: 'description',
      content: 'Consulta productos con ofertas mayoristas y coordina compras B2B por WhatsApp.',
    },
    ogTitle: { property: 'og:title', content: 'Ofertas Mayoristas | Mercado Texas' },
    ogDescription: {
      property: 'og:description',
      content: 'Lista de productos con opción de compra mayorista (B2B).',
    },
    ogImage: { property: 'og:image', content: '/images/og-home.jpg' },
  },
});

const products = ref<Product[]>([]);

onMounted(async () => {
  try {
    const res = await fetch('/data/mayorista.json');
    products.value = await res.json();
  } catch (e) {
    console.error('Error cargando productos.json', e);
  }
});

const mayoristaProducts = computed(() =>
  products.value.filter((p) => (p.subcategory || '').toLowerCase() === 'mayorista'),
);

function formatAmount(value: number, currency: 'CUP' | 'USD') {
  const formatted = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-ES', {
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(value);
  return `${formatted} ${currency}`;
}

function getProductCurrency(product: Product): 'CUP' | 'USD' {
  const isUsd =
    product.category === 'combos' ||
    product.category === 'Zelle' ||
    (product.subcategory || '') === 'Zelle';
  return isUsd ? 'USD' : 'CUP';
}

function formatProductPrice(product: Product) {
  const currency = getProductCurrency(product);
  return formatAmount(product.price, currency);
}

const WHATSAPP_NUMBER = '5354512675';
function requestB2B(product: Product) {
  const lines: string[] = [];
  lines.push('Hola, me interesa una compra mayorista (B2B) con MercadoTexas:');
  lines.push(`- Producto: ${product.name} — ${formatProductPrice(product)}`);
  lines.push('¿Podemos coordinar cantidades, precios por volumen y entrega?');
  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, '_blank');
}

// Combo description modal helpers (reutilizados)
const showComboDialog = ref(false);
const selectedCombo = ref<Product | null>(null);

function openCombo(product: Product) {
  if ((product.category === 'combos' || product.category === 'Zelle') && product.descripcion) {
    selectedCombo.value = product;
    showComboDialog.value = true;
  }
}
function splitDescripcion(desc: string): string[] {
  return desc
    .split(/\.|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
</script>

<style scoped>
.product-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.product-image {
  background-color: #fafafa;
}
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
