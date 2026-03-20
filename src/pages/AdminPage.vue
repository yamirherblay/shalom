<template>
  <q-page padding>
    <div class="row q-col-gutter-md items-lg-stretch">
      <div class="row q-col-gutter-lg q-mt-md q-mb-lg col-12 justify-around">
        <q-card
          bordered
          class="col-12 col-sm-6 col-md-4 stat-card bg-info text-white shadow-2 rounded-borders q-pa-md"
        >
          <q-card-section class="row items-center">
            <q-icon name="inventory_2" size="32px" class="q-mr-md" />
            <div>
              <div class="text-subtitle2">Total de productos</div>
              <div class="text-h5 text-weight-bold">{{ totalProducts }}</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card
          bordered
          class="col-12 col-sm-6 col-md-4 stat-card bg-positive text-white shadow-2 rounded-borders q-pa-md"
        >
          <q-card-section class="row items-center">
            <q-icon name="check_circle" size="32px" class="q-mr-md" />
            <div>
              <div class="text-subtitle2">Disponibles</div>
              <div class="text-h5 text-weight-bold">{{ availableCount }}</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card
          bordered
          class="col-12 col-sm-6 col-md-4 stat-card bg-orange-7 text-white shadow-2 rounded-borders q-pa-md"
        >
          <q-card-section class="row items-center no-wrap">
            <q-icon name="local_offer" size="32px" class="q-mr-md" />
            <div>
              <div class="text-subtitle2">En oferta</div>
              <div class="text-h5 text-weight-bold">{{ offerCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <div class="text-h5">Productos</div>
        <q-card>
          <q-card-section class="row items-center q-col-gutter-sm justify-end">
            <div class="col-auto row q-gutter-sm">
              <q-btn color="primary" icon="add" label="Añadir" no-caps @click="openAdd" />
            </div>
            <div class="col-12 col-sm-4">
              <q-input dense outlined v-model="filter" placeholder="Filtrar productos..." clearable>
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
              loading-label="Cargando productos..."
              row-key="id"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    size="sm"
                    color="primary"
                    flat
                    icon="visibility"
                    label="Ver"
                    class="q-mr-sm"
                    @click="openView(props.row)"
                  />
                  <q-btn
                    size="sm"
                    color="secondary"
                    flat
                    icon="edit"
                    label="Editar"
                    @click="openEdit(props.row)"
                  />
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
                    :text-color="props.row.estado === 'Disponible' ? 'white' : 'grey1'"
                    dense
                  />
                </q-td>
              </template>
              <template #body-cell-oferta="props">
                <q-td :props="props">
                  <q-badge
                    :label="props.row.oferta ? 'Oferta' : ''"
                    :color="props.row.oferta ? 'orange' : 'white'"
                    dense
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

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
              <div>
                <strong>Precio:</strong>
                {{ formatPrice(viewProduct?.price, viewProduct?.currency) }}
              </div>
              <div><strong>Categoría:</strong> {{ viewProduct?.category }}</div>
              <div><strong>Estado:</strong> {{ viewProduct?.estado }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addDialog" persistent>
      <q-card style="max-width: 700px; width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6 col">Nuevo producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProductForm
            v-model="newProduct"
            :negocio-id="negocioId"
            mode="add"
            @save="saveNew"
            @cancel="addDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="max-width: 700px; width: 100%">
        <q-card-section class="row items-center">
          <div class="text-h6 col">Editar producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <ProductForm
            v-model="editProduct"
            :negocio-id="negocioId"
            mode="edit"
            @save="saveEdit"
            @cancel="editDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import type { QTableColumn } from 'quasar';
import ProductForm from 'src/components/ProductForm.vue';
import { useAdminChangesStore } from 'src/stores/adminChanges';
import { supabase } from 'boot/supabase';
import { getBusinessId } from 'src/config/business';
import type { Product } from 'src/stores/types';

const products = ref<Product[]>([]);
const filter = ref('');
const changesStore = useAdminChangesStore();
const addDialog = ref(false);
const editDialog = ref(false);
const negocioId = getBusinessId();

const newProduct = ref<Product>({
  id: '',
  name: '',
  price: 0,
  category: '',
  image: '',
  new: false,
  oferta: false,
  estado: 'Disponible',
  subcategory: '',
  descuento: 0,
  descripcion: '',
  currency: 'CUP',
  negocio_id: negocioId,
});

const editProduct = ref<Product>({
  id: '',
  name: '',
  price: 0,
  category: '',
  image: '',
  new: false,
  oferta: false,
  estado: 'Disponible',
  subcategory: '',
  descuento: 0,
  descripcion: '',
  currency: 'CUP',
  negocio_id: negocioId,
});

const originalEditId = ref<string | null>(null);

const columns = <QTableColumn[]>[
  { name: 'image', label: 'Imagen', field: 'image', align: 'left' },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  {
    name: 'price',
    label: 'Precio',
    field: 'price',
    align: 'right',
    sortable: true,
    format: (v: number, row: Product) => formatPrice(v, row?.currency),
  },
  { name: 'category', label: 'Categoría', field: 'category', align: 'left', sortable: true },
  {
    name: 'subcategory',
    label: 'Subcategoría',
    field: 'subcategory',
    align: 'left',
  },
  { name: 'disponibilidad', label: 'Estado', field: 'estado', align: 'left' },
  { name: 'oferta', label: 'Oferta', field: 'oferta', align: 'left' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' },
];

const filteredProducts = computed(() => {
  const f = filter.value.trim().toLowerCase();
  if (!f) return products.value;
  return products.value.filter(
    (p) =>
      p.name?.toLowerCase().includes(f) ||
      p.id?.toLowerCase().includes(f) ||
      p.category?.toLowerCase().includes(f),
  );
});

const viewDialog = ref(false);
const viewProduct = ref<Product | null>(null);

function openView(row: Product) {
  viewProduct.value = { ...row };
  viewDialog.value = true;
}

function openAdd() {
  newProduct.value = {
    id: '',
    name: '',
    price: 0,
    category: '',
    image: '',
    new: false,
    oferta: false,
    estado: 'Disponible',
    subcategory: '',
    descuento: 0,
    descripcion: '',
    currency: 'CUP',
    negocio_id: negocioId,
  };
  addDialog.value = true;
}

function openEdit(row: Product) {
  editProduct.value = { ...row };
  originalEditId.value = row.id;
  editDialog.value = true;
}

function saveNew(product: Product) {
  const exists = products.value.find((p) => p.id === product.id);
  if (exists) {
    const idx = products.value.findIndex((p) => p.id === product.id);
    products.value[idx] = { ...product };
    changesStore.addUpdated({ id: product.id, name: product.name });
  } else {
    products.value.unshift({ ...product });
    changesStore.addAdded({ id: product.id, name: product.name });
  }
  addDialog.value = false;
}

const totalProducts = computed(() => products.value.length);
const availableCount = computed(
  () => products.value.filter((p) => p.estado === 'Disponible').length,
);
const offerCount = computed(() => products.value.filter((p) => p.oferta === true).length);

function saveEdit(product: Product) {
  const key = originalEditId.value ?? product.id;
  const idx = products.value.findIndex((p) => p.id === key);
  if (idx !== -1) {
    products.value[idx] = { ...product };
    changesStore.addUpdated({ id: product.id, name: product.name });
  }
  originalEditId.value = null;
  editDialog.value = false;
}

function formatPrice(val?: number, currency?: string) {
  if (val == null) return '';
  const curr = currency || 'CUP';
  return new Intl.NumberFormat(curr === 'USD' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: curr === 'USD' ? 2 : 0,
  }).format(val);
}

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('negocio_id', negocioId)
      .order('created_at', { ascending: false });
    if (data) {
      products.value = Array.isArray(data) ? data : [];
      changesStore.clear();
    }
  } catch (e) {
    console.error('Error cargando productos:', e);
  }
});
</script>

<style scoped>
stat-card {
  min-height: 120px;
  padding: 1rem;
}
</style>
