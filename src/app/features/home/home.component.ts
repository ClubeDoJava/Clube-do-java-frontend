import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { PaginatedResponse } from '../../core/models/paginated-response.model';
import { Observable, EMPTY } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ProductCardComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    featuredProducts: Product[] = [];
    categories: Category[] = [];
    loadingProducts = true;
    loadingCategories = true;
    errorProducts = false;
    errorCategories = false;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.loadFeaturedProducts();
        this.loadCategories();
    }

    loadFeaturedProducts(): void {
        this.loadingProducts = true;
        this.errorProducts = false;
        this.productService.getAllProducts()
            .pipe(
                take(1),
                catchError((error: any) => {
                    console.error('Error fetching featured products', error);
                    this.errorProducts = true;
                    this.loadingProducts = false;
                    return EMPTY;
                })
            )
            .subscribe({
                next: (products: Product[]) => {
                    this.featuredProducts = products.slice(0, 4);
                    this.loadingProducts = false;
                }
            });
    }

    loadCategories(): void {
        this.loadingCategories = true;
        this.errorCategories = false;
        this.categoryService.getCategories()
            .pipe(
                take(1),
                catchError((error: any) => {
                    console.error('Error fetching categories', error);
                    this.errorCategories = true;
                    this.loadingCategories = false;
                    return EMPTY;
                })
            )
            .subscribe({
                next: (categories: Category[]) => {
                    this.categories = categories;
                    this.loadingCategories = false;
                }
            });
    }
}
