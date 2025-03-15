import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Check, DollarSign, XCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AnimatedElement from "@/components/AnimatedElement";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProtectedRoute from "@/components/ProtectedRoute";
import { v4 as uuidv4 } from "uuid";

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$"
};

// Product categories
const productCategories = [
  { value: "headphones", label: "Headphones" },
  { value: "speakers", label: "Speakers" },
  { value: "earbuds", label: "Earbuds" },
  { value: "accessories", label: "Accessories" },
  { value: "new-releases", label: "New Releases" }
];

// Form validation schema
const audioProductSchema = z.object({
  title: z.string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(70, { message: "Title must not exceed 70 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  currency: z.string().default("USD"),
  category: z.string().default("headphones"),
  originalPrice: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Original price must be a non-negative number",
  }),
  comparablePrice: z.string().optional().refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Comparable price must be a non-negative number",
  }),
  stockCount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock count must be a non-negative number",
  }),
  isFeatured: z.boolean().default(false),
}).refine((data) => {
  // Skip validation if any field is empty
  if (!data.comparablePrice || !data.originalPrice) return true;
  
  return Number(data.comparablePrice) > Number(data.originalPrice);
}, {
  message: "Comparable price must be higher than original price",
  path: ["comparablePrice"]
});

type AudioProductFormValues = z.infer<typeof audioProductSchema>;

const AdminPage = () => {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AudioProductFormValues>({
    resolver: zodResolver(audioProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      currency: "USD",
      category: "headphones",
      originalPrice: "",
      comparablePrice: "",
      stockCount: "0",
      isFeatured: false,
    },
  });

  const watchCurrency = form.watch("currency");
  const currentCurrencySymbol = currencySymbols[watchCurrency] || "$";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to 5 images total
      if (imageFiles.length + newFiles.length > 5) {
        toast.error("You can upload a maximum of 5 images");
        return;
      }
      
      setImageFiles(prev => [...prev, ...newFiles]);
      
      // Create image previews
      const newPreviews: string[] = [];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === "string") {
            newPreviews.push(e.target.result);
            if (newPreviews.length === newFiles.length) {
              setImagePreviews(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImageToSupabase = async (file: File, productId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${productId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error in image upload:', error);
      return null;
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 70) {
      // Truncate and update form
      form.setValue('title', value.slice(0, 70));
    } else {
      form.setValue('title', value);
    }
  };

  const onSubmit = async (values: AudioProductFormValues) => {
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast.error("You must be logged in to add a product");
        setIsSubmitting(false);
        return;
      }

      // Insert product into Supabase
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title: values.title,
          description: values.description,
          price: Number(values.price),
          currency: values.currency,
          category: values.category,
          original_price: values.originalPrice ? Number(values.originalPrice) : null,
          comparable_price: values.comparablePrice ? Number(values.comparablePrice) : null,
          stock_count: Number(values.stockCount),
          is_featured: values.isFeatured,
          user_id: user.data.user.id
        })
        .select()
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        throw productError;
      }

      // Upload images and create product_images records
      const productId = product.id;
      const imageUploadPromises = imageFiles.map(async (file, index) => {
        const imageUrl = await uploadImageToSupabase(file, productId);
        if (!imageUrl) {
          throw new Error(`Failed to upload image ${index + 1}`);
        }
        
        // Create product_images record
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: imageUrl,
            is_main: index === 0 // First image is the main image
          });
          
        if (imageError) {
          console.error('Error creating image record:', imageError);
          throw imageError;
        }
        
        return imageUrl;
      });
      
      await Promise.all(imageUploadPromises);
      
      toast.success("Product added successfully");
      form.reset();
      setImageFiles([]);
      setImagePreviews([]);
      
      // Optionally navigate to product page or listing
      // navigate(`/products/${productId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-3xl mx-auto">
          <AnimatedElement animation="fade-in" className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Add New Audio Product</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create a new audio product to showcase your work to the world
            </p>
          </AnimatedElement>

          <AnimatedElement animation="fade-in" delay={200}>
            <Card className="glass-card border-0 overflow-hidden">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Fill in the details about your audio product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter product title" 
                              {...field} 
                              onChange={(e) => {
                                handleTitleChange(e);
                                field.onChange(e);
                              }}
                              maxLength={70}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the category that best fits your product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormDescription>
                            Use the rich text editor to format your product description.
                          </FormDescription>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Describe your audio product..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="text" 
                                  placeholder="19.99" 
                                  className="pl-8"
                                  {...field} 
                                />
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">
                                  {currentCurrencySymbol}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                                <SelectItem value="CAD">CAD (C$)</SelectItem>
                                <SelectItem value="AUD">AUD (A$)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Original Price</FormLabel>
                            <FormDescription>
                              Optional. Used to show a discount.
                            </FormDescription>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="text" 
                                  placeholder="29.99" 
                                  className="pl-8"
                                  {...field} 
                                />
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">
                                  {currentCurrencySymbol}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="comparablePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comparable Price</FormLabel>
                            <FormDescription>
                              Optional. Competitive market price. Must be higher than original price.
                            </FormDescription>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="text" 
                                  placeholder="24.99" 
                                  className="pl-8"
                                  {...field} 
                                />
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground">
                                  {currentCurrencySymbol}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="stockCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                min="0"
                                placeholder="10" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md shadow-sm">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Feature this product</FormLabel>
                              <FormDescription>
                                Featured products appear prominently on the home page
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormLabel className="block mb-2">Product Images (max 5)</FormLabel>
                      {form.formState.errors.root && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>
                            {form.formState.errors.root.message}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                                <img 
                                  src={preview} 
                                  alt={`Preview ${index + 1}`} 
                                  className="w-full h-full object-cover rounded-md" 
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label="Remove image"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                              {index === 0 && (
                                <span className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded-md">
                                  Main
                                </span>
                              )}
                            </div>
                          ))}
                          
                          {imagePreviews.length < 5 && (
                            <label
                              htmlFor="additional-image-upload"
                              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center aspect-square text-muted-foreground hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="h-8 w-8 mb-1" />
                              <span className="text-sm">Add Image</span>
                              <input
                                id="additional-image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          )}
                        </div>
                      )}
                      
                      {imagePreviews.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-all duration-200">
                          <div className="flex flex-col items-center justify-center">
                            <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                            <div className="flex text-sm text-muted-foreground">
                              <label
                                htmlFor="image-upload"
                                className="relative cursor-pointer rounded-md bg-transparent font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                              >
                                <span>Upload images</span>
                                <input
                                  id="image-upload"
                                  name="image-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  multiple
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG or WEBP up to 5MB each (max 5 images)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="mr-2"
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="min-w-[120px] transition-all duration-300 hover:translate-y-[-2px]"
                      >
                        {isSubmitting ? "Saving..." : "Add Product"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </AnimatedElement>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
