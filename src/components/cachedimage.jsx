import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const imageCache = new Map();

const CachedImage = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (imageCache.has(src)) {
          setImageSrc(imageCache.get(src));
          setLoading(false);
          return;
        }

        const response = await fetch(src);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        imageCache.set(src, objectUrl);
        setImageSrc(objectUrl);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    loadImage();
  }, [src]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg" />;
  }

  if (error) {
    return <img src="/fallback-1.jpg" alt="Fallback" className={cn("rounded-lg", className)} />;
  }

  return <img src={imageSrc} alt={alt} className={cn("rounded-lg", className)} />;
};

export default CachedImage;
