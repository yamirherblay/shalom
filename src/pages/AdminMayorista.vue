<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="text-h6 q-ma-lg">Mayorista</div>
        <q-card>
          <q-card-section class="row items-center q-col-gutter-sm justify-end">
            <div class="col-auto row q-gutter-sm">
              <q-btn color="primary" icon="add" label="Añadir" no-caps @click="openAdd" />
              <q-btn color="secondary" icon="save" label="Guardar en JSON" no-caps @click="saveMayoristaJson" />
              <q-btn color="grey-8" icon="help_outline" label="Ayuda" no-caps @click="helpDialog = true" />
            </div>
            <div class="col-12 col-sm-4">
              <q-input dense outlined v-model="filter" placeholder="Filtrar por nombre, id o categoría" clearable>
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-table
              flat
              bordered
              :rows="filteredItems"
              :columns="columns"
              row-key="id"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn size="sm" color="primary" flat icon="visibility" label="Ver" class="q-mr-sm"
                         @click="openView(props.row)" />
                  <q-btn size="sm" color="secondary" flat icon="edit" label="Editar"
                         @click="openEdit(props.row)" />
                </q-td>
              </template>
              <template #body-cell-image="props">
                <q-td :props="props">
                  <q-img :src="props.row.image" :ratio="1" style="width: 40px; height: 40px" />
                </q-td>
              </template>
              <template #body-cell-disponibilidad="props">
                <q-td :props="props">
                  <q-badge
                    :label="props.row.estado"
                    :color="props.row.estado === 'Disponible' ? 'green' : 'red-7'"
                    :text-color="props.row.estado === 'Disponible' ? 'white' : 'grey'"
                    dense
                    class="fa-text-height"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Ver Dialog -->
    <q-dialog v-model="viewDialog">
      <q-card style="max-width: 500px; width: 100%">
        <q-card-section class="row items-center q-col-gutter-sm">
          <div class="text-h6 col">{{ viewItem?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-4">
              <q-img :src="viewItem?.image" :ratio="1" />
            </div>
            <div class="col-8">
              <div><strong>ID:</strong> {{ viewItem?.id }}</div>
              <div><strong>Nombre:</strong> {{ viewItem?.name }}</div>
              <div><strong>Precio:</strong> {{ currency(viewItem?.price) }}</div>
              <div><strong>Categoría:</strong> {{ viewItem?.category }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Dialog -->
    <q-dialog v-model="addDialog">
      <q-card style="max-width: 700px; width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6 col">Nuevo artículo mayorista</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProductForm v-model="newItem" mode="add" @save="saveNew" @cancel="addDialog=false" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog">
      <q-card style="max-width: 700px; width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6 col">Editar artículo mayorista</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProductForm v-model="editItem" mode="edit" @save="saveEdit" @cancel="editDialog=false" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Help Dialog -->
    <q-dialog v-model="helpDialog">
      <q-card style="max-width: 640px; width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6 col">Ayuda</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <AdminHelp />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { QTableColumn } from 'quasar'
import ProductForm from 'components/ProductForm.vue'
import AdminHelp from 'components/AdminHelp.vue'
import { useAdminChangesStore } from 'stores/adminChanges';

interface MayoristaItem {
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

const items = ref<MayoristaItem[]>([])
const changes = useAdminChangesStore()
const filter = ref('')
const addDialog = ref(false)
const editDialog = ref(false)
const helpDialog = ref(false)
const newItem = ref<MayoristaItem>({ id: '', name: '', price: 0, category: '', image: '', new: false, oferta: false, estado: 'Disponible', subcategory: '', descuento: 0, descripcion: '' })
const editItem = ref<MayoristaItem>({ id: '', name: '', price: 0, category: '', image: '', new: false, oferta: false, estado: 'Disponible', subcategory: '', descuento: 0, descripcion: '' })
const originalEditId = ref<string | null>(null)

const columns = <QTableColumn[]>[
  { name: 'image', label: 'Imagen', field: 'image', align: 'left' },
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'price', label: 'Precio', field: 'price', align: 'right', sortable: true, format: (v: number) => currency(v) },
  { name: 'category', label: 'Categoría', field: 'category', align: 'left', sortable: true },
  { name: 'disponibilidad', label: 'Disponibilidad', field: 'estado', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' },
]

const filteredItems = computed(() => {
  const f = filter.value.trim().toLowerCase()
  if (!f) return items.value
  return items.value.filter(p =>
    p.name.toLowerCase().includes(f) ||
    p.id.toLowerCase().includes(f) ||
    (p.category || '').toLowerCase().includes(f) ||
    (p.estado || '').toLowerCase().includes(f)
  )
})

const viewDialog = ref(false)
const viewItem = ref<MayoristaItem | null>(null)

function openView(row: MayoristaItem) {
  viewItem.value = { ...row }
  viewDialog.value = true
}

function openAdd() {
  newItem.value = { id: '', name: '', price: 0, category: '', image: '', new: false, oferta: false, estado: 'Disponible', subcategory: '', descuento: 0, descripcion: '' }
  addDialog.value = true
}

function openEdit(row: MayoristaItem) {
  editItem.value = { ...row }
  originalEditId.value = row.id
  editDialog.value = true
}

async function saveMayoristaJson() {
  try {
    const json = JSON.stringify(items.value, null, 2)
    const blob = new Blob([json], { type: 'application/json' })

    const supportsFS = typeof window !== 'undefined' && typeof (window).showSaveFilePicker === 'function'
    if (supportsFS) {
      const handle = await (window).showSaveFilePicker({
        suggestedName: 'mayorista.json',
        types: [
          { description: 'Archivo JSON', accept: { 'application/json': ['.json'] } }
        ]
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
    } else {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mayorista.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  } catch (e) {
    console.error('Error al guardar JSON', e)
  }
}

function saveNew(model: MayoristaItem) {
  const idx = items.value.findIndex(p => p.id === model.id)
  if (idx !== -1) {
    alert('Ya existe un elemento con ese Identificador...Cambielo')
    return
  }
  items.value = [model, ...items.value]
  changes.addAdded({id:model.id , name:model.name})
  addDialog.value = false
}

function saveEdit(model: MayoristaItem) {
  const idx = items.value.findIndex(p => p.id === originalEditId.value)
  if (idx === -1) return
  items.value[idx] = { ...model }
  changes.addUpdated({id:model.id , name:model.name})
  editDialog.value = false
}

onMounted(async () => {
  try {
    const res = await fetch('/data/mayorista.json')
    if (res.ok) {
      items.value = await res.json()
    }
  } catch (e) {
    console.log('Mayorista: no se pudo cargar el JSON', e)
  }
})

function currency(v?: number) {
  const n = typeof v === 'number' ? v : 0
  return new Intl.NumberFormat('es-Es', { style: 'currency', currency: 'CUP', maximumFractionDigits: 2 }).format(n)
}
</script>

<style scoped>
</style>
