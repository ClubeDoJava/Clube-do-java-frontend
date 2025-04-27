import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Definir interfaces básicas para o Carrinho (se não existirem em models/)
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSubject = new BehaviorSubject<Cart>({ items: [], totalQuantity: 0, totalPrice: 0 });
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  get itemCount$(): Observable<number> {
    return this.cart$.pipe(
      map(cart => cart.totalQuantity)
    );
  }

  addItem(itemData: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
    const currentCart = this.cartSubject.getValue();
    const existingItemIndex = currentCart.items.findIndex(item => item.productId === itemData.productId);

    let updatedItems;
    if (existingItemIndex > -1) {
      updatedItems = [...currentCart.items];
      const existingItem = updatedItems[existingItemIndex];
      updatedItems[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + quantity };
    } else {
      const newItem: CartItem = { ...itemData, quantity };
      updatedItems = [...currentCart.items, newItem];
    }
    this.updateCartState(updatedItems);
  }

  removeItem(productId: number): void {
    const currentCart = this.cartSubject.getValue();
    const updatedItems = currentCart.items.filter(item => item.productId !== productId);
    this.updateCartState(updatedItems);
  }

  updateItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.getValue();
    const updatedItems = currentCart.items.map(item =>
      item.productId === productId ? { ...item, quantity: quantity } : item
    ).filter(item => item.quantity > 0);
    this.updateCartState(updatedItems);
  }

  clearCart(): void {
    this.updateCartState([]);
  }

  private updateCartState(items: CartItem[]): void {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newCart: Cart = { items, totalQuantity, totalPrice };
    this.cartSubject.next(newCart);
    this.saveCartToLocalStorage(newCart);
  }

  private saveCartToLocalStorage(cart: Cart): void {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Erro ao salvar carrinho no localStorage", e);
    }
  }

  private loadCartFromLocalStorage(): void {
    try {
      const savedCartJson = localStorage.getItem('cart');
      if (savedCartJson) {
        const savedCart: Cart = JSON.parse(savedCartJson);
        if (savedCart && Array.isArray(savedCart.items)) {
           this.cartSubject.next(savedCart);
        } else {
            localStorage.removeItem('cart');
             this.cartSubject.next({ items: [], totalQuantity: 0, totalPrice: 0 });
        }
      } else {
        this.cartSubject.next({ items: [], totalQuantity: 0, totalPrice: 0 });
      }
    } catch (e) {
      console.error("Erro ao carregar/parsear carrinho do localStorage", e);
      localStorage.removeItem('cart');
       this.cartSubject.next({ items: [], totalQuantity: 0, totalPrice: 0 });
    }
  }
}
