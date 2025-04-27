import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCardComponent // Importa o card de produto
  ],
  templateUrl: './home.component.html',
  // styleUrls: ['./home.component.scss'] // Adicionar se tiver estilos específicos
})
export class HomeComponent implements OnInit {

  products$: Observable<Product[]> = EMPTY;
  errorMessage: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.productService.getAllProducts()
      .pipe(
        catchError(error => {
          console.error('Error fetching products in pages/home', error);
          this.errorMessage = 'Erro ao carregar produtos. Tente novamente mais tarde.';
          return EMPTY;
        })
      );
  }
} 