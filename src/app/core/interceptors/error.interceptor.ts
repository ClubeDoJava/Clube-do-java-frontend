import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Auto logout se retornar 401 (não autorizado)
                    this.authService.logout();
                    this.router.navigate(['/login']);
                    this.toastr.error('Sua sessão expirou. Por favor, faça login novamente.');
                } else if (error.status === 403) {
                    this.toastr.error('Você não tem permissão para acessar este recurso.');
                    this.router.navigate(['/']);
                } else if (error.status === 404) {
                    this.toastr.error('O recurso solicitado não foi encontrado.');
                } else if (error.status >= 500) {
                    this.toastr.error('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.');
                }

                // Retorna o erro para ser tratado pelo componente
                return throwError(() => error);
            })
        );
    }
}
