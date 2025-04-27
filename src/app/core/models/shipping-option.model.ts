export interface ShippingOption {
    code: string;
    name: string;
    carrier: string;
    price: number;
    deliveryTimeInDays: number;
    estimatedDelivery: Date;
}