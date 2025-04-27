import {Address} from "./address.model";

export interface User {
    id: number;
    name: string;
    email: string;
    cpfCnpj?: string;
    phone?: string;
    roles: string[];
    addresses?: Address[];
    createdAt: Date;
    updatedAt?: Date;
    lastLogin?: Date;
}