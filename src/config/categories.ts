export interface Category {
  key: string;
  label: string;
  icon: string;
}

export const defaultCategories: Category[] = [
  { key: 'all', label: 'Todos', icon: 'fa-solid fa-grid-2' },
  { key: 'alimentos', label: 'Alimentos', icon: 'fa-solid fa-apple-whole' },
  { key: 'bebidas', label: 'Bebidas', icon: 'fa-solid fa-mug-saucer' },
  { key: 'aseo', label: 'Aseo Personal', icon: 'fa-solid fa-hand-sparkles' },
  { key: 'limpieza', label: 'Limpieza', icon: 'fa-solid fa-soap' },
  { key: 'hogar', label: 'Hogar', icon: 'fa-solid fa-couch' },
  { key: 'variado', label: 'Variedades', icon: 'fa-solid fa-gift' },
];
