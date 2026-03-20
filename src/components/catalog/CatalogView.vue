<template>
  <q-page padding class="catalog-page">
    <ProductFilters
      :categories="categories"
      :selected-category="selectedCategory"
      @select="handleCategorySelect"
    />

    <q-input
      v-model="searchQuery"
      dense
      outlined
      class="q-my-md"
      placeholder="Buscar productos..."
      clearable
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <ProductGrid
      :products="filteredProducts"
      @whatsapp="handleWhatsApp"
      @add-to-cart="handleAddToCart"
    >
      <template #empty>
        <div v-if="searchQuery">No se encontraron productos para "{{ searchQuery }}"</div>
        <div v-else>No hay productos disponibles en esta categoría.</div>
      </template>
    </ProductGrid>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductFilters from './ProductFilters.vue';
import ProductGrid from './ProductGrid.vue';
import { useProducts } from 'src/composables/useProducts';
import { useWhatsApp } from 'src/composables/useWhatsApp';
import { useCartStore } from 'src/stores/cart';
import type { Product } from 'src/stores/types';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { products, fetchProducts, getCategories } = useProducts();
const { sendProductRequest } = useWhatsApp();
const cartStore = useCartStore();

const selectedCategory = ref('all');
const searchQuery = ref('');

const categories = computed(() => {
  const cats = getCategories();
  return [{ key: 'all', label: 'Todos' }, ...cats.map((c) => ({ key: c, label: capitalize(c) }))];
});

const filteredProducts = computed(() => {
  let filtered = products.value.filter((p) => p.estado !== 'Agotado');

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.descripcion?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query),
    );
  }

  return filtered;
});

function handleCategorySelect(key: string) {
  selectedCategory.value = key;
  router.replace({
    query: key !== 'all' ? { cat: key } : {},
  });
}

function handleWhatsApp(product: Product) {
  sendProductRequest(product);
}

function handleAddToCart(product: Product) {
  cartStore.add(
    {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      categoryId: product.category,
    },
    1,
    product.currency || 'CUP',
  );
  $q.notify({
    type: 'info',
    message: `Agregado al carrito: ${product.name}`,
    timeout: 2000,
  });
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

onMounted(async () => {
  await fetchProducts();
  if (route.query.cat) {
    selectedCategory.value = route.query.cat as string;
  }
});
</script>

<style scoped>
.catalog-page {
  background: #fafafa;
}
</style>
