import React from 'react';

const SkeletonGameCard = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
        {/* Image Skeleton */}
        <div className="w-full sm:w-48 h-48 flex-shrink-0 bg-gray-200 dark:bg-gray-700">
          <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse"></div>
        </div>
        
        {/* Content Skeleton */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title Skeleton */}
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          
          {/* Rating and Year Skeleton */}
          <div className="flex items-center gap-4 mb-3">
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          {/* Genres Skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            ))}
          </div>
          
          {/* Description Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
          
          {/* Button Skeleton */}
          <div className="w-32 h-9 bg-gray-200 dark:bg-gray-700 rounded-md mt-auto"></div>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div className="group h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Image Skeleton */}
      <div className="relative pt-[56.25%] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        
        <div className="mt-auto">
          {/* Rating and Year Skeleton */}
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
          
          {/* Genres Skeleton */}
          <div className="flex flex-wrap gap-1 mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          
          {/* Button Skeleton */}
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonGameCard;
