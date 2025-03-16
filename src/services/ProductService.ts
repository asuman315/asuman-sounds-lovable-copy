
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductImage, Category, adaptSupabaseProduct } from "@/types/product";
import { products as mockProducts } from "@/data/products";

export const getProducts = async (): Promise<Product[]> => {
  // Use mock data for now since we need to adapt the database schema
  return mockProducts;

  // Uncomment when database schema is updated:
  /*
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');
  
  if (productsError) {
    console.error("Error fetching products:", productsError);
    return [];
  }

  // Adapt the products to our interface
  return products.map(product => adaptSupabaseProduct(product));
  */
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  // Use mock data for now
  const product = mockProducts.find(p => p.id === productId);
  return product || null;

  // Uncomment when database schema is updated:
  /*
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
  
  if (productError) {
    console.error("Error fetching product:", productError);
    return null;
  }

  // Adapt the product to our interface
  return adaptSupabaseProduct(product);
  */
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  // Use mock data for now
  return mockProducts.filter(p => p.is_featured);

  // Uncomment when database schema is updated:
  /*
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true);
  
  if (productsError) {
    console.error("Error fetching featured products:", productsError);
    return [];
  }

  // Adapt the products to our interface
  return products.map(product => adaptSupabaseProduct(product));
  */
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  // Use mock data for now
  return mockProducts.filter(p => p.category === categoryId);

  // Uncomment when database schema is updated:
  /*
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('category', categoryId);
  
  if (productsError) {
    console.error("Error fetching products by category:", productsError);
    return [];
  }

  // Adapt the products to our interface
  return products.map(product => adaptSupabaseProduct(product));
  */
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  // Use mock data for now
  return mockProducts.filter(p => 
    p.title?.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  // Uncomment when database schema is updated:
  /*
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  
  if (productsError) {
    console.error("Error searching products:", productsError);
    return [];
  }

  // Adapt the products to our interface
  return products.map(product => adaptSupabaseProduct(product));
  */
};

// Map database categories to display names
export const categories: Category[] = [
  { id: "headphones", name: "Headphones" },
  { id: "speakers", name: "Speakers" },
  { id: "earbuds", name: "Earbuds" },
  { id: "accessories", name: "Accessories" },
  { id: "vinyl", name: "Vinyl Players" },
];
