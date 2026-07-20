"use client";

/**
 * SkeletonRoomCard — Skeleton loading placeholder cho room card
 * Hiển thị shimmer animation trong khi đợi dữ liệu load
 */
export default function SkeletonRoomCard() {
  return (
    <div className="skeleton-card">
      {/* Image placeholder */}
      <div className="skeleton-img" />
      
      {/* Content */}
      <div className="p-4">
        {/* Address lines */}
        <div className="skeleton-line medium" />
        <div className="skeleton-line short" />
        
        {/* Price */}
        <div className="skeleton-line price" />
        
        {/* Tags */}
        <div className="flex gap-2 mt-3">
          <div className="skeleton" style={{ width: '60px', height: '24px' }} />
          <div className="skeleton" style={{ width: '50px', height: '24px' }} />
          <div className="skeleton" style={{ width: '70px', height: '24px' }} />
        </div>
        
        {/* Button */}
        <div className="skeleton-btn" />
      </div>
    </div>
  );
}

/**
 * SkeletonRoomGrid — Grid of skeleton cards for loading state
 */
export function SkeletonRoomGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRoomCard key={i} />
      ))}
    </div>
  );
}
