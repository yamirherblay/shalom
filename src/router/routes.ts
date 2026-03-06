import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'tienda', name: 'tienda', component: () => import('pages/TiendaPage.vue') },
      { path: 'about', name: 'about', component: () => import('pages/AboutPage.vue') },
      { path: 'contact', name: 'contact', component: () => import('pages/ContactPage.vue') },
      { path: 'faq', name: 'faq', component: () => import('pages/FaqPage.vue') },
      {
        path: 'clothStore',
        name: 'clothStore',
        component: () => import('pages/ClothStorePage.vue'),
      },
      { path: 'zelle', name: 'Zelle', component: () => import('pages/ZellePage.vue') },
      {
        path: 'mayoristas',
        name: 'mayoristas',
        component: () => import('pages/MayoristaPage.vue'),
      },
      // Ruta de login de admin accesible públicamente
      //{ path: 'admin/login', name: 'admin-login', component: () => import('pages/LoginPage.vue'), meta: { public: true } },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/mvtexas/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin', component: () => import('pages/AdminPage.vue') },
      {
        path: 'clothes',
        name: 'admin-clothes',
        component: () => import('pages/ClothStoreAdmin.vue'),
      },
      /*  { path: 'mayorista', name: 'admin-mayorista', component: () => import('pages/AdminMayorista.vue') },*/
    ],
  },
  // Catch-all route goes to the same blank page for now
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
