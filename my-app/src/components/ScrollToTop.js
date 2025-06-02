import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component automatically scrolls to the top of the page when navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop; 