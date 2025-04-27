export interface Address {
    id: number;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    defaultAddress: boolean;
    addressType: string; // 'SHIPPING', 'BILLING', 'BOTH'
}