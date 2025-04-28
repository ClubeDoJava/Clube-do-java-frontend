import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ShippingOption } from '../models/shipping-option.model';

export interface ShippingCalculationRequest {
  destinationZipCode: string;
  cartItems: { productId: number; quantity: number; weight: number; /* Outras dimensões se necessário */ }[];
}

@Injectable({
    providedIn: 'root'
})
export class ShippingService {
    private apiUrl = `${environment.apiUrl}/shipping`;

    constructor(private http: HttpClient) { }

    calculateShipping(requestData: ShippingCalculationRequest): Observable<ShippingOption[]> {
        return this.http.post<ShippingOption[]>(`${this.apiUrl}/calculate`, requestData);
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
