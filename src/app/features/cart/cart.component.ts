import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, Cart, CartItem } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    cart$: Observable<Cart>;
    isLoading = false;

    // Ícones
    faTrashAlt = faTrashAlt;
    faPlus = faPlus;
    faMinus = faMinus;

    constructor(
        private cartService: CartService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.cart$ = this.cartService.cart$;
    }

    ngOnInit(): void {
    }

    updateQuantity(item: CartItem, change: number): void {
        const newQuantity = item.quantity + change;
        if (newQuantity >= 1) {
            this.cartService.updateItemQuantity(item.productId, newQuantity);
        } else {
            this.removeItem(item.productId);
        }
    }

    removeItem(itemId: number): void {
        if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
            this.cartService.removeItem(itemId);
            this.toastr.success('Item removido do carrinho.');
        }
    }

    clearCart(): void {
        if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
            this.cartService.clearCart();
            this.toastr.success('Carrinho esvaziado.');
        }
    }

    goToCheckout(cart: Cart | null): void {
        if (cart && cart.items.length > 0) {
            this.router.navigate(['/checkout']);
        } else {
            this.toastr.warning('Seu carrinho está vazio.');
        }
    }
}