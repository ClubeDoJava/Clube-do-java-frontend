import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent // Carrega o componente standalone diretamente
  },
  {
    path: 'register',
    component: RegisterComponent // Carrega o componente standalone diretamente
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]; 