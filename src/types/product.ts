
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  category: string;
  inStock: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  createdAt: string;
  colors?: string[];
  specs?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
}
