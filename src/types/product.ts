
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  original_price?: number;
  comparable_price?: number;
  stock_count: number;
  is_featured: boolean;
  category: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
}
