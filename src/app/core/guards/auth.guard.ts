import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuthenticated()) {
            // Verifica se o usuário está autenticado
            return true;
        }

        // Redireciona para a página de login com a URL de retorno
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}