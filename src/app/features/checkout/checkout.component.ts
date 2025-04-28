import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, Cart, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { ShippingService, ShippingCalculationRequest } from '../../core/services/shipping.service';
import { ShippingOption } from '../../core/models/shipping-option.model';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, combineLatest, of } from 'rxjs';
import { switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { User } from '../../core/models/user.model';
import { Address } from '../../core/models/address.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface PaymentInfo { method: string; details?: any; }

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
    cart: Cart | null = null;
    checkoutForm: FormGroup;
    user$: Observable<User | null>;
    addresses: Address[] = [];
    selectedAddress: Address | null = null;
    shippingOptions: ShippingOption[] = [];
    selectedShipping: ShippingOption | null = null;
    paymentMethod: string | null = null;
    paymentResponse: any = null;
    isLoadingUser = true;
    isLoadingShipping = false;
    isPlacingOrder = false;

    private cartSubscription: Subscription | null = null;
    private addressChangeSubscription: Subscription | null | undefined = null;

    constructor(
        private fb: FormBuilder,
        private cartService: CartService,
        private orderService: OrderService,
        private userService: UserService,
        private shippingService: ShippingService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.user$ = this.userService.getCurrentUser().pipe(
            tap((user: User | null) => {
                this.isLoadingUser = false;
                this.addresses = user?.addresses ?? [];
                if (this.addresses.length > 0) {
                    const defaultAddress = this.addresses.find(a => a.defaultAddress) || this.addresses[0];
                    this.checkoutForm?.get('addressId')?.setValue(defaultAddress.id, { emitEvent: false });
                    this.selectedAddress = defaultAddress;
                }
            }),
            catchError(err => {
                this.isLoadingUser = false;
                this.toastr.error('Erro ao carregar dados do usuário.');
                console.error('User loading error:', err);
                return of(null);
            })
        );

        this.checkoutForm = this.fb.group({
            addressId: [null, Validators.required],
            shippingOptionCode: [null, Validators.required],
            paymentMethod: ['pix', Validators.required]
        });
    }

    ngOnInit(): void {
        this.cartSubscription = this.cartService.cart$.subscribe(cart => {
            this.cart = cart;
            if (cart.items.length === 0 && !this.isPlacingOrder) {
                this.toastr.info('Seu carrinho está vazio. Redirecionando...');
                this.router.navigate(['/products']);
            } else if (this.selectedAddress && cart.items.length > 0) {
                this.getShippingOptions();
            }
        });

        this.addressChangeSubscription = this.checkoutForm.get('addressId')?.valueChanges.subscribe(id => {
            this.selectedAddress = this.addresses.find(a => a.id === id) || null;
            this.shippingOptions = [];
            this.selectedShipping = null;
            this.checkoutForm.get('shippingOptionCode')?.reset(null, { emitEvent: false });
            if (this.selectedAddress && this.cart && this.cart.items.length > 0) {
                this.getShippingOptions();
            }
        });

        this.checkoutForm.get('shippingOptionCode')?.valueChanges.subscribe(code => {
            this.selectedShipping = this.shippingOptions.find(opt => opt.code === code) || null;
        });

        this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
            this.paymentMethod = method;
            this.paymentResponse = null;
        });
    }

    ngOnDestroy(): void {
        this.cartSubscription?.unsubscribe();
        this.addressChangeSubscription?.unsubscribe();
    }

    getShippingOptions(): void {
        if (!this.selectedAddress || !this.cart || this.cart.items.length === 0) {
            return;
        }
        this.isLoadingShipping = true;
        this.shippingOptions = [];
        this.selectedShipping = null;
        this.checkoutForm.get('shippingOptionCode')?.disable({ emitEvent: false });

        const requestData: ShippingCalculationRequest = {
            destinationZipCode: this.selectedAddress.zipCode,
            cartItems: this.cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                weight: 0.5
            }))
        };

        this.shippingService.calculateShipping(requestData).pipe(
            finalize(() => {
                this.isLoadingShipping = false;
                this.checkoutForm.get('shippingOptionCode')?.enable({ emitEvent: false });
            })
        ).subscribe({
            next: (options) => {
                this.shippingOptions = options;
                if (options.length > 0) {
                } else {
                    this.toastr.warning('Nenhuma opção de frete encontrada para este endereço.');
                }
            },
            error: (err) => {
                this.toastr.error('Erro ao calcular o frete.');
                console.error('Shipping calculation error:', err);
                this.shippingOptions = [];
            }
        });
    }

    placeOrder(): void {
        if (this.checkoutForm.invalid) {
            this.toastr.error('Por favor, preencha todos os campos obrigatórios (endereço, frete). ');
            this.checkoutForm.markAllAsTouched();
            return;
        }

        const { addressId, shippingOptionCode, paymentMethod } = this.checkoutForm.value;
        if (!this.selectedShipping) {
            this.toastr.error('Erro interno: Opção de frete selecionada inválida.');
            return;
        }

        this.isPlacingOrder = true;

        const orderData = {
            addressId: addressId,
            paymentMethod: paymentMethod,
            shippingMethod: this.selectedShipping.name,
            shippingCost: this.selectedShipping.price
        };

        this.orderService.createOrder(orderData).subscribe({
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

    copyToClipboard(inputElement: HTMLInputElement): void {
        if (!navigator.clipboard) {
            this.toastr.error('Seu navegador não suporta a cópia para a área de transferência.');
            return;
        }
        navigator.clipboard.writeText(inputElement.value).then(() => {
            this.toastr.success('Código copiado para a área de transferência!');
        }).catch(err => {
            this.toastr.error('Falha ao copiar o código.');
            console.error('Clipboard copy error:', err);
        });
    }
}
