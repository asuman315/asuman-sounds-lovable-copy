
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Music, Upload, ImagePlus, Check } from "lucide-react";
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
import ProtectedRoute from "@/components/ProtectedRoute";

// Form validation schema
const audioProductSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  artist: z.string().min(2, { message: "Artist name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  // We'll handle file validation separately
});

type AudioProductFormValues = z.infer<typeof audioProductSchema>;

const AdminPage = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AudioProductFormValues>({
    resolver: zodResolver(audioProductSchema),
    defaultValues: {
      title: "",
      artist: "",
      description: "",
      price: "",
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

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: AudioProductFormValues) => {
    if (!imageFile) {
      toast.error("Please upload a product image");
      return;
    }

    if (!audioFile) {
      toast.error("Please upload an audio file");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, you would upload files and create the product in your database
      console.log("Form values:", values);
      console.log("Image file:", imageFile);
      console.log("Audio file:", audioFile);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Product added successfully");
      form.reset();
      setImageFile(null);
      setAudioFile(null);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        name="artist"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Artist</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter artist name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your audio product"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="19.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                      <div>
                        <FormLabel className="block mb-2">Audio File</FormLabel>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-all duration-200">
                          <div className="flex flex-col items-center justify-center">
                            {audioFile ? (
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-sm font-medium">{audioFile.name}</span>
                              </div>
                            ) : (
                              <Music className="h-10 w-10 text-muted-foreground mb-2" />
                            )}
                            <div className="flex text-sm text-muted-foreground">
                              <label
                                htmlFor="audio-upload"
                                className="relative cursor-pointer rounded-md bg-transparent font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                              >
                                <span>{audioFile ? "Change audio" : "Upload audio file"}</span>
                                <input
                                  id="audio-upload"
                                  name="audio-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="audio/*"
                                  onChange={handleAudioChange}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              MP3, WAV or FLAC up to 50MB
                            </p>
                          </div>
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
