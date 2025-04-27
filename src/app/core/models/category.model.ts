export interface Category {
    id: number;
    name: string;
    description?: string;
    parent?: Category;
    imageUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}
