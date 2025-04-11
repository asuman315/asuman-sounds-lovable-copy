
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
    title: product.title || product.name, // Use title if available, otherwise use name
    name: product.name || product.title, // Use name if available, otherwise use title
    description: product.description || "",
    price: product.price || 0,
    currency: product.currency || "USD", 
    original_price: product.original_price,
    comparable_price: product.comparable_price,
    stock_count: product.stock_count || 0,
    is_featured: product.is_featured || false,
    category: product.category,
    created_at: product.created_at,
    updated_at: product.updated_at,
    user_id: product.user_id,
    image_url: product.image_url,
  };
};
