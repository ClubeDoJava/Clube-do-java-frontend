import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, Cart } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../../core/models/user.model';
import { Address } from '../../core/models/address.model';
import { HttpErrorResponse } from '@angular/common/http';

interface PaymentInfo { method: string; details?: any; }

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    cart$: Observable<Cart>;
    checkoutForm: FormGroup;
    user$: Observable<User | null>;
    addresses: Address[] = [];
    selectedAddress: Address | null = null;
    paymentMethod: string | null = null;
    paymentResponse: any = null;
    isLoading = false;
    isPlacingOrder = false;

    constructor(
        private fb: FormBuilder,
        private cartService: CartService,
        private orderService: OrderService,
        private userService: UserService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.cart$ = this.cartService.cart$;
        this.user$ = this.userService.getCurrentUser().pipe(
            tap((user: User | null) => {
                this.addresses = user?.addresses ?? [];
                if (this.addresses.length > 0) {
                    this.selectedAddress = this.addresses.find(a => a.defaultAddress) || this.addresses[0];
                    this.checkoutForm?.get('addressId')?.setValue(this.selectedAddress.id);
                }
            })
        );

        this.checkoutForm = this.fb.group({
            addressId: [null, Validators.required],
            paymentMethod: ['pix', Validators.required]
        });
    }

    ngOnInit(): void {
        this.checkoutForm.get('addressId')?.valueChanges.subscribe(id => {
            this.selectedAddress = this.addresses.find(a => a.id === id) || null;
        });

        this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
            this.paymentMethod = method;
            this.paymentResponse = null;
        });
    }

    placeOrder(): void {
        if (this.checkoutForm.invalid) {
            this.toastr.error('Por favor, selecione um endereço de entrega.');
            this.checkoutForm.markAllAsTouched();
            return;
        }

        const addressId = this.checkoutForm.value.addressId;
        const paymentMethod = this.checkoutForm.value.paymentMethod;

        this.isPlacingOrder = true;

        this.orderService.createOrder({ addressId, paymentMethod }).subscribe({
            next: (order) => {
                this.toastr.success(`Pedido #${order.id} criado com sucesso! Iniciando pagamento...`);
                this.initiatePayment(order.id, paymentMethod);
            },
            error: (err: HttpErrorResponse) => {
                this.isPlacingOrder = false;
                this.toastr.error(err.error?.message || 'Erro ao criar o pedido.');
                console.error('Order creation error:', err);
            }
        });
    }

    initiatePayment(orderId: number, method: string): void {
        this.orderService.initiatePayment(orderId, method).subscribe({
            next: (paymentRes: any) => {
                this.isPlacingOrder = false;
                this.paymentResponse = paymentRes;
                this.toastr.info('Pagamento iniciado. Siga as instruções abaixo.');
                this.cartService.clearCart();
            },
            error: (err: HttpErrorResponse) => {
                this.isPlacingOrder = false;
                this.paymentResponse = null;
                this.toastr.error(err.error?.message || 'Erro ao iniciar o pagamento.');
                console.error('Payment initiation error:', err);
            }
        });
    }
}
