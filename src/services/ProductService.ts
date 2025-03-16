
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductImage, Category, adaptSupabaseProduct } from "@/types/product";
import { products as mockProducts } from "@/data/products";

export const getProducts = async (): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*)
    `);
  
  if (productsError) {
    console.error("Error fetching products:", productsError);
    return mockProducts; // Fallback to mock data if there's an error
  }

  // If no products found in database, use mock data
  if (!products || products.length === 0) {
    console.log("No products found in database, using mock data");
    return mockProducts;
  }

  // Map database products to our Product interface
  return products.map(product => {
    const adaptedProduct = adaptSupabaseProduct(product);
    
    // Add images from the joined product_images
    if (product.product_images && product.product_images.length > 0) {
      adaptedProduct.images = product.product_images.map((img: any) => ({
        id: img.id,
        product_id: img.product_id,
        image_url: img.image_url,
        is_main: img.is_main,
        created_at: img.created_at,
        updated_at: img.updated_at
      }));
    }
    
    return adaptedProduct;
  });
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*)
    `)
    .eq('id', productId)
    .maybeSingle();
  
  if (productError) {
    console.error("Error fetching product:", productError);
    // Fallback to mock data
    return mockProducts.find(p => p.id === productId) || null;
  }

  if (!product) {
    console.log(`No product found with id ${productId}, using mock data`);
    return mockProducts.find(p => p.id === productId) || null;
  }

  // Adapt the product to our interface
  const adaptedProduct = adaptSupabaseProduct(product);
  
  // Add images from the joined product_images
  if (product.product_images && product.product_images.length > 0) {
    adaptedProduct.images = product.product_images.map((img: any) => ({
      id: img.id,
      product_id: img.product_id,
      image_url: img.image_url,
      is_main: img.is_main,
      created_at: img.created_at,
      updated_at: img.updated_at
    }));
  }
  
  return adaptedProduct;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*)
    `)
    .eq('is_featured', true);
  
  if (productsError) {
    console.error("Error fetching featured products:", productsError);
    // Fallback to mock data
    return mockProducts.filter(p => p.is_featured);
  }

  if (!products || products.length === 0) {
    console.log("No featured products found in database, using mock data");
    return mockProducts.filter(p => p.is_featured);
  }

  // Map database products to our Product interface
  return products.map(product => {
    const adaptedProduct = adaptSupabaseProduct(product);
    
    // Add images from the joined product_images
    if (product.product_images && product.product_images.length > 0) {
      adaptedProduct.images = product.product_images.map((img: any) => ({
        id: img.id,
        product_id: img.product_id,
        image_url: img.image_url,
        is_main: img.is_main,
        created_at: img.created_at,
        updated_at: img.updated_at
      }));
    }
    
    return adaptedProduct;
  });
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*)
    `)
    .eq('category', categoryId);
  
  if (productsError) {
    console.error("Error fetching products by category:", productsError);
    // Fallback to mock data
    return mockProducts.filter(p => p.category === categoryId);
  }

  if (!products || products.length === 0) {
    console.log(`No products found for category ${categoryId}, using mock data`);
    return mockProducts.filter(p => p.category === categoryId);
  }

  // Map database products to our Product interface
  return products.map(product => {
    const adaptedProduct = adaptSupabaseProduct(product);
    
    // Add images from the joined product_images
    if (product.product_images && product.product_images.length > 0) {
      adaptedProduct.images = product.product_images.map((img: any) => ({
        id: img.id,
        product_id: img.product_id,
        image_url: img.image_url,
        is_main: img.is_main,
        created_at: img.created_at,
        updated_at: img.updated_at
      }));
    }
    
    return adaptedProduct;
  });
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  
  if (productsError) {
    console.error("Error searching products:", productsError);
    // Fallback to mock data
    return mockProducts.filter(p => 
      p.title?.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (!products || products.length === 0) {
    console.log(`No products found matching query '${query}', using mock data`);
    return mockProducts.filter(p => 
      p.title?.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Map database products to our Product interface
  return products.map(product => {
    const adaptedProduct = adaptSupabaseProduct(product);
    
    // Add images from the joined product_images
    if (product.product_images && product.product_images.length > 0) {
      adaptedProduct.images = product.product_images.map((img: any) => ({
        id: img.id,
        product_id: img.product_id,
        image_url: img.image_url,
        is_main: img.is_main,
        created_at: img.created_at,
        updated_at: img.updated_at
      }));
    }
    
    return adaptedProduct;
  });
};

// Map database categories to display names
export const categories: Category[] = [
  { id: "headphones", name: "Headphones" },
  { id: "speakers", name: "Speakers" },
  { id: "earbuds", name: "Earbuds" },
  { id: "accessories", name: "Accessories" },
  { id: "vinyl", name: "Vinyl Players" },
];
