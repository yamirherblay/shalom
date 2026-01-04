<template>
  <q-page class="q-pa-md tienda-page">
    <div>
      <q-select
        v-model="selectedCategory"
        :options="categories"
        option-value="key"
        option-label="label"
        emit-value
        map-options
        label="Filtre por Categoría"
        dense
        filled
        @update:model-value="selectCategory"
      />

    </div>
    <!-- Categorías: barra horizontal con scroll fino y atractivo -->
    <section class="q-mb-md sticky-cats">
      <q-scroll-area class="cat-scroll rounded-borders" :horizontal="true" :thumb-style="thumbStyle" :bar-style="barStyle">
        <div class="row no-wrap q-gutter-sm items-center">
          <q-chip
            clickable
            color="green"
            text-color="white"
            class="q-px-md q-py-xs text-weight-medium"
            icon="sell"
            label="Mayoristas"
            @click="goMayoristas"
          />
          <q-chip
            v-for="cat in categories"
            :key="cat.key"
            clickable
            :color="selectedCategory === cat.key ? 'primary' : 'grey-3'"
            :text-color="selectedCategory === cat.key ? 'white' : 'dark'"
            class="q-px-md q-py-xs text-weight-medium"
            @click="selectCategory(cat.key)"
          >
            <q-avatar v-if="cat.image" size="24px">
              <img :src="cat.image" :alt="cat.label" />
            </q-avatar>
            <span class="q-ml-xs">{{ cat.label }}</span>
          </q-chip>
        </div>
      </q-scroll-area>
    </section>

    <!-- Grid de productos -->
    <section>
      <div class="row q-col-gutter-md">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="col-6 col-sm-4 col-md-3 col-lg-2"
        >
          <q-card
                  flat
                  bordered
                  class="product-card column full-height">
            <q-img :src="product.image" :ratio="1" spinner-color="primary" class="product-image">
            <div class="absolute-top-right q-pa-sm" v-if="product.oferta && (product.estado!=='Agotado')">
              <q-badge color="red" text-color="white" label="En Oferta" />
            </div>
              <div class="absolute-top-left q-pa-sm" v-if="product.new">
                <q-badge color="red" text-color="white" label="NUEVO" />
              </div>
              <div class="absolute-top-left q-pa-sm" v-if="product.category ==='combos' || product.category ==='Zelle'">
                <q-badge color="primary" text-color="white" label="Pagar via Zelle" />
              </div>
            </q-img>
            <q-card-section class="q-pb-none">
              <q-badge
                :label="product.estado"
                dense
                class="q-px-md q-py-xs fa-text-height"
                :color="product.estado ==='Disponible'? 'blue' : 'red'"
                :text-color="product.estado ==='Disponible' ? 'white' : 'grey'"
              />
            </q-card-section>
            <q-card-section class="q-pb-none">
              <div class="text-subtitle2 ellipsis-2-lines" :title="product.name">{{ product.name }}</div>
              <div class="text-primary text-weight-bold" v-if="product.estado !== 'Agotado'" >{{ formatProductPrice(product) }}</div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="between" class="q-pa-sm">
              <div class="row q-gutter-xs" v-if="product.estado == 'Disponible'">
                <q-btn color="positive" unelevated size="sm" icon="fa-brands fa-whatsapp" aria-label="Comprar por WhatsApp" title="Comprar por WhatsApp" alt="Comprar por WhatsApp" @click="buyWhatsAppProduct(product)" />
                <q-btn v-if="product.category === 'combos' && product.descripcion" color="secondary" outline size="sm" icon="visibility" label="Ver" @click="openCombo(product)" />
                <q-btn color="primary" class="justify-end" unelevated size="sm" icon="shopping_cart" label="Añadir" @click="addToCart(product)" />
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="q-mt-xl text-grey text-center">
        No hay productos para esta categoría.
      </div>
    </section>

    <!-- Modal para descripción de combo -->
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
          <q-btn v-if="selectedCombo" color="primary" unelevated label="Añadir al carrito" @click="addSelectedComboToCart()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from 'src/stores/cart'
