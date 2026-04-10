import { whatsappConfig, formatWhatsAppUrl } from 'config/whatsapp';
import type { Product } from 'src/stores/types';
import type { CartItem } from 'src/stores/types';

export function useWhatsApp() {
  function sendProductRequest(product: Product, quantity = 1) {
    const price = formatProductPrice(product);
    const message = whatsappConfig.messageTemplates.product(product.name, price);
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  function sendCartProposal(items: CartItem[]) {
    const itemsList = items
      .map((item) => `${item.product.name} x${item.quantity} - ${formatProductPrice(item.product)}`)
      .join('\n');

    const total = items.reduce((sum, item) => {
      const price = item.product.descuento || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const totalFormatted = formatTotal(total, items[0]?.currency || 'CUP');
    const message = whatsappConfig.messageTemplates.cart(itemsList, totalFormatted);
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  function sendContactMessage() {
    const message = whatsappConfig.messageTemplates.contact();
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  return {
    sendProductRequest,
    sendCartProposal,
    sendContactMessage,
  };
}

function formatProductPrice(product: Product): string {
  const price = product.descuento || product.price;
  const currency = product.currency || 'CUP';
  return formatPrice(price, currency);
}

function formatTotal(total: number, currency: 'CUP' | 'USD'): string {
  return formatPrice(total, currency);
}

function formatPrice(value: number, currency: 'CUP' | 'USD'): string {
  const formatted = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-ES', {
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(value);
  return `${formatted} ${currency}`;
}
