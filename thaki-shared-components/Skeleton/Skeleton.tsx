import React from 'react';
import { cn } from '../../services/utils/cn';

export interface SkeletonProps {
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ borderRadius, className }) => (
  <div
    className={cn('w-full h-full animate-skeleton', className)}
    style={{
      borderRadius: borderRadius ?? 'inherit',
    }}
  />
);