import type { Product as StoreProduct } from 'src/stores/types'
import { useMeta } from 'quasar';

type Category = { key: string; label: string; image?: string }

type Product = {
  id: string
  name: string
  price: number
  oferta: boolean
  image: string
  category: string
  currency: string
  new: boolean
  subcategory: string | null
  estado:string
  descripcion: string | null
}

useMeta({
  title: 'Tienda online en Las Tunas | Mercado Variado Texas',
  meta: {
    description: { name: 'description', content: 'Compra cárnicos, confituras y productos del hogar, Ropa, Calzado, Combos en Las Tunas, Cuba. Entrega local rápida.' },
    keywords: { name: 'keywords', content: 'tienda online Las Tunas, cárnicos Las Tunas, confituras en Las Tunas, productos del hogar en Las Tunas, combos en Las Tunas, Cuba, Ropa, Calzado' },
    // Open Graph
    ogTitle: { property: 'og:title', content: 'Tienda online en Las Tunas | Mercado Variado Texas' },
    ogDescription: { property: 'og:description', content: 'Variedad de productos para el hogar, confituras , cárnicos.' },
    ogImage: { property: 'og:image', content: '/images/og-home.jpg' },
    ogUrl: { property: 'og:url', content: 'https://mercado-tex.vercel.app' }
  },
  link: {
    canonical: { rel: 'canonical', href: 'https://mercado-tex.vercel.app' }
  }
})
const categories = ref<Category[]>([
  { key: 'all', label: 'Todas' },
  { key: 'Nuevo', label: 'Nuevo', image: '/images/new.jpg' },
  { key: 'hogar', label: 'Hogar', image: '/images/productosHogar.png' },
  { key: 'Ferreteria', label: 'Ferretería', image: '/images/ferreteria.png' },
  { key: 'Cárnicos', label: 'Cárnicos', image: '/images/carnicos.webp' },
  { key: 'Granos', label: 'Granos', image: '/images/granos.webp' },
  { key: 'Confituras', label: 'Confituras', image: '/images/confituras.webp' },
  { key: 'combos', label:'Combos',image:'/images/cestaProductoBasicos.png'},
  { key:'Bebidas', label:'Bebidas', image:'/images/bebidas.webp' },
  { key: 'Agropecuarios', label: 'Del Agro', image:'/images/Productos-agricolas.jpg' },
  { key:'Aseo' , label:'Aseo',image:'/images/aseo.webp' },
  { key:'Sazon', label:'Sazon',image:'/images/sazon.webp' },
  {key: 'Enlatados', label:'Enlatados',image:'/images/enlatados.jpg' },
])

const products = ref<Product[]>([])

const route = useRoute()

const selectedCategory = ref<string>('all')

const categoryKeys = computed(() => categories.value.map(c => c.key))

function applyRouteCategory() {
  const q = (route.query.cat as string | undefined) || 'all'
  selectedCategory.value = (q === 'all' || categoryKeys.value.includes(q)) ? q : 'all'
}

onMounted(async () => {
  applyRouteCategory()
  try {
    const res = await fetch('/data/products.json')
    const data: Product[] = await res.json()
    products.value = data
    data.forEach(p => (qty[p.id] = 1))
  } catch (e) {
    console.error('Error cargando productos.json', e)
  }
})
watch(() => route.query.cat, applyRouteCategory)
const qty = reactive<Record<string, number>>({})

// Estado para modal de combos
const showComboDialog = ref(false)
const selectedCombo = ref<Product | null>(null)

