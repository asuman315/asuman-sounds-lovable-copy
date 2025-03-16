
export interface Product {
  id: string;
  title?: string;  // Make title optional for compatibility
  name?: string;   // Add name field from Supabase
  description: string;
  price: number;
  currency?: string;
  original_price?: number;
  comparable_price?: number;
  stock_count?: number;
  is_featured?: boolean;
  category?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  image_url?: string; // For Supabase compatibility
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id?: string;
  image_url: string;
  is_main?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string; // Make description optional
}

// Helper function to adapt Supabase product to our Product interface
export const adaptSupabaseProduct = (product: any): Product => {
  return {
    id: product.id,
    title: product.name, // Map name to title for UI compatibility
    name: product.name,
    description: product.description,
    price: product.price,
    currency: "USD", // Default currency
    stock_count: 0,   // Default stock count
    is_featured: false, // Default is_featured
    created_at: product.created_at,
    updated_at: product.updated_at,
    image_url: product.image_url,
  };
};
