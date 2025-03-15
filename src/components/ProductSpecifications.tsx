
import { Product } from "@/types/product";
import { Separator } from "@/components/ui/separator";

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
  // Mock specifications since they're not in the product type
  const specifications = [
    { name: "Model", value: `${product.title.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}` },
    { name: "Dimensions", value: "12.5 x 8.3 x 0.6 inches" },
    { name: "Weight", value: "0.9 pounds" },
    { name: "Material", value: "Aluminum, Glass" },
    { name: "Color", value: "Silver" },
    { name: "Connectivity", value: "Bluetooth 5.0, WiFi" },
    { name: "Battery Life", value: "Up to 10 hours" },
    { name: "Warranty", value: "1 year limited warranty" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
      {specifications.map((spec, index) => (
        <div key={index} className="py-1.5">
          <div className="flex justify-between sm:flex-col">
            <span className="text-gray-500 dark:text-gray-400">{spec.name}</span>
            <span className="font-medium text-gray-900 dark:text-white">{spec.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSpecifications;
