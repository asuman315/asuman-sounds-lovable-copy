
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const nextImage = () => {
    setImageLoaded(false);
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImageLoaded(false);
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    if (index !== currentImage) {
      setImageLoaded(false);
      setCurrentImage(index);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main image container */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-center bg-cover"
          >
            <img
              src={images[currentImage]}
              alt={`Product view ${currentImage + 1}`}
              className="w-full h-full object-cover object-center"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Zoom button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-4 right-4 bg-white/70 dark:bg-black/50 backdrop-blur-sm hover:bg-white/90 hover:dark:bg-black/70"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-0">
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-xl overflow-hidden p-1">
              <img
                src={images[currentImage]}
                alt={`Product view ${currentImage + 1}`}
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 h-9 w-9 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm hover:bg-white/90 hover:dark:bg-black/70"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 h-9 w-9 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-sm hover:bg-white/90 hover:dark:bg-black/70"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        {/* Image pagination dots (mobile only) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  currentImage === index 
                    ? "w-6 bg-primary" 
                    : "w-1.5 bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => selectImage(index)}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Thumbnail navigation (desktop only) */}
      {images.length > 1 && (
        <div className="hidden md:grid grid-cols-5 gap-3 mt-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square rounded-md overflow-hidden transition-all ${
                currentImage === index 
                  ? "ring-2 ring-primary ring-offset-2" 
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => selectImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
