import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]> = EMPTY;
  errorMessage: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Aqui chamaremos o serviço para buscar TODOS os produtos
    // Usaremos o método simples por enquanto, mas o ideal seria usar paginação aqui
    this.products$ = this.productService.getAllProducts()
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar lista de produtos:', error);
          this.errorMessage = 'Erro ao carregar a lista de produtos. Tente novamente.';
          return EMPTY;
        })
      );
  }
}
