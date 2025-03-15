import { Product, Category, ProductImage } from "@/types/product";

export const categories: Category[] = [
  {
    id: "headphones",
    name: "Headphones",
    description: "Immerse yourself in rich, detailed sound with our premium over-ear headphones designed for audiophiles."
  },
  {
    id: "speakers",
    name: "Speakers",
    description: "Fill your space with crystal-clear audio from our elegantly designed speakers that blend seamlessly with any décor."
  },
  {
    id: "earbuds",
    name: "Earbuds",
    description: "Experience wireless freedom with our comfortable, noise-isolating earbuds perfect for on-the-go listening."
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Enhance your audio experience with our premium cables, stands, and carrying cases designed for durability and style."
  },
  {
    id: "vinyl",
    name: "Vinyl",
    description: "Rediscover the warmth and character of analog sound with our carefully curated vinyl collection and turntables."
  }
];

export const products: Product[] = [
  {
    id: "1",
    title: "Studio Pro Headphones",
    description: "Premium wireless over-ear headphones with studio-quality sound and active noise cancellation.",
    price: 349.99,
    currency: "USD",
    original_price: 399.99,
    stock_count: 100,
    is_featured: true,
    category: "headphones",
    created_at: "2023-04-15T00:00:00Z",
    updated_at: "2023-04-15T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "1-1",
        product_id: "1",
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-04-15T00:00:00Z",
        updated_at: "2023-04-15T00:00:00Z"
      },
      {
        id: "1-2",
        product_id: "1",
        image_url: "https://images.unsplash.com/photo-1624913503273-5f9c4e980ddd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: false,
        created_at: "2023-04-15T00:00:00Z",
        updated_at: "2023-04-15T00:00:00Z"
      },
    ],
  },
  {
    id: "2",
    title: "Portable Wireless Speaker",
    description: "Powerful portable speaker with 360° sound, waterproof design, and 24-hour battery life.",
    price: 199.99,
    currency: "USD",
    original_price: 239.99,
    stock_count: 75,
    is_featured: true,
    category: "speakers",
    created_at: "2023-06-20T00:00:00Z",
    updated_at: "2023-06-20T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "2-1",
        product_id: "2",
        image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-06-20T00:00:00Z",
        updated_at: "2023-06-20T00:00:00Z"
      },
      {
        id: "2-2",
        product_id: "2",
        image_url: "https://images.unsplash.com/photo-1589003511763-e5c1c1122b0a?q=80&w=2037&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: false,
        created_at: "2023-06-20T00:00:00Z",
        updated_at: "2023-06-20T00:00:00Z"
      },
    ],
  },
  {
    id: "3",
    title: "True Wireless Earbuds",
    description: "Premium true wireless earbuds with active noise cancellation and crystal-clear sound quality.",
    price: 179.99,
    currency: "USD",
    stock_count: 50,
    is_featured: false,
    category: "earbuds",
    created_at: "2023-05-10T00:00:00Z",
    updated_at: "2023-05-10T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "3-1",
        product_id: "3",
        image_url: "https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-05-10T00:00:00Z",
        updated_at: "2023-05-10T00:00:00Z"
      },
      {
        id: "3-2",
        product_id: "3",
        image_url: "https://images.unsplash.com/photo-1631176260021-fff7e9e7fa4a?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: false,
        created_at: "2023-05-10T00:00:00Z",
        updated_at: "2023-05-10T00:00:00Z"
      },
    ],
  },
  {
    id: "4",
    title: "Vintage Vinyl Player",
    description: "Classic vinyl record player with modern connectivity options and built-in speakers.",
    price: 249.99,
    currency: "USD",
    original_price: 279.99,
    stock_count: 30,
    is_featured: true,
    category: "vinyl",
    created_at: "2023-07-05T00:00:00Z",
    updated_at: "2023-07-05T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "4-1",
        product_id: "4",
        image_url: "https://images.unsplash.com/photo-1518893883800-45cd0954574b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-07-05T00:00:00Z",
        updated_at: "2023-07-05T00:00:00Z"
      },
      {
        id: "4-2",
        product_id: "4",
        image_url: "https://images.unsplash.com/photo-1611603308449-b8924abe54b2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: false,
        created_at: "2023-07-05T00:00:00Z",
        updated_at: "2023-07-05T00:00:00Z"
      },
    ],
  },
  {
    id: "5",
    title: "Premium Audio Cable",
    description: "High-quality gold-plated audio cable for optimal sound transfer and durability.",
    price: 29.99,
    currency: "USD",
    stock_count: 200,
    is_featured: false,
    category: "accessories",
    created_at: "2023-08-15T00:00:00Z",
    updated_at: "2023-08-15T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "5-1",
        product_id: "5",
        image_url: "https://images.unsplash.com/photo-1606133957324-e903a98ffa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-08-15T00:00:00Z",
        updated_at: "2023-08-15T00:00:00Z"
      },
    ],
  },
  {
    id: "6",
    title: "Bookshelf Speakers (Pair)",
    description: "Compact yet powerful bookshelf speakers delivering room-filling sound with detailed clarity.",
    price: 299.99,
    currency: "USD",
    stock_count: 60,
    is_featured: false,
    category: "speakers",
    created_at: "2023-09-01T00:00:00Z",
    updated_at: "2023-09-01T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "6-1",
        product_id: "6",
        image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-09-01T00:00:00Z",
        updated_at: "2023-09-01T00:00:00Z"
      },
      {
        id: "6-2",
        product_id: "6",
        image_url: "https://images.unsplash.com/photo-1596394723269-b2cbca4e6e38?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: false,
        created_at: "2023-09-01T00:00:00Z",
        updated_at: "2023-09-01T00:00:00Z"
      },
    ],
  },
  {
    id: "7",
    title: "Sport Earbuds",
    description: "Sweat-resistant wireless earbuds designed for athletes and active lifestyles.",
    price: 129.99,
    currency: "USD",
    original_price: 159.99,
    stock_count: 40,
    is_featured: false,
    category: "earbuds",
    created_at: "2023-10-10T00:00:00Z",
    updated_at: "2023-10-10T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "7-1",
        product_id: "7",
        image_url: "https://images.unsplash.com/photo-1590658623772-a522c5f91cab?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-10-10T00:00:00Z",
        updated_at: "2023-10-10T00:00:00Z"
      },
    ],
  },
  {
    id: "8",
    title: "DJ Headphones",
    description: "Professional-grade DJ headphones with swiveling ear cups and powerful bass response.",
    price: 179.99,
    currency: "USD",
    stock_count: 20,
    is_featured: false,
    category: "headphones",
    created_at: "2023-11-15T00:00:00Z",
    updated_at: "2023-11-15T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "8-1",
        product_id: "8",
        image_url: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-11-15T00:00:00Z",
        updated_at: "2023-11-15T00:00:00Z"
      },
    ],
  },
  {
    id: "9",
    title: "Bluetooth Adapter",
    description: "Turn any wired audio device into a Bluetooth-enabled one with this compact adapter.",
    price: 39.99,
    currency: "USD",
    original_price: 49.99,
    stock_count: 150,
    is_featured: false,
    category: "accessories",
    created_at: "2023-12-01T00:00:00Z",
    updated_at: "2023-12-01T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "9-1",
        product_id: "9",
        image_url: "https://images.unsplash.com/photo-1659047130269-212f7b2f1a5e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2023-12-01T00:00:00Z",
        updated_at: "2023-12-01T00:00:00Z"
      },
    ],
  },
  {
    id: "10",
    title: "Home Theater System",
    description: "Complete 5.1 surround sound system for an immersive home theater experience.",
    price: 699.99,
    currency: "USD",
    stock_count: 30,
    is_featured: true,
    category: "speakers",
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "10-1",
        product_id: "10",
        image_url: "https://images.unsplash.com/photo-1528148343865-51218c4a13e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2024-01-05T00:00:00Z",
        updated_at: "2024-01-05T00:00:00Z"
      },
    ],
  },
  {
    id: "11",
    title: "Recording Microphone",
    description: "Professional condenser microphone for studio-quality voice and instrument recordings.",
    price: 129.99,
    currency: "USD",
    stock_count: 80,
    is_featured: false,
    category: "accessories",
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "11-1",
        product_id: "11",
        image_url: "https://images.unsplash.com/photo-1520236614-9a9a63193ca8?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2024-02-10T00:00:00Z",
        updated_at: "2024-02-10T00:00:00Z"
      },
    ],
  },
  {
    id: "12",
    title: "Limited Edition Headphones",
    description: "Collector's edition headphones with premium materials and exclusive design.",
    price: 499.99,
    currency: "USD",
    stock_count: 10,
    is_featured: false,
    category: "headphones",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    user_id: "1",
    images: [
      {
        id: "12-1",
        product_id: "12",
        image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3",
        is_main: true,
        created_at: "2024-03-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z"
      },
    ],
  },
];

export const featuredProducts = products.filter(product => product.is_featured);
