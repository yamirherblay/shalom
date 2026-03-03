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
      <div class="col-12" v-if="previewUrl || localItem.image">
        <q-img :src="previewUrl || localItem.image" :ratio="16/9" style="max-height: 200px;" />
      </div>
      <div class="col-12">
        <q-input v-model="localItem.id" label="ID" readonly dense outlined :disable="mode==='edit'" />
      </div>
      <div class="col-12">
        <q-input v-model="localItem.name" label="Nombre" dense outlined />
      </div>
      <div class="col-6">
        <q-input v-model.number="localItem.price" type="number" label="Precio" dense outlined />
      </div>
      <div class="col-6">
        <q-select
          v-if="categoryOptions.length"
          v-model="localItem.category"
          :options="categoryOptions"
          label="Categoría"
          dense
          outlined
          emit-value
          map-options
          use-input
          new-value-mode="add"
        />
        <q-input v-else v-model="localItem.category" label="Categoría" dense outlined />
      </div>
      <div class="col-12">
        <q-select v-model="localItem.estado" :options="estadoOptions" label="Estado" dense outlined emit-value map-options />
      </div>
      <div class="col-12">
        <q-input v-model="localItem.image" label="URL de imagen" readonly dense outlined />
      </div>
      <div class="col-12">
        <q-toggle v-model="localItem.oferta" label="En oferta" />
      </div>
      <div class="col-12">
        <q-input v-model="localItem.descripcion" type="textarea" label="Descripción corta" dense outlined autogrow />
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

export interface ClothesFormModel {
  id: string
  departament?: string
  name: string
  price: number
  image: string
  oferta?: boolean
  estado?: string
  category: string
  descripcion?: string
}

const props = defineProps<{
  modelValue: ClothesFormModel
  mode: 'add' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ClothesFormModel): void
  (e: 'save', value: ClothesFormModel): void
  (e: 'cancel'): void
}>()

const localItem = reactive<ClothesFormModel>({ ...props.modelValue })

watch(() => props.modelValue, (v) => {
  Object.assign(localItem, v)
})

watch(localItem, (v) => {
  emit('update:modelValue', { ...v })
}, { deep: true })

const estadoOptions = [
  { label: 'Disponible', value: 'Disponible' },
  { label: 'Agotado', value: 'Agotado' }
]

// Opciones de categorías obtenidas del archivo local clothes.json
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
  const file = Array.isArray(val) ? val[0] : val
  if (!file) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
    return
  }
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
  const filename = file.name
  const slug = slugifyBase(filename)
  // Ajustar ID a partir del nombre del archivo
  if (slug) {
    localItem.id = crypto.randomUUID();
    localItem.departament = 'clothstore';
    console.log('id',localItem.id)
  }
  // Ajustar URL de imagen a una ruta pública esperada
  ;(localItem).image = `/images/clothes/${filename}`
}

onMounted(async () => {
  try {
    const res = await fetch('/data/clothes.json')
    if (res.ok) {
      const data = await res.json()
      const categories = Array.isArray(data)
        ? data.map((product) => product?.category).filter((clothes) => typeof clothes === 'string' && clothes.trim() !== '')
        : []
      // Aseguramos que la categoría actual esté incluida si no viene del JSON
      if (localItem.category && !categories.includes(localItem.category)) {
        categories.push(localItem.category)
      }
      const unique = [...new Set(categories)].sort((a, b) => a.localeCompare(b))
      categoryOptions.value = unique.map(cat => ({ label: cat, value: cat }))
    }
  } catch (e: unknown) {
    console.warn('No se pudo cargar el json ', e);
  }
})

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

function onCancel() {
  emit('cancel')
}

function onSubmit() {
  emit('save', { ...localItem })
}
</script>

<style scoped>
</style>
