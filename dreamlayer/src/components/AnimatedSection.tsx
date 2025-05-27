'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'slide-up' | 'fade-in' | 'scale-in';
  delay?: number;
}

const AnimatedSection = ({ 
  children, 
  className = '',
  animation = 'slide-up',
  delay = 0
}: AnimatedSectionProps) => {
  const { ref, isInView } = useScrollAnimation();

  // Temporary fix: always show content with opacity-100 to debug visibility issues
  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out opacity-100';
    const delayClass = delay > 0 ? `delay-${delay}` : '';
    
    if (isInView) {
      switch (animation) {
        case 'slide-up':
          return `${baseClasses} ${delayClass} translate-y-0`;
        case 'fade-in':
          return `${baseClasses} ${delayClass}`;
        case 'scale-in':
          return `${baseClasses} ${delayClass} scale-100`;
        default:
          return `${baseClasses} ${delayClass} translate-y-0`;
      }
    } else {
      // Still show content but with initial animation state
      switch (animation) {
        case 'slide-up':
          return `${baseClasses} translate-y-4`;
        case 'fade-in':
          return `${baseClasses}`;
        case 'scale-in':
          return `${baseClasses} scale-98`;
        default:
          return `${baseClasses} translate-y-4`;
      }
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
