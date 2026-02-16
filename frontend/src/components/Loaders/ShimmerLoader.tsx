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

export default ShimmerLoader;
