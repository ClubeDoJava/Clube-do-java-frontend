import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '', // Rota raiz de /products
    loadComponent: () => import('./product-list/product-list.component').then(c => c.ProductListComponent)
  },
  // {
  //   path: ':id', // Rota para detalhes do produto (ex: /products/123)
  //   loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent)
  // },
  // Adicionar outras rotas relacionadas a produtos se necessário
]; 