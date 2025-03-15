
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductImage, Category } from "@/types/product";

export const getProducts = async (): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');
  
  if (productsError) {
    console.error("Error fetching products:", productsError);
    return [];
  }

  // Fetch all product images
  const { data: images, error: imagesError } = await supabase
    .from('product_images')
    .select('*');

  if (imagesError) {
    console.error("Error fetching product images:", imagesError);
    return products || [];
  }

  // Map images to products
  const productsWithImages = products?.map(product => {
    const productImages = images?.filter(img => img.product_id === product.id) || [];
    return {
      ...product,
      images: productImages,
    };
  }) || [];

  return productsWithImages;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true);
  
  if (productsError) {
    console.error("Error fetching featured products:", productsError);
    return [];
  }

  // Fetch images for featured products
  if (products && products.length > 0) {
    const productIds = products.map(p => p.id);
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds);

    if (imagesError) {
      console.error("Error fetching product images:", imagesError);
      return products;
    }

    // Map images to products
    const productsWithImages = products.map(product => {
      const productImages = images?.filter(img => img.product_id === product.id) || [];
      return {
        ...product,
        images: productImages,
      };
    });

    return productsWithImages;
  }

  return products || [];
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('category', categoryId);
  
  if (productsError) {
    console.error("Error fetching products by category:", productsError);
    return [];
  }

  // Fetch images for these products
  if (products && products.length > 0) {
    const productIds = products.map(p => p.id);
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds);

    if (imagesError) {
      console.error("Error fetching product images:", imagesError);
      return products;
    }

    // Map images to products
    const productsWithImages = products.map(product => {
      const productImages = images?.filter(img => img.product_id === product.id) || [];
      return {
        ...product,
        images: productImages,
      };
    });

    return productsWithImages;
  }

  return products || [];
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  
  if (productsError) {
    console.error("Error searching products:", productsError);
    return [];
  }

  // Fetch images for these products
  if (products && products.length > 0) {
    const productIds = products.map(p => p.id);
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds);

    if (imagesError) {
      console.error("Error fetching product images:", imagesError);
      return products;
    }

    // Map images to products
    const productsWithImages = products.map(product => {
      const productImages = images?.filter(img => img.product_id === product.id) || [];
      return {
        ...product,
        images: productImages,
      };
    });

    return productsWithImages;
  }

  return products || [];
};

// Map database categories to display names
export const categories: Category[] = [
  { id: "headphones", name: "Headphones" },
  { id: "speakers", name: "Speakers" },
  { id: "earbuds", name: "Earbuds" },
  { id: "accessories", name: "Accessories" },
  { id: "vinyl", name: "Vinyl Players" },
];
