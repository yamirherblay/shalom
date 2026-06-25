import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { CartItem, Product } from './types';

const STORAGE_KEY = 'ferreteriavip_cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  try {
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (persisted) {
      const parsed = JSON.parse(persisted);
      if (Array.isArray(parsed)) {
        items.value = parsed as CartItem[];
      }
    }
  } catch {
    Error('Error al leer el carrito del almacenamiento local.');
  }

  watch(
    items,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    },
    { deep: true },
  );

  const count = computed(() => items.value.reduce((s, it) => s + it.quantity, 0));

  function effectivePrice(p: Product): number {
    return p.oferta && p.descuento ? p.descuento : p.price;
  }

  const total = computed(() =>
    items.value.reduce((s, it) => s + effectivePrice(it.product) * it.quantity, 0),
  );

  function add(product: Product, qty = 1) {
    const found = items.value.find((it) => it.product.id === product.id);
    if (found) {
      found.quantity += qty;
    } else {
      items.value.push({ product, quantity: qty });
    }
  }

  function remove(productId: string) {
    items.value = items.value.filter((it) => it.product.id !== productId);
  }

  function setQuantity(productId: string, qty: number) {
    const it = items.value.find((i) => i.product.id === productId);
    if (!it) return;
    it.quantity = Math.max(1, qty);
  }

  function clear() {
    items.value = [];
  }

  return {
    items,
    count,
    total,
    add,
    remove,
    clear,
    setQuantity,
  };
});
