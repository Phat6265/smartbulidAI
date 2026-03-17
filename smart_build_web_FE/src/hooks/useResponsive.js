// useResponsive Hook - Responsive utilities
import { useMediaQuery } from 'react-responsive';

/**
 * Custom hook for responsive breakpoints
 * @returns {Object} - { isMobile, isTablet, isDesktop, isLargeDesktop }
 */
export const useResponsive = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  const isLargeDesktop = useMediaQuery({ minWidth: 1440 });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  };
};

/**
 * Hook to get current breakpoint name
 * @returns {string} - 'mobile' | 'tablet' | 'desktop' | 'largeDesktop'
 */
export const useBreakpoint = () => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isLargeDesktop) return 'largeDesktop';
  return 'desktop';
};

