import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { Address } from '../models/address.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/me`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    updateUser(id: number, userData: any): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, userData)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    getUserAddresses(): Observable<Address[]> {
        return this.http.get<Address[]>(`${this.apiUrl}/me/addresses`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    addAddress(addressData: any): Observable<Address> {
        return this.http.post<Address>(`${this.apiUrl}/me/addresses`, addressData)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    updateAddress(addressId: number, addressData: any): Observable<Address> {
        return this.http.put<Address>(`${this.apiUrl}/me/addresses/${addressId}`, addressData)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    deleteAddress(addressId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/me/addresses/${addressId}`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }
}
