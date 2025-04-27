import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../core/models/product.model';
import { faShoppingCart, faPlus, faMinus, faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    product: Product | null = null;
    loading = true;
    error = false;
    selectedImage: string | null = null;
    relatedProducts: Product[] = [];
    addToCartForm: FormGroup;
    quantity: number = 1;

    // Ícones
    faShoppingCart = faShoppingCart;
    faPlus = faPlus;
    faMinus = faMinus;
    faHeart = faHeart; // Ícone de favorito (exemplo)

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder
    ) {
        this.addToCartForm = this.formBuilder.group({
            quantity: [1, [Validators.required, Validators.min(1)]],
            selectedSize: ['', Validators.required],
            selectedColor: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            this.loadProduct(id);
        });
    }

    loadProduct(id: number): void {
        this.loading = true;
        this.error = false;

        this.productService.getProductById(id).subscribe({
            next: (product) => {
                this.product = product;
                this.selectedImage = product.imageUrl;
                this.loading = false;

                // Carrega produtos relacionados da mesma categoria
                if (product.category && product.category.id) {
                    this.loadRelatedProducts(product.category.id, product.id);
                }

                // Configura validadores conforme opções disponíveis
                if (!product.availableSizes || product.availableSizes.length === 0) {
                    this.addToCartForm.get('selectedSize')?.clearValidators();
                    this.addToCartForm.get('selectedSize')?.updateValueAndValidity();
                }

                if (!product.availableColors || product.availableColors.length === 0) {
                    this.addToCartForm.get('selectedColor')?.clearValidators();
                    this.addToCartForm.get('selectedColor')?.updateValueAndValidity();
                }
            },
            error: (err) => {
                console.error('Error loading product', err);
                this.error = true;
                this.loading = false;
            }
        });
    }

    loadRelatedProducts(categoryId: number, currentProductId: number): void {
        this.productService.getProductsByCategory(categoryId).subscribe({
            next: (response) => {
                // Filtra produtos da mesma categoria, excluindo o produto atual
                this.relatedProducts = response.content
                    .filter(product => product.id !== currentProductId)
                    .slice(0, 4); // Limita a 4 produtos relacionados
            },
            error: (err) => {
                console.error('Error loading related products', err);
            }
        });
    }

    addToCart(): void {
        if (this.product) {
            // Preparar dados do item (sem quantity aqui)
            const itemData: Omit<CartItem, 'quantity'> = {
                productId: this.product.id,
                name: this.product.name,
                price: this.product.price,
                imageUrl: this.product.imageUrl // Ou a primeira imagem se houver galeria
            };
            // Passar dados e quantidade para o serviço
            this.cartService.addItem(itemData, this.quantity);
            this.toastr.success(`${this.quantity}x ${this.product.name} adicionado(s) ao carrinho!`);
            this.quantity = 1; // Resetar quantidade após adicionar
        } else {
            this.toastr.error('Não foi possível adicionar o produto ao carrinho.');
        }
    }

    setSelectedImage(imageUrl: string): void {
        this.selectedImage = imageUrl;
    }

    // Validação para estoque disponível
    isOutOfStock(): boolean {
        return this.product?.stockQuantity === 0;
    }

    // Validação para quantidade máxima
    isMaxQuantity(): boolean {
        const currentQuantity = this.addToCartForm.get('quantity')?.value || 0;
        return this.product ? currentQuantity >= this.product.stockQuantity : false;
    }

    // Controles de quantidade
    decreaseQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    increaseQuantity(): void {
        if (this.product && this.quantity < this.product.stockQuantity) {
            this.quantity++;
        }
    }

    // Exemplo: Adicionar aos favoritos
    addToWishlist(): void {
        if (this.product) {
            // Lógica para adicionar aos favoritos (ex: chamar um WishlistService)
            this.toastr.info(`${this.product.name} adicionado à lista de desejos (funcionalidade não implementada).`);
        }
    }
}
