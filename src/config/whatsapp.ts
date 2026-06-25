import { branding } from './branding';

export const whatsappConfig = {
  number: import.meta.env.VITE_WHATSAPP_NUMBER || '5351234567',
  businessName: branding.name,
  messageTemplates: {
    product: (productName: string, price: string) =>
      `Hola, me interesa: ${productName} - ${price}`,

    cart: (items: string, total: string) =>
      `Hola, quiero hacer el siguiente pedido:\n\n${items}\n\nTotal: ${total}`,

    contact: () =>
      `Hola, me gustaría obtener información sobre sus productos de ferretería.`,
  },
};

export function formatWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappConfig.number}?text=${encoded}`;
}
