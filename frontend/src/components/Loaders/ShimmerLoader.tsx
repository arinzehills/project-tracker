import React from 'react';

interface ShimmerLoaderProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
  children?: React.ReactNode;
}

const ShimmerLoader: React.FC<ShimmerLoaderProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = true,
  children
}) => {
  const shimmerClasses = `
    ${width} ${height}
    ${rounded ? 'rounded' : ''}
    bg-gradient-to-r from-secondary via-tertiary to-secondary
    animate-pulse
    ${className}
  `.trim();

  return (
    <div className={shimmerClasses}>
      {children}
    </div>
  );
};

// Preset shimmer components for common use cases
export const ShimmerText: React.FC<{ width?: string; className?: string }> = ({
  width = 'w-32',
  className = ''
}) => (
  <ShimmerLoader width={width} height="h-4" className={className} />
);

export const ShimmerButton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <ShimmerLoader width="w-full" height="h-10" className={className} />
);

export const ShimmerCard: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = '',
  children
}) => (
  <div className={`bg-elevated border border-border rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

export const ShimmerKeyValue: React.FC<{ keyWidth?: string; valueWidth?: string }> = ({
  keyWidth = 'w-24',
  valueWidth = 'w-32'
}) => (
  <div className="flex justify-between items-center py-2">
    <ShimmerText width={keyWidth} />
    <ShimmerText width={valueWidth} />
  </div>
);

export const ProjectListShimmer: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6">
        {/* Header shimmer */}
        <div className="mb-4">
          <ShimmerText width="w-3/4" className="h-6 mb-2" />
          <ShimmerText width="w-1/2" className="h-4" />
        </div>

        {/* Dates shimmer */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <ShimmerText width="w-1/2" className="h-3 mb-2" />
            <ShimmerText width="w-3/4" className="h-4" />
          </div>
          <div>
            <ShimmerText width="w-1/2" className="h-3 mb-2" />
            <ShimmerText width="w-3/4" className="h-4" />
          </div>
        </div>

        {/* Buttons shimmer */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
          <ShimmerButton />
          <ShimmerButton />
        </div>
      </div>
    ))}
  </div>
);

export default ShimmerLoader;
