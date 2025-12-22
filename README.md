# MercadoTexas App

Tienda online construida con Quasar + Vue 3 + TypeScript para listar productos por categorías y permitir solicitudes rápidas vía WhatsApp.

- Inicio con hero, categorías y barra de marquesina reutilizable.
- Tienda general y tienda de Ropa/Beauty con filtros por categoría.
- Tarjetas de producto con precio formateado y enlace a WhatsApp (mensaje prellenado con enlace a la imagen).

## Requisitos
- Node.js 18+
- Yarn o NPM
- Quasar CLI (se usa a través de los scripts o `quasar` global)

## Instalación
```bash
yarn
# o
npm install
```

## Desarrollo
```bash
# usando Quasar local
quasar dev
# alternativas
yarn quasar dev
# o
npm run dev
```

## Linter y Formato
```bash
yarn lint
# o
npm run lint

yarn format
# o
npm run format
```

## Build de producción
```bash
quasar build
```
El contenido de `public/` se sirve tal cual en producción.

## Estructura relevante
```
mercadoTex/
├─ public/
│  ├─ data/
│  │  └─ clothes.json                 # Catálogo de productos
│  └─ images/                         # Imágenes públicas (logo, categorías, productos)
│     ├─ Sabrinallogo.jpeg
│     └─ clothes/
│        ├─ Beauty/
│        └─ Shoes/
├─ src/
│  ├─ components/
│  │  ├─ ClothesCard.vue              # Tarjeta de producto + WhatsApp
│  │  └─ MarqueeBar.vue               # Barra de marquesina reutilizable
│  └─ pages/
│     ├─ IndexPage.vue                # Home: hero, categorías, marquesina con botón
│     ├─ ClothStorePage.vue           # Tienda Ropa/Beauty con chips + marquesina
│     └─ TiendaPage.vue               # Tienda general (otras categorías)
└─ README.md
```

## Datos de productos (public/data/clothes.json)
El frontend consume `GET /data/clothes.json`. Es un arreglo JSON de objetos con las siguientes propiedades:
- id (string, requerido): identificador único/slug (sin espacios, minúsculas, guiones).
- name (string, requerido): nombre mostrado en la tarjeta.
- price (number, requerido): precio en CUP.
- image (string, recomendado): ruta pública de la imagen; normalmente empieza con "/images/...".
- oferta (boolean, opcional): si es oferta muestra un badge "Oferta".
- estado (string, opcional): estado del producto (p. ej. "Disponible").
- shortDescription (string, opcional): descripción breve (2 líneas máx.).
- category (string, recomendado): clave de categoría para el filtrado.

Ejemplo:
```json
{
  "id": "lentes-gucci-6500",
  "name": "Lentes Gucci",
  "price": 6500,
  "image": "/images/clothes/Beauty/Lentes Gucci 6500.jpeg",
  "oferta": false,
  "estado": "Disponible",
  "category": "belleza",
  "shortDescription": "Un look a la moda"
}
```
Notas:
- Mantén JSON válido (sin comas colgantes, comillas dobles, etc.).
- Las rutas son sensibles a mayúsculas/minúsculas según el hosting.

## Cómo agregar o actualizar productos
1) Copia la imagen a `public/images/clothes/<Subcarpeta opcional>/`.
   - Ej.: `public/images/clothes/Beauty/Mascarillas Faciales 1200.jpeg`.
2) Edita `public/data/clothes.json` y añade/actualiza un objeto con:
   - id: slug único (recomendado: nombre + precio si va en el archivo).
   - name: nombre visible.
   - price: número en CUP.
   - image: ruta pública que empiece por `/images/...` apuntando al archivo en `public/images/...`.
   - category: clave simple coherente (ej.: "belleza", "Lenceria", "calzado").
   - oferta, estado, shortDescription: opcionales.
3) Guarda y prueba en desarrollo. Para ver en producción, vuelve a desplegar.

Sugerencia cuando el precio está en el nombre del archivo (p. ej. "Lentes Gucci 6500.jpeg"):
- Usa ese número para `price` y añádelo al `id` (ej. `lentes-gucci-6500`). Esto es manual (no automático).

## Filtros por categoría (ClothStorePage)
- La página de Ropa/Beauty construye las categorías a partir de `category` en el JSON y muestra chips.
- Siempre hay un chip "Todas".
- Se soporta navegación por query string: `?cat=<clave>` (ej.: `/clothStore?cat=belleza`).

## Categorías en la Home (IndexPage)
- El grid de categorías se define en `IndexPage.vue` en el array `categories`.
- Al hacer click:
  - Si `key === 'Ropa'` navega a `/clothStore`.
  - En otros casos navega a `/tienda?cat=<key>`.
- Para cambiar imágenes/etiquetas, edita ese arreglo.

## Barra de Marquesina reutilizable (src/components/MarqueeBar.vue)
Props:
- message: string (requerido)
- showButton?: boolean
- buttonLabel?: string
- absolute?: boolean (para posicionamiento absoluto como en el hero de Home)

Eventos:
- button-click: emitido al pulsar el botón.

Ejemplos:
```vue
<!-- En IndexPage (posición absoluta + botón que abre modal) -->
<MarqueeBar
  absolute
  :show-button="true"
  message="Formas de Pago: Zelle (Tasa Cambio Vigente) Moneda Nacional y Transferencias- "
  button-label="-GRAN RIFA PARA EL 24 de DICIEMBRE-"
  @button-click="showMarqueeModal = true"
/>

<!-- En ClothStorePage (debajo de chips, sin botón) -->
<MarqueeBar message="Vísitanos y encontrarás esto y MUCHO MÁS..." />
```

## WhatsApp: cómo se genera el mensaje
- `ClothesCard.vue` arma un texto con:
  - saludo y datos del producto
  - URL ABSOLUTA de la imagen para intentar vista previa en WhatsApp
- Se abre `https://wa.me/<NUMERO>?text=<MENSAJE>` en una nueva pestaña.
- Cambia el número en la constante `WHATSAPP_NUMBER` dentro de `ClothesCard.vue`.
- Importante: desde la web no se pueden adjuntar imágenes automáticamente; solo texto y enlaces. Para adjuntos reales se requiere WhatsApp Business API (backend).

## Imágenes y rutas
- Logo en `ClothStorePage.vue`: `src="images/Sabrinallogo.jpeg"` (ruta relativa para funcionar también en subrutas).
- En el JSON, normalmente se usan rutas con prefijo `/images/...` porque `public/` se sirve desde la raíz del host.

## Buenas prácticas
- Mantén IDs estables y únicos.
- Sé consistente con las categorías (misma clave, mismo casing) para no fragmentar filtros.
- Optimiza imágenes (preferir `.webp` cuando sea posible) y evita nombres problemáticos.

## Solución de problemas
- “No se ven imágenes”: verifica ruta, existencia y mayúsculas/minúsculas. Prueba abrir la URL directa.
- “No aparecen nuevos productos”: valida el JSON, limpia caché del navegador y asegura redeploy en producción.
- “No filtra por categoría”: revisa que `category` en los objetos coincida exactamente con las claves esperadas.
- “WhatsApp sin vista previa de imagen”: depende de WhatsApp; asegúrate de enviar URL absoluta pública.

## Licencia
Uso interno de Mercado Variado Texas LLC.
