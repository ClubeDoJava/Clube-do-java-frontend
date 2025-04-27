import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

// Interface genérica para representar a resposta paginada do Spring Boot
export interface Page<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    // Método para obter a resposta paginada COMPLETA
    getProductsPaginated(page: number = 0, size: number = 12, sort: string = ''): Observable<Page<Product>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        if (sort) {
             params = params.set('sort', sort);
        }
        // Espera a resposta como Page<Product>
        return this.http.get<Page<Product>>(this.apiUrl, { params });
    }

    // Método que retorna APENAS o array de produtos da primeira página (se necessário)
    // Poderia ser usado onde não precisamos de paginação explícita por enquanto
    getAllProducts(): Observable<Product[]> {
        // Chama o método paginado e extrai o content
        return this.getProductsPaginated(0, 20) // Buscar uma página (ex: 20 itens)
            .pipe(
                map(response => response.content) // Extrai apenas o array 'content'
            );
    }

    getProductsByCategory(categoryId: number, page: number = 0, size: number = 12): Observable<Page<Product>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        // Este endpoint precisa existir no backend e retornar Page<Product>
        return this.http.get<Page<Product>>(`${this.apiUrl}/category/${categoryId}`, { params });
    }

    getProductById(id: number): Observable<Product> {
        // Este método geralmente retorna um único produto, não uma página
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    /* Comentando método temporariamente, ajustar se for reativado
    getFeaturedProducts(): Observable<Page<Product>> { 
        return this.http.get<Page<Product>>(`${this.apiUrl}/featured`);
    }
    */

    searchProducts(keyword: string, page: number = 0, size: number = 12): Observable<Page<Product>> {
        let params = new HttpParams()
            .set('keyword', keyword)
            .set('page', page.toString())
            .set('size', size.toString());
        // Este endpoint precisa existir no backend e retornar Page<Product>
        return this.http.get<Page<Product>>(`${this.apiUrl}/search`, { params });
    }
}