import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'profile',
    title: 'Meu Perfil',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'orders',
    title: 'Meus Pedidos',
    loadComponent: () => import('./orders/order-list.component').then(c => c.OrderListComponent) // Assumindo que o componente de lista se chama OrderListComponent
  },
  // Adicionar outras rotas de usuário aqui (ex: endereços, detalhes do pedido)
  {
    path: '', // Rota padrão para /user redireciona para o perfil
    redirectTo: 'profile',
    pathMatch: 'full'
  }
]; 