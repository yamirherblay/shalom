export interface Category {
  key: string;
  label: string;
  image?: string;
}

export const defaultCategories: Category[] = [
  { key: 'all', label: 'Todos' },
  { key: 'productos', label: 'Productos' },
  { key: 'ofertas', label: 'Ofertas' },
];
