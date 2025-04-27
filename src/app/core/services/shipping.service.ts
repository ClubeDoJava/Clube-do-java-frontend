import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ShippingOption } from '../models/shipping-option.model';

@Injectable({
    providedIn: 'root'
})
export class ShippingService {
    private apiUrl = `${environment.apiUrl}/shipping`;

    constructor(private http: HttpClient) { }

    calculateShipping(shippingData: any): Observable<ShippingOption[]> {
        return this.http.post<ShippingOption[]>(`${this.apiUrl}/calculate`, shippingData)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    getTracking(trackingNumber: string, carrier: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/tracking/${trackingNumber}?carrier=${carrier}`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }
}
