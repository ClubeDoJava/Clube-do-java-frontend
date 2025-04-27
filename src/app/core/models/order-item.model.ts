export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    totalPrice: number;
    selectedSize?: string;
    selectedColor?: string;
}