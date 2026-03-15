<template>
  <q-card class="clothes-card">
    <q-img :src="item.image || '/images/placeholder.svg'" ratio="1" :alt="item.name">
      <div class="absolute-top-right badge-ofert q-pa-sm" v-if="item.oferta">
        <q-badge class="badge-ofert" label="Oferta" />
      </div>
    </q-img>

    <q-card-section>
      <div class="text-subtitle1 ellipsis-2-lines">{{ item.name }}</div>
      <div v-if="item.descripcion" class="text-caption text-grey-7 ellipsis-2-lines">
        {{ item.descripcion }}
      </div>
      <div class="row items-center q-mt-sm justify-between">
        <div class="text-h6">{{ currency(item.price) }}</div>
        <q-badge class="badge-purple" :label="item.estado || '—'" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        color="positive"
        unelevated
        size="sm"
        icon="fa-brands fa-whatsapp"
        label="Solicitar por WhatsApp"
        title="Comprar por WhatsApp"
        alt="Comprar por WhatsApp"
        aria-label="Comprar por WhatsApp"
        @click="buyWhatsAppItem()"
      />
    </q-card-actions>
  </q-card>

  <!--  &lt;!&ndash; Dialog de imagen ampliada &ndash;&gt;
  <q-dialog v-model="showPreview">
    <q-card flat class="no-shadow bg-transparent" style="box-shadow: none">
      <div class="relative-position">
        <q-btn icon="close" round dense flat class="absolute-top-right q-ma-sm" v-close-popup aria-label="Cerrar" />
        <q-img
          :src="item.image || '/images/placeholder.svg'"
          :alt="item.name"
          spinner-color="white"
          style="max-width: 95vw; max-height: 90vh"
        />
      </div>
    </q-card>
  </q-dialog>-->
</template>

<script setup lang="ts">
export interface ClothesItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  oferta?: boolean;
  estado?: string;
  descripcion?: string;
}

const props = defineProps<{ item: ClothesItem }>();

function currency(n: number) {
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
    maximumFractionDigits: 0,
  }).format(n);
}

const WHATSAPP_NUMBER = '5358156505';
function buyWhatsAppItem() {
  const quantity = 1;
  const lines: string[] = [];
  lines.push('Hola, me interesa comprar este producto de MercadoTexas:');
  const imageUrl = props.item.image
    ? new URL(props.item.image, window.location.origin).href
    : new URL('/images/placeholder.svg', window.location.origin).href;

  // Añadir el enlace de la imagen al texto
  lines.push('Foto:');
  lines.push(imageUrl);
  lines.push(`- ${props.item.name} x${quantity} — ${currency(props.item.price)} c/u`);
  lines.push(`Subtotal: ${currency(props.item.price * quantity)}`);
  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, '_blank');
}
</script>

<style scoped>
.clothes-card {
  width: 100%;
  max-width: 320px;
  border: 2px solid #c28cf6; /* morado claro */
  border-radius: 12px;
}

.badge-purple {
  background: rgba(139, 92, 246, 0.18); /* morado traslúcido */
  color: #5b2e86; /* texto morado oscuro para contraste */
  border: 1px solid rgba(139, 92, 246, 0.35); /* borde sutil */
}
.badge-ofert {
  background: rgba(131, 10, 212, 0.39); /* morado traslúcido */
  color: #fffcfc; /* texto morado oscuro para contraste */
}

/* two-line clamp utility */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Marca la imagen como zoomable */
.clickable-img {
  cursor: zoom-in;
}

/* Asegura que la imagen dentro del diálogo quepa completa */
:deep(img.fit-contain) {
  object-fit: contain;
}
</style>
