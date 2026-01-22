<template>
  <q-page padding>
    <div class="row q-col-gutter-md items-lg-stretch">

      <!-- Estadísticas -->
      <div class="row q-col-gutter-lg q-mt-md q-mb-lg col-12 ">
        <q-card bordered class="col-12 col-sm-6 col-md-4 stat-card bg-info text-white shadow-2 rounded-borders q-pa-md">
          <q-card-section class="row items-center">
            <q-icon name="inventory_2" size="32px" class="q-mr-md" />
            <div>
              <div class="text-subtitle2">Total de productos</div>
              <div class="text-h5 text-weight-bold">{{ totalProducts }}</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card bordered class="col-12 col-sm-6 col-md-4 stat-card bg-positive text-white shadow-2 rounded-borders q-pa-md">
          <q-card-section class="row items-center">
            <q-icon name="check_circle" size="32px" class="q-mr-md" />
            <div>
              <div class="text-subtitle2">Disponibles</div>
              <div class="text-h5 text-weight-bold">{{ availableCount }}</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card bordered class="col-12 col-sm-6 col-md-4 stat-card bg-orange-7 text-white shadow-2 rounded-borders q-pa-md">
          <q-card-section class="row items-center no-wrap">
            <q-icon name="local_offer" size="32px" class="q-mr-md" />
            <div>
              <div class="text-subtitle2">En oferta</div>
              <div class="text-h5 text-weight-bold">{{ offerCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Productos -->
      <div class="col-12">
        <div class="text-h5">Productos</div>
        <q-card>
          <q-card-section class="row items-center q-col-gutter-sm  justify-end">

            <div class="col-auto row q-gutter-sm">
              <q-btn color="primary" icon="add" label="Añadir" no-caps @click="openAdd" />
              <q-btn color="secondary" icon="save" label="Guardar el JSON" no-caps @click="saveProductsJson" />
              <q-btn color="secondary" icon="check" label="Resetear novedad "  @click="allProductArentNew" />
              <q-btn color="grey-8" icon="help_outline" label="Ayuda" no-caps @click="helpDialog = true" />
            </div>
            <div class="col-12 col-sm-4">
              <q-input dense outlined v-model="filter" placeholder="Filtrar producto por nombre, id o categoría" clearable>
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
              :rows="filteredProducts"
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

    <!-- Ver Producto Dialog -->
    <q-dialog v-model="viewDialog">
      <q-card style="max-width: 500px; width: 100%">
        <q-card-section class="row items-center q-col-gutter-sm">
          <div class="text-h6 col">{{ viewProduct?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-4">
              <q-img :src="viewProduct?.image" :ratio="1" />
            </div>
            <div class="col-8">
              <div><strong>ID:</strong> {{ viewProduct?.id }}</div>
              <div><strong>Nombre:</strong> {{ viewProduct?.name }}</div>
              <div><strong>Precio:</strong> {{ currency(viewProduct?.price) }}</div>
              <div><strong>Categoría:</strong> {{ viewProduct?.category }}</div>
              <div><strong>Novedad:</strong> {{ viewProduct?.new ? "Nuevo" : "" }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Dialog -->
    <q-dialog v-model="addDialog">
      <q-card style="max-width: 700px; width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6 col">Nuevo producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProductForm v-model="newProduct" mode="add" @save="saveNew" @cancel="addDialog=false" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog">
      <q-card style="max-width: 700px; width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6 col">Editar producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProductForm v-model="editProduct" mode="edit" @save="saveEdit" @cancel="editDialog=false" />
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
import { onMounted, ref, computed } from 'vue';
import type { QTableColumn } from 'quasar';
import ProductForm from 'components/ProductForm.vue';
import AdminHelp from 'components/AdminHelp.vue';
import { useAdminChangesStore } from 'src/stores/adminChanges';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  new?: boolean;
  oferta?: boolean;
  estado?: string;
  subcategory?: string;
  descuento?: number;
  descripcion?: string;
}

const products = ref<Product[]>([]);
const filter = ref('');
const changesStore = useAdminChangesStore();
const addDialog = ref(false);
const editDialog = ref(false);
const helpDialog = ref(false);
const newProduct = ref<Product>({ id: '', name: '', price: 0, category: '', image: '', new: false, oferta: false, estado: 'Disponible', subcategory: '', descuento: 0, descripcion: '' });
const editProduct = ref<Product>({ id: '', name: '', price: 0, category: '', image: '', new: false, oferta: false, estado: 'Disponible', subcategory: '', descuento: 0, descripcion: '' });
const originalEditId = ref<string | null>(null);

const columns =<QTableColumn[]> [
  { name: 'image', label: 'Imagen', field: 'image', align: 'left' },
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'price', label: 'Precio', field: 'price', align: 'right', sortable: true, format: (v: number) => currency(v) },
  { name: 'category', label: 'Categoría', field: 'category', align: 'left', sortable: true },
  { name: 'disponibilidad', label: 'Disponibilidad', field: 'estado', align: 'left', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' },
];

const filteredProducts = computed(() => {
  const f = filter.value.trim().toLowerCase();
  if (!f) return products.value;
  return products.value.filter(p =>
    p.name.toLowerCase().includes(f) ||
    p.id.toLowerCase().includes(f) ||
    p.category.toLowerCase().includes(f) ||
    p.estado?.toLowerCase().includes(f)

  );
});

const viewDialog = ref(false);
const viewProduct = ref<Product | null>(null);

function openView(row: Product) {
  viewProduct.value = { ...row };
  viewDialog.value = true;
}

function openAdd() {
  newProduct.value = { id: '', name: '', price: 0, category: '', image: '', new: false, oferta: false, estado: 'Disponible', subcategory: '', descuento: 0, descripcion: '' };
  addDialog.value = true;
}
function allProductArentNew(){
return products.value.map((product: Product) => {product.new=false});
}
function openEdit(row: Product) {
  editProduct.value = { ...row };
  originalEditId.value = row.id;
  editDialog.value = true;
}

async function saveProductsJson() {
  try {
    const json = JSON.stringify(products.value, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    const supportsFS = typeof window !== 'undefined' && typeof (window).showSaveFilePicker === 'function';
    if (supportsFS) {
      const handle = await (window).showSaveFilePicker({
        suggestedName: 'products.json',
        types: [
          {
            description: 'Archivo JSON',
            accept: { 'application/json': ['.json'] }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  } catch (e:unknown) {
    console.warn('No se pudo guardar el JSON', e);
  }
}

function saveNew(product: Product) {
  // evitar duplicados por id
  const exists = products.value.find(p => p.id === product.id);
  if (exists) {
    // si existe, reemplazamos
    const idx = products.value.findIndex(p => p.id === product.id);
    products.value[idx] = { ...product };
    changesStore.addUpdated({ id: product.id, name: product.name })
  } else {
    products.value.unshift({ ...product });
    changesStore.addAdded({ id: product.id, name: product.name })
  }
  addDialog.value = false;
}
const totalProducts = computed(() => products.value.length);
const availableCount = computed(() => products.value.filter(p => p.estado === 'Disponible').length);
const offerCount = computed(() => products.value.filter(p => p.oferta === true).length);

function saveEdit(product: Product) {
  // Usar el ID original de la fila para encontrar el índice, por si el usuario cambió el ID en edición
  const key = originalEditId.value ?? product.id;
  const idx = products.value.findIndex(p => p.id === key);
  if (idx !== -1) {
    products.value[idx] = { ...product };
    changesStore.addUpdated({ id: product.id, name: product.name })
  }
  originalEditId.value = null;
  editDialog.value = false;
}

function currency(val?: number) {
  if (val == null) return '';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'CUP', maximumFractionDigits: 2 }).format(val);
}

onMounted(async () => {
  try {
    const res = await fetch('/data/products.json');
    if (res.ok) {
      const data = await res.json();
      // products.json is an array of products
      products.value = Array.isArray(data) ? data : [];
      // Resetear el registro de cambios al entrar, para contar solo cambios posteriores
      changesStore.clear()
    }
  } catch (e) {
    console.warn('No se pudieron cargar products.json', e);
  }
});

</script>

<style scoped>
stat-card {
  min-height: 120px;
  padding: 1rem;
}
</style>
