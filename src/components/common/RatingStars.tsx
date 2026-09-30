import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showText?: boolean;
  totalReviews?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showText = false,
  totalReviews
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = displayRating >= starValue;
          const isPartial = !isFilled && displayRating > index && displayRating < starValue;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`p-0.5 transition-transform ${
                interactive ? 'cursor-pointer hover:scale-125 focus:outline-none' : 'cursor-default'
              }`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isPartial
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showText && (
        <span className="text-sm font-semibold text-slate-800 ml-1">
          {rating.toFixed(1)}
          {totalReviews !== undefined && (
            <span className="font-normal text-slate-500 text-xs ml-1">({totalReviews})</span>
          )}
        </span>
      )}
    </div>
  );
};
