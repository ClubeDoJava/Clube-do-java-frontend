import {Address} from "./address.model";
import {OrderStatus} from "./order-status.enum";
import {OrderItem} from "./order-item.model";

export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    userEmail: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: Address;
    billingAddress: Address;
    createdAt: Date;
    updatedAt?: Date;
    completedAt?: Date;
    trackingNumber?: string;
    paymentMethod?: string;
}