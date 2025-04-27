import {CartItem} from "./cart-item.model";

export interface Cart {
    id: number;
    items: CartItem[];
    subtotal: number;
    totalItems: number;
}