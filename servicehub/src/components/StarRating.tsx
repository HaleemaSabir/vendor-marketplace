import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  showCount?: boolean;
  count?: number;
  className?: string;
}

export function StarRating({ rating, showCount = false, count = 0, className = "" }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-primary text-primary" />
        ))}
        {hasHalfStar && (
          <StarHalf key="half" className="w-4 h-4 fill-primary text-primary" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground opacity-30" />
        ))}
      </div>
      <span className="font-bold text-sm ml-1">{rating.toFixed(1)}</span>
      {showCount && <span className="text-muted-foreground text-sm ml-1">({count})</span>}
    </div>
  );
}
