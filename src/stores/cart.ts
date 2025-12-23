import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { CartItem, Product,} from './types';

const STORAGE_KEY = 'mercadotexas_cart_v2';
type CurrencyCode = 'CUP' | 'USD';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  // Mapa paralelo: productId -> currency mostrada al añadir
  const itemCurrency = ref<Record<string, CurrencyCode>>({});

  // load persisted cart (compat v1: solo items)
  try {
    const persisted = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('mercadotexas_cart_v1');
    if (persisted) {
      const parsed = JSON.parse(persisted);
      if (Array.isArray(parsed)) {
        // v1: solo items
        items.value = parsed as CartItem[];
      } else if (parsed && typeof parsed === 'object') {
        items.value = (parsed.items || []) as CartItem[];
        itemCurrency.value = (parsed.itemCurrency || {}) as Record<string, CurrencyCode>;
      }
    }
  } catch {
    Error('Error reading the cart from localStorage. Please clear your browser cache and try again.')
  }

  // persist both
  watch([items, itemCurrency], ([val, map]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: val, itemCurrency: map }));
  }, { deep: true });

  const count = computed(() => items.value.reduce((s, it) => s + it.quantity, 0));
  // total legacy (sin distinguir moneda) para compatibilidad visual previa
  const total = computed(() => items.value.reduce((s, it) => s + it.product.price * it.quantity, 0));

  const totalsByCurrency = computed(() => {
    return items.value.reduce((acc, it) => {
      const code = itemCurrency.value[it.product.id] || 'CUP';
      acc[code] = (acc[code] || 0) + it.product.price * it.quantity;
      return acc;
    }, {} as Record<CurrencyCode, number>);
  });

  const totalCUP = computed(() => totalsByCurrency.value.CUP || 0);
  const totalUSD = computed(() => totalsByCurrency.value.USD || 0);

  function add(product: Product, qty = 1, currency: CurrencyCode = 'CUP') {
    const found = items.value.find(it => it.product.id === product.id);
    if (found) {
      found.quantity += qty;
    } else {
      items.value.push({ product, quantity: Math.max(1, qty) });
    }
    // guarda/actualiza la moneda observada para este producto
    itemCurrency.value[product.id] = currency;
  }
  function remove(productId: string) {
    items.value = items.value.filter(it => it.product.id !== productId);
    delete itemCurrency.value[productId];
  }
  function setQuantity(productId: string, qty: number) {
    const it = items.value.find(i => i.product.id === productId);
    if (!it) return;
    it.quantity = Math.max(1, qty);
  }
  function clear() { items.value = []; itemCurrency.value = {}; }

  function getCurrency(productId: string): CurrencyCode { return itemCurrency.value[productId] || 'CUP'; }

  return { items, count, total, totalsByCurrency, totalCUP, totalUSD, add, remove, clear, setQuantity, getCurrency, itemCurrency };
});
