# Ecommerce Scaffolding

Plantilla genérica para catálogos online con Quasar + Vue 3 + TypeScript + Supabase.

## Setup

```bash
# 1. Instalar dependencias
yarn

# 2. Crear archivo .env
cp .env.example .env

# 3. Editar .env con tus credenciales
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_NEGOCIO_ID
# - VITE_WHATSAPP_NUMBER

# 4. Configurar branding en src/config/branding.ts

# 5. Configurar categorías en src/config/categories.ts

# 6. Ejecutar en desarrollo
yarn dev
```

## Configuración

### src/config/branding.ts

```typescript
export const branding = {
  name: 'Mi Negocio',
  logo: '/images/logo.svg',
  // ...
};
```

### src/config/categories.ts

```typescript
export const defaultCategories = [
  { key: 'all', label: 'Todos' },
  { key: 'productos', label: 'Productos' },
];
```

## Base de Datos

Tabla `products` requerida:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id UUID NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  category TEXT,
  subcategory TEXT,
  estado TEXT DEFAULT 'Disponible',
  oferta BOOLEAN DEFAULT false,
  descuento NUMERIC,
  descripcion TEXT,
  new BOOLEAN DEFAULT false,
  currency TEXT DEFAULT 'CUP',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_negocio ON products(negocio_id);
```

## Rutas

- `/` - Página principal
- `/catalogo` - Catálogo de productos
- `/contacto` - Página de contacto
- `/acerca` - Acerca de nosotros
- `/admin` - Panel de administración

## Desarrollo

```bash
yarn dev      # Desarrollo
yarn build    # Build producción
yarn lint     # Linter
```
