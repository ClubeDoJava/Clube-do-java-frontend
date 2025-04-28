import {Category} from "./category.model";

export interface Product {
    id: number;
    sku?: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    additionalImages?: string[];
    category?: Category;
    featured: boolean;
    availableSizes?: string[];
    availableColors?: string[];
    weight: number;
    createdAt: Date;
    updatedAt?: Date;
}