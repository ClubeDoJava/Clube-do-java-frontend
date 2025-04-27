import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    getCategoryById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }

    getSubcategories(parentId: number): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/${parentId}/subcategories`)
            .pipe(
                catchError(error => {
                    return throwError(() => error);
                })
            );
    }
}