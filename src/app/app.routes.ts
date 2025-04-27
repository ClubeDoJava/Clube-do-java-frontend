import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  // Rota para Home (Carrega HomeComponent diretamente)
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent)
    // loadChildren: () => import('./features/home/home.routes').then(r => r.HOME_ROUTES)
  },
  // Rota para Produtos (Lazy Loaded)
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(r => r.PRODUCTS_ROUTES)
  },
  // Rota para Autenticação (Lazy Loaded - usa o auth.routes.ts criado)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  // Rota para Carrinho (Lazy Loaded)
  // {
  //   path: 'cart',
  //   loadComponent: () => import('./features/cart/cart.component').then(c => c.CartComponent)
  // },
  // Rota para Checkout (Lazy Loaded e Protegida)
  // {
  //   path: 'checkout',
  //   loadComponent: () => import('./features/checkout/checkout.component').then(c => c.CheckoutComponent),
  //   // canActivate: [AuthGuard] // Aplicar guarda aqui ou na definição do provider
  // },
  // Rota para Área do Usuário (Lazy Loaded e Protegida)
  // {
  //   path: 'user',
  //   loadChildren: () => import('./features/user/user.routes').then(r => r.USER_ROUTES),
  //   // canActivate: [AuthGuard]
  // },
  // Rota Curinga (Página Não Encontrada)
  // {
  //   path: '404',
  //   loadComponent: () => import('./core/components/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)
  // },
  // {
  //   path: '**',
  //   redirectTo: '/404'
  // }

  // Rota padrão temporária para auth (REMOVIDA/COMENTADA)
  // {
  //   path: '',
  //   redirectTo: '/auth',
  //   pathMatch: 'full'
  // }
];

// Remover @NgModule e AppRoutingModule 