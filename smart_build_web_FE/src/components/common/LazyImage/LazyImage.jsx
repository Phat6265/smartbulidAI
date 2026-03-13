// LazyImage Component - Lazy load images
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './LazyImage.css';

const LazyImage = ({
  src,
  alt,
  className = '',
  effect = 'blur',
  placeholder = null,
  ...props
}) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      className={`lazy-image ${className}`}
      effect={effect}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default LazyImage;

