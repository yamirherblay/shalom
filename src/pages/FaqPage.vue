<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-10 col-lg-8 q-mx-auto">
        <q-card flat bordered class="q-pa-md">
          <q-card-section class="text-center q-pb-none">
            <div class="text-h5 text-primary text-weight-bold">Preguntas Frecuentes</div>
            <div class="text-subtitle2 text-grey-8">Conoce cómo trabajamos y resuelve tus dudas comunes</div>
          </q-card-section>

          <q-separator spaced />

          <q-list bordered separator class="rounded-borders">
            <q-expansion-item expand-separator icon="help_outline" label="¿Cómo funciona Mercado Texas?" caption="Pasos para comprar" dense>
              <q-card>
                <q-card-section>
                  <p>
                    Exploras los productos por categorías, añades al carrito lo que te interese y finalizas tu pedido.
                    También puedes comprar por WhatsApp con el botón dedicado en cada producto. Para combos o artículos
                    pagados vía Zelle, verás la indicación en la tarjeta del producto.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item expand-separator icon="shopping_cart" label="¿Cómo hago un pedido?" caption="Carrito y confirmación" dense>
              <q-card>
                <q-card-section>
                  <ol class="q-pl-md">
                    <li>Selecciona una categoría o usa el buscador de la tienda.</li>
                    <li>Pulsa en “Añadir” para agregar productos al carrito.</li>
                    <li>Abre el carrito desde el icono superior y confirma tu pedido.</li>
                  </ol>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item expand-separator icon="payments" label="¿Qué métodos de pago aceptan?" caption="CUP y USD (Zelle)" dense>
              <q-card>
                <q-card-section>
                  <p>
                    Aceptamos pagos en CUP para la mayoría de los productos. Los combos y artículos identificados con
                    Zelle se pagan en USD. En cada tarjeta verás la moneda asociada al precio.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item expand-separator icon="local_shipping" label="¿Hacen entregas?" caption="Cobertura local" dense>
              <q-card>
                <q-card-section>
                  <p>
                    Sí, realizamos entregas locales en Las Tunas. Tras confirmar tu pedido, coordinamos el horario y el
                    punto de entrega. Los tiempos pueden variar según la disponibilidad.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item expand-separator icon="verified" label="¿Los precios cambian?" caption="Actualizaciones y ofertas" dense>
              <q-card>
                <q-card-section>
                  <p>
                    Mantenemos los precios actualizados, pero pueden variar según el inventario y la oferta del día. Si
                    un artículo está en oferta, verás la insignia “En Oferta” en su tarjeta.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item expand-separator icon="support_agent" label="¿Cómo los contacto?" caption="Asistencia y WhatsApp" dense>
              <q-card>
                <q-card-section>
                  <p>
                    Puedes escribirnos desde la página de Contacto o usar el botón de WhatsApp en los productos para
                    una atención más rápida.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>

          <q-separator spaced />

          <div class="text-center q-gutter-sm">
            <q-btn color="primary" outline icon="store" label="Ir al Mercado" to="/tienda" />
            <q-btn color="secondary" icon="contact_support" label="Contacto" to="/contact" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useMeta } from 'quasar'

useMeta({
  title: 'Preguntas frecuentes | Mercado Texas',
  meta: {
    description: { name: 'description', content: 'Respuestas a preguntas frecuentes: cómo comprar, métodos de pago, entregas y soporte en Mercado Texas.' },
    ogTitle: { property: 'og:title', content: 'Preguntas frecuentes | Mercado Texas' },
    ogDescription: { property: 'og:description', content: 'Conoce cómo trabajamos y despeja tus dudas frecuentes.' },
    ogImage: { property: 'og:image', content: '/images/og-home.jpg' },
  }
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
