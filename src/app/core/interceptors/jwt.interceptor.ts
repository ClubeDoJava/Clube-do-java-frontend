import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Adiciona o token JWT aos cabeçalhos para requisições à API
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        const token = this.authService.getToken();

        // Log para depuração
        console.log(`[JwtInterceptor] Intercepting request to: ${request.url}`);
        console.log(`[JwtInterceptor] Is API URL: ${isApiUrl}`);
        console.log(`[JwtInterceptor] Token found: ${token ? 'Yes' : 'No'}`);

        if (isApiUrl && token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(`[JwtInterceptor] Token added to headers for: ${request.url}`);
        } else if (isApiUrl && !token) {
            console.warn(`[JwtInterceptor] Request to API (${request.url}) without a token.`);
        }

        return next.handle(request);
    }
}
