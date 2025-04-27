import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getOrders(page: number = 0, size: number = 10): Observable<PaginatedResponse<Order>> {
        return this.http.get<PaginatedResponse<Order>>(`${this.apiUrl}?page=${page}&size=${size}`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    createOrder(orderData: { addressId: number; paymentMethod: string; /* shippingOptionId?: number */ }): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, orderData);
    }

    cancelOrder(id: number): Observable<Order> {
        return this.http.patch<Order>(`${this.apiUrl}/${id}/cancel`, {})
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    getOrderByTrackingNumber(trackingNumber: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/tracking/${trackingNumber}`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    initiatePayment(orderId: number, method: string): Observable<any> {
        console.log(`Iniciando pagamento ${method} para pedido ${orderId}`);

        if (method === 'pix') {
            return of({ 
                paymentId: 'pay_123pix', 
                status: 'PENDING', 
                qrCode: '000201263...EXAMPLE...',
                qrCodeText: 'COPIA E COLA PIX...'
            }); 
        } else if (method === 'boleto') {
            return of({ 
                paymentId: 'pay_456boleto', 
                status: 'PENDING', 
                barcode: '12345.67890 12345.678901 12345.678902 1 12345678901234',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        } else {
            return of({ error: 'Método de pagamento inválido' });
        }
    }
}
