'use client';

export interface SkeletonProps {
  count?: number;
  height?: string;
  width?: string;
  circle?: boolean;
  className?: string;
}

/**
 * Skeleton loading component with animated shimmer effect
 * Used to show placeholder during data loading
 */
export const SkeletonLoader: React.FC<SkeletonProps> = ({
  count = 1,
  height = 'h-6',
  width = 'w-full',
  circle = false,
  className = ''
}) => {
  const skeletons = Array.from({ length: count });

  const baseClasses = `bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse`;
  
  const shapeClasses = circle 
    ? 'rounded-full' 
    : 'rounded-md';

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${shapeClasses} ${height} ${width} ${className} ${i > 0 ? 'mt-3' : ''}`}
        />
      ))}
    </>
  );
};

/**
 * Card skeleton - simulates election/result card structure
 */
export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <SkeletonLoader height="h-6" width="w-3/4" className="mb-4" />
      <SkeletonLoader height="h-4" width="w-full" className="mb-2" />
      <SkeletonLoader height="h-4" width="w-5/6" />
    </div>
  );
};

/**
 * List skeleton - simulates multiple card structure
 */
export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

/**
 * Form skeleton - simulates form input fields
 */
export const SkeletonForm: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title field */}
      <div>
        <SkeletonLoader height="h-4" width="w-1/4" className="mb-2" />
        <SkeletonLoader height="h-10" width="w-full" />
      </div>
      
      {/* Description field */}
      <div>
        <SkeletonLoader height="h-4" width="w-1/4" className="mb-2" />
        <SkeletonLoader height="h-20" width="w-full" />
      </div>
      
      {/* Date fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <SkeletonLoader height="h-4" width="w-1/2" className="mb-2" />
          <SkeletonLoader height="h-10" width="w-full" />
        </div>
        <div>
          <SkeletonLoader height="h-4" width="w-1/2" className="mb-2" />
          <SkeletonLoader height="h-10" width="w-full" />
        </div>
      </div>
      
      {/* Button */}
      <SkeletonLoader height="h-10" width="w-full" />
    </div>
  );
};

/**
 * Results skeleton - simulates results chart/table
 */
export const SkeletonResults: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Question header */}
      <div>
        <SkeletonLoader height="h-6" width="w-3/4" className="mb-4" />
        
        {/* Chart area */}
        <div className="flex items-end justify-between gap-2 h-48">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader
              key={i}
              height={`h-${20 + i * 10}`}
              width="w-16"
            />
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <SkeletonLoader height="h-4" width="w-3/4" className="mb-2" />
            <SkeletonLoader height="h-8" width="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
