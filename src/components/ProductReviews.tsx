
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AnimatedElement from "@/components/AnimatedElement";

interface ProductReviewsProps {
  productId: string;
}

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: "1",
    user: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      initials: "AJ",
    },
    rating: 5,
    title: "Absolutely love it!",
    content: "This product exceeded my expectations in every way. The design is sleek and modern, and the functionality is top-notch. I've been using it daily for the past month and have zero complaints.",
    date: "2023-05-15T00:00:00Z",
    helpfulCount: 24,
    isVerified: true,
    images: ["https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdCUyMHVzZXxlbnwwfHwwfHx8MA%3D%3D"]
  },
  {
    id: "2",
    user: {
      name: "Samantha Lee",
      avatar: "https://i.pravatar.cc/150?img=5",
      initials: "SL",
    },
    rating: 4,
    title: "Great product with minor issues",
    content: "I've been using this for about three weeks now and I'm mostly impressed. The quality is excellent and it works as advertised. My only complaint is that the battery life could be better.",
    date: "2023-04-22T00:00:00Z",
    helpfulCount: 17,
    isVerified: true,
    images: []
  },
  {
    id: "3",
    user: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=3",
      initials: "MC",
    },
    rating: 5,
    title: "Perfect addition to my collection",
    content: "This is the third product I've purchased from this company and it doesn't disappoint. The attention to detail is amazing and the performance is consistent with their high standards.",
    date: "2023-04-10T00:00:00Z",
    helpfulCount: 9,
    isVerified: true,
    images: ["https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2R1Y3QlMjB1c2V8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2R1Y3QlMjB1c2V8ZW58MHx8MHx8fDA%3D"]
  },
  {
    id: "4",
    user: {
      name: "Emily Rodriguez",
      avatar: "",
      initials: "ER",
    },
    rating: 3,
    title: "Good but not great",
    content: "The product is decent for the price point, but there are better options out there. It serves its purpose, but I was hoping for something a little more refined.",
    date: "2023-03-28T00:00:00Z",
    helpfulCount: 5,
    isVerified: false,
    images: []
  },
];

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  
  // Using mock data instead of a real query for now
  const reviews = MOCK_REVIEWS;
  
  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId) 
        : [...prev, reviewId]
    );
  };
  
  const toggleLikeReview = (reviewId: string) => {
    setLikedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId) 
        : [...prev, reviewId]
    );
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Count ratings by star level
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Rating Summary */}
      <Card className="glass-card col-span-1 lg:sticky lg:top-24 h-fit">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Based on {reviews.length} reviews
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = (ratingCounts[rating as keyof typeof ratingCounts] / reviews.length) * 100;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center min-w-[60px]">
                    <span className="text-sm mr-1">{rating}</span>
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${percentage}%` }} 
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-right">
                    {ratingCounts[rating as keyof typeof ratingCounts]}
                  </div>
                </div>
              );
            })}
          </div>
          
          <Separator className="my-4" />
          
          <Button className="w-full rounded-full" variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        </CardContent>
      </Card>
      
      {/* Reviews List */}
      <div className="col-span-1 lg:col-span-3">
        <div className="space-y-6">
          {reviews.map((review, index) => {
            const isExpanded = expandedReviews.includes(review.id);
            const isLiked = likedReviews.includes(review.id);
            const isLongReview = review.content.length > 300;
            
            return (
              <AnimatedElement
                key={review.id}
                animation="fade-in"
                delay={index * 100}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {review.user.avatar ? (
                        <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      ) : null}
                      <AvatarFallback>{review.user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        {review.isVerified && (
                          <span className="flex items-center text-green-600 dark:text-green-400 mr-2">
                            <Check className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </span>
                        )}
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <h4 className="font-semibold mb-2">{review.title}</h4>
                
                <div className={`text-gray-600 dark:text-gray-300 ${!isExpanded && isLongReview ? 'line-clamp-3' : ''}`}>
                  {review.content}
                </div>
                
                {isLongReview && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-auto p-0 hover:bg-transparent text-primary text-sm font-normal"
                    onClick={() => toggleReviewExpansion(review.id)}
                  >
                    {isExpanded ? (
                      <span className="flex items-center">
                        Show less <ChevronUp className="h-4 w-4 ml-1" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Read more <ChevronDown className="h-4 w-4 ml-1" />
                      </span>
                    )}
                  </Button>
                )}
                
                {review.images && review.images.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Customer Images</div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {review.images.map((img, imgIndex) => (
                        <img 
                          key={imgIndex} 
                          src={img} 
                          alt={`Review image ${imgIndex + 1}`} 
                          className="h-24 w-24 object-cover rounded-md" 
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm ${isLiked ? 'text-primary' : 'text-gray-500'}`}
                    onClick={() => toggleLikeReview(review.id)}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-1.5 ${isLiked ? 'fill-primary' : ''}`} />
                    Helpful ({review.helpfulCount + (isLiked ? 1 : 0)})
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    Reply
                  </Button>
                </div>
              </AnimatedElement>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="rounded-full px-8">
            Load More Reviews
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
