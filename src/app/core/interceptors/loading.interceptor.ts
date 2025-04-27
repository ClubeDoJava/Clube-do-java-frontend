import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private activeRequests = 0;

    constructor(private spinnerService: NgxSpinnerService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Incrementa o contador de requisições ativas
        if (this.activeRequests === 0) {
            this.spinnerService.show();
        }

        this.activeRequests++;

        return next.handle(request).pipe(
            finalize(() => {
                // Decrementa o contador de requisições ativas
                this.activeRequests--;

                // Esconde o spinner se não houver mais requisições ativas
                if (this.activeRequests === 0) {
                    this.spinnerService.hide();
                }
            })
        );
    }
}