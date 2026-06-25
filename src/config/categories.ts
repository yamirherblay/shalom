export interface Category {
  key: string;
  label: string;
  icon: string;
}

export const defaultCategories: Category[] = [
  { key: 'all', label: 'Todos', icon: 'fa-solid fa-grid-2' },
  { key: 'Carpinteria', label: 'Carpinteria', icon: 'fa-solid fa-hammer' },
  { key: 'herramientas', label: 'Herramientas', icon: 'fa-solid fa-tools' },
  { key: 'pintura', label: 'Pintura', icon: 'fa-solid fa-paint-roller' },
  { key: 'electricidad', label: 'Electricidad', icon: 'fa-solid fa-bolt' },
  { key: 'plomeria', label: 'Plomería', icon: 'fa-solid fa-droplet' },
  { key: 'construccion', label: 'Construcción', icon: 'fa-solid fa-hard-hat' },
  { key: 'jardin', label: 'Jardín', icon: 'fa-solid fa-seedling' },
  { key: 'seguridad', label: 'Seguridad', icon: 'fa-solid fa-shield' },
];
