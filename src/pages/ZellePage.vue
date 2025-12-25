
<template>
  <q-page class="q-pa-md zelle-page">
    <div class="q-mx-auto" style="max-width: 980px">
      <div class="text-h5 text-weight-bold q-mb-xs">Remesas y pagos con Zelle</div>
      <div class="text-body1 q-mb-md">
        Enviamos  remesas de forma rápida y segura. Trabajamos con la tasa de cambio vigente
        y realizamos el cálculo por ti. Completa el simulador y solicita el servicio por WhatsApp.
      </div>

      <q-card flat bordered>
        <q-card-section class="row items-center q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <div class="text-subtitle2">Nuestra Tasa de cambio vigente para entregas en CUP</div>
            <div class="row items-center q-gutter-sm q-mt-xs">
              <q-input v-model.number="exchangeRate" type="number" readonly dense filled prefix="1 USD =" :min="0" :step="0.01" aria-label="Tasa de cambio"/>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">Actualiza la tasa si es necesario.</div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="text-subtitle2">Nuestro porcentaje para entregas en USD</div>
            <q-input v-model.number="deliveryPercent" type="number" readonly dense filled suffix="%" :min="0" :step="0.1" aria-label="Porciento de entrega" />
            <div class="text-caption text-grey-7 q-mt-xs">Se aplica sobre el monto en USD.</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Calculadora de monto a entregar</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <q-select
                v-model="selectedCurrency"
                :options="currencyOptions"
                emit-value map-options
                label="Moneda del monto ingresado"
                dense filled
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                v-model.number="amount"
                type="number"
                inputmode="decimal"
                min="0"
                :step="selectedCurrency === 'USD' ? 1 : 10"
                dense filled
                label="Monto a calcular"
                aria-label="Monto a calcular"
              />
            </div>
            <div class="col-12 col-sm-4">
              <div class="text-caption text-grey-7 q-mb-xs">Resultado</div>
              <div class="text-h6">
                {{ formattedResult }}
              </div>
              <div class="text-caption text-grey-7">{{ resultHelpText }}</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="positive"
                 icon="fa-brands fa-whatsapp"
                 :disable="!canSend"
                 label="Solicitar por WhatsApp"
                 @click="requestByWhatsApp"
                 />
        </q-card-actions>
      </q-card>

      <div class="q-mt-md text-caption text-grey-7">
        Nota: Este cálculo es orientativo. Confirma con nuestro equipo para finalizar tu solicitud.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// Número de WhatsApp para solicitudes
const WHATSAPP_NUMBER = '14328882324'

// Estado de la calculadora
const currencyOptions = [
  { label: 'CUP', value: 'CUP' },
  { label: 'USD', value: 'USD' },
] as const

const selectedCurrency = ref<'CUP' | 'USD'>('CUP')
const amount = ref<number>(0)

// Configurables
const exchangeRate = ref<number>(400) // 1 USD = X CUP
const deliveryPercent = ref<number>(5) // % extra para USD

// Cálculo del resultado según reglas:
// - Si el monto está en CUP: entregar = monto * tasa (se convierte a CUP a entregar)
// - Si el monto está en USD: entregar = monto * (1 + %/100)
const result = computed<number>(() => {
  const a = Number(amount.value) || 0
  if (a <= 0) return 0
  if (selectedCurrency.value === 'CUP') {
    return a * (Number(exchangeRate.value) || 0)
  } else {
    const pct = Number(deliveryPercent.value) || 0
    return a * (1 + pct / 100)
  }
})

const resultCurrency = computed<'CUP' | 'USD'>(() => (selectedCurrency.value === 'CUP' ? 'CUP' : 'USD'))

function formatAmount(value: number, currency: 'CUP' | 'USD') {
  const formatted =  Intl.NumberFormat(
    currency === 'USD' ? 'en-US' : 'es-ES', {
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,

  }).format(value || 0)
  return `${formatted} ${currency}`
}

const formattedResult = computed(() => formatAmount(result.value, resultCurrency.value))
const resultHelpText = computed(() => {
  if (!amount.value) return 'Ingresa un monto para ver el cálculo'
  if (selectedCurrency.value === 'CUP') {
    return `Cálculo: ${formatAmount(amount.value, 'CUP')} × ${exchangeRate.value} = ${formattedResult.value}`
  } else {
    return `Cálculo: ${formatAmount(amount.value, 'USD')} × (1 + ${deliveryPercent.value}% ) = ${formattedResult.value}`
  }
})

const canSend = computed(() => amount.value > 0 && result.value > 0)

function requestByWhatsApp() {
  if (!canSend.value) return
  const lines: string[] = []
  lines.push('Solicitud de servicio de remesas (Zelle)')
  lines.push(`Moneda ingresada: ${selectedCurrency.value}`)
  lines.push(`Monto ingresado: ${formatAmount(amount.value, 'USD')}`)
  lines.push(`Tasa de cambio vigente: 1 USD = ${exchangeRate.value} CUP`)
  if(selectedCurrency.value === 'USD') {
    lines.push(`Porciento a depositar: ${deliveryPercent.value}%`)
  }
  lines.push(`Monto a entregar: ${formattedResult.value}`)
  lines.push('¿Pueden asistirme con esta solicitud?')
  const text = encodeURIComponent(lines.join('\n'))
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
  window.open(url, '_blank')
}

// Normalizar negativos/NaN
watch([amount, exchangeRate, deliveryPercent], () => {
  if (amount.value < 0) amount.value = 0
  if (exchangeRate.value < 0) exchangeRate.value = 0
  if (deliveryPercent.value < 0) deliveryPercent.value = 0
})
</script>

<style scoped>
.zelle-page::before{
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(to bottom right, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.25)),
    url('/images/fondo2.JPG') center/cover no-repeat fixed;
  filter: blur(8px);
  z-index: 0;
}
</style>
