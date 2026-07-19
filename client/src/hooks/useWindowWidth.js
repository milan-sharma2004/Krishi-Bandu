import { useEffect, useState } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? Infinity : window.innerWidth));

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