function openCombo(product: Product) {
  if ((product.category === 'combos' || product.category === 'Zelle') && product.descripcion ) {
    selectedCombo.value = product
    showComboDialog.value = true
  }
}
function splitDescripcion(desc: string): string[] {
  return desc
    // separa por punto seguido de espacios y también por saltos de línea
    .split(/\.|\n+/)
    .map(s => s.trim())
    .filter(Boolean)
}
function addSelectedComboToCart() {
  if (selectedCombo.value) {
    addToCart(selectedCombo.value)
    showComboDialog.value = false
  }
}

const searchQ = computed(() => ((route.query.q as string) || '').toLowerCase())

const filteredProducts = computed(() => {
  let base = products.value
  if (selectedCategory.value !== 'all') {
    if (selectedCategory.value === 'Nuevo' ) {
      base = base.filter(p => p.new === true)
    } else {
      base = base.filter(p => p.category === selectedCategory.value && p.estado !== 'Agotado')
    }
  }
  const q = searchQ.value
  if (!q){
    base = base.filter(p=> p.estado !== 'Agotado');
    return base;
  }
  return base.filter(p => {
    const haystack = [p.name, p.descripcion, p.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
})

function selectCategory(key: string) {
  selectedCategory.value = key
}

const $router = useRouter()
function goMayoristas() {
  void $router.push('/mayoristas')
}

function formatAmount(value: number, currency: 'CUP' | 'USD') {
  const formatted = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-ES', {
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(value)
  return `${formatted} ${currency}`
}

function getProductCurrency(product: Product): 'CUP' | 'USD' {
  const isUsd = product.category === 'combos' || product.category === 'Zelle' || product.subcategory === 'Zelle'
  return isUsd ? 'USD' : 'CUP'
}

function formatProductPrice(product: Product) {
  const currency = getProductCurrency(product)
  return formatAmount(product.price, currency)
}

function addToCart(product: Product) {
  const cart = useCartStore()
  const q = Math.max(1, qty[product.id] || 1)
  const mapped: StoreProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    categoryId: product.category,
  }
  const currencyCode: 'CUP' | 'USD' = getProductCurrency(product)
  cart.add(mapped, q, currencyCode)
}

const thumbStyle = {
  right: '2px',
  borderRadius: '4px',
  backgroundColor: 'rgba(0,0,0,0.25)',
  width: '4px',
  height: '4px',
}

const barStyle = {
  right: '2px',
  borderRadius: '4px',
  backgroundColor: 'rgba(0,0,0,0.08)',
  width: '4px',
  height: '4px',
}
const WHATSAPP_NUMBER = '5354512675'
function buyWhatsAppProduct(product: Product) {
  const quantity = Math.max(1, qty[product.id] || 1)
  const lines: string[] = []
  lines.push(`Hola, me interesa comprar este producto de MercadoTexas:`)
  lines.push(`- ${product.name} x${quantity} — ${formatProductPrice(product)} c/u`)
  lines.push(`Subtotal: ${formatAmount(product.price * quantity, getProductCurrency(product))}`)
  const text = encodeURIComponent(lines.join('\n'))
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
  window.open(url, '_blank')
}
</script>

<style scoped>
.tienda-page {
  /* espacio bajo el header ya viene del padding */
}

.cat-scroll {
  height: 56px;
  padding: 6px 4px;
  background: #f5f5f5;
  border: 1px solid rgba(0,0,0,0.05);
  background: linear-gradient(to bottom, #ffffff 0%, #f5f5f5 100%);
}

.product-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

.product-image {
  background-color: #fafafa;
}

.qty-input {
  width: 64px;
}

/* Scrollbar fino y atractivo en navegadores compatibles */
.cat-scroll::-webkit-scrollbar {
  height: 6px;
}
.cat-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.25);
  border-radius: 4px;
}
.cat-scroll::-webkit-scrollbar-track {
  background-color: transparent;
}

/* soporte Firefox */
.cat-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.25) transparent;
}

/* Dos líneas con ellipsis para nombres largos */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sticky-cats {
  position: sticky;
  top: 56px; /* altura del header de Quasar (aprox) */
  z-index: 10; /* sobre el contenido de la página */
}


</style>
