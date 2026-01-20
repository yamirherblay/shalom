<template>
  <q-form @submit.prevent="onSubmit">
    <div class="row q-col-gutter-md">
      <!-- Carga de imagen + previsualización -->
      <div class="col-12">
        <q-file
          v-model="fileProxy"
          accept="image/*"
          dense
          outlined
          clearable
          label="Seleccionar imagen"
          @update:model-value="onFileSelected"
        >
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>
      </div>
      <div class="col-12" v-if="previewUrl || localProduct.image">
        <q-img :src="previewUrl || localProduct.image" :ratio="16/9" style="max-height: 200px;" />
      </div>
      <div class="col-12">
        <q-input v-model="localProduct.id" label="ID" dense outlined :disable="mode==='edit'" />
      </div>
      <div class="col-12">
        <q-input v-model="localProduct.name" label="Nombre" dense outlined />
      </div>
      <div class="col-6">
        <q-input v-model.number="localProduct.price" type="number" label="Precio" dense outlined />
      </div>
      <div class="col-6">
        <q-select
          v-if="categoryOptions.length"
          v-model="localProduct.category"
          :options="categoryOptions"
          label="Categoría"
          dense
          outlined
          emit-value
          map-options
          use-input
          new-value-mode="add"
        />
        <q-input v-else v-model="localProduct.category" label="Categoría" dense outlined />
      </div>
      <div class="col-6">
        <q-input v-model="localProduct.subcategory" label="Subcategoría" dense outlined />
      </div>
      <div class="col-6">
        <q-select v-model="localProduct.estado" :options="estadoOptions" label="Estado" dense outlined emit-value map-options />
      </div>
      <div class="col-12">
        <q-input v-model="localProduct.image" label="URL de imagen" dense outlined />
      </div>
      <div class="col-6">
        <q-toggle v-model="localProduct.new" label="Nuevo" />
      </div>
      <div class="col-6">
        <q-toggle v-model="localProduct.oferta" label="En oferta" />
      </div>
      <div class="col-6" v-if="localProduct.oferta">
        <q-input v-model.number="localProduct.descuento" type="number" label="Descuento (%)" dense outlined />
      </div>
      <div class="col-12">
        <q-input v-model="localProduct.descripcion" type="textarea" label="Descripción" dense outlined autogrow />
      </div>
    </div>
    <div class="row justify-end q-gutter-sm q-mt-md">
      <q-btn flat color="grey-7" no-caps label="Cancelar" @click="onCancel" />
      <q-btn color="primary" no-caps :label="mode==='add' ? 'Crear' : 'Guardar'" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted, onBeforeUnmount } from 'vue'

export interface ProductFormModel {
  id: string
  name: string
  price: number
  category: string
  image: string
  new?: boolean
  oferta?: boolean
  estado?: string
  subcategory?: string
  descuento?: number
  descripcion?: string
}

const props = defineProps<{
  modelValue: ProductFormModel
  mode: 'add' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProductFormModel): void
  (e: 'save', value: ProductFormModel): void
  (e: 'cancel'): void
}>()

const localProduct = reactive<ProductFormModel>({ ...props.modelValue })

watch(() => props.modelValue, (v) => {
  Object.assign(localProduct, v)
})

watch(localProduct, (v) => {
  emit('update:modelValue', { ...v })
}, { deep: true })

const estadoOptions = [
  { label: 'Disponible', value: 'Disponible' },
  { label: 'Agotado', value: 'Agotado' }
]

// Opciones de categorías obtenidas del archivo local products.json
const categoryOptions = ref<{ label: string; value: string }[]>([])

// Manejo de archivo de imagen seleccionado
const fileProxy = ref<File | File[] | null>(null)
const previewUrl = ref<string>('')

function slugifyBase(name: string) {
  const base = name.replace(/\.[^/.]+$/, '')
  return base
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function onFileSelected(val: File | File[] | null) {
  const f = Array.isArray(val) ? val[0] : val
  if (!f) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
    return
  }
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(f)
  const filename = f.name
  const slug = slugifyBase(filename)
  // Ajustar ID a partir del nombre del archivo (en ambos modos, como solicitaste)
  if (slug) {
    // aunque el campo esté deshabilitado en modo edit, el valor interno se actualiza
    ;(localProduct).id = slug
  }
  // Ajustar URL de imagen a una ruta pública esperada
  ;(localProduct).image = `/images/productos/${filename}`
}

onMounted(async () => {
  try {
    const res = await fetch('/data/products.json')
    if (res.ok) {
      const data = await res.json()
      const categories = Array.isArray(data)
        ? data.map((p) => p?.category).filter((c) => typeof c === 'string' && c.trim() !== '')
        : []
      // Aseguramos que la categoría actual esté incluida si no viene del JSON
      if (localProduct.category && !categories.includes(localProduct.category)) {
        categories.push(localProduct.category)
      }
      const unique = [...new Set(categories)].sort((a, b) => a.localeCompare(b))
      categoryOptions.value = unique.map(c => ({ label: c, value: c }))
    }
  } catch (e: unknown) {
    console.log('message load json',e)
    // Silencioso: si falla el fetch, se mostrará un input de texto como fallback
  }
})

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

function onCancel() {
  emit('cancel')
}

function onSubmit() {
  emit('save', { ...localProduct })
}
</script>

<style scoped>
</style>
