
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Check, DollarSign } from "lucide-react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
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
import ProtectedRoute from "@/components/ProtectedRoute";

// Form validation schema
const audioProductSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  currency: z.string().default("USD"),
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
  // We'll handle file validation separately
});

type AudioProductFormValues = z.infer<typeof audioProductSchema>;

const AdminPage = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AudioProductFormValues>({
    resolver: zodResolver(audioProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      currency: "USD",
      originalPrice: "",
      comparablePrice: "",
      stockCount: "0",
      isFeatured: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: AudioProductFormValues) => {
    if (!imageFile) {
      toast.error("Please upload a product image");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, you would upload files and create the product in your database
      console.log("Form values:", values);
      console.log("Image file:", imageFile);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Product added successfully");
      form.reset();
      setImageFile(null);
      setImagePreview(null);
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
                            <Input placeholder="Enter product title" {...field} />
                          </FormControl>
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
                            Supports rich text formatting. Use Markdown syntax for formatting.
                          </FormDescription>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your audio product. Use Markdown for rich text formatting."
                              className="min-h-[150px] font-mono text-sm"
                              {...field}
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
                                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                              Optional. Competitive market price.
                            </FormDescription>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="text" 
                                  placeholder="24.99" 
                                  className="pl-8"
                                  {...field} 
                                />
                                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                      <FormLabel className="block mb-2">Product Image</FormLabel>
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-all duration-200">
                        <div className="flex flex-col items-center justify-center">
                          {imagePreview ? (
                            <div className="relative mb-4 w-full max-w-[200px] aspect-square">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover rounded-md shadow-sm" 
                              />
                            </div>
                          ) : (
                            <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                          )}
                          <div className="flex text-sm text-muted-foreground">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer rounded-md bg-transparent font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                            >
                              <span>{imageFile ? "Change image" : "Upload image"}</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG or WEBP up to 5MB
                          </p>
                        </div>
                      </div>
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
