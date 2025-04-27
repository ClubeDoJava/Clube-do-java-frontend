import {Product} from "./product.model";

export interface CartItem {
    id: number;
    productId: number;
    product?: Product;
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedColor?: string;
}