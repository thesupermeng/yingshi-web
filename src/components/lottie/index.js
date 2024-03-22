import React from 'react';
import Lottie from 'lottie-react';

export const LottieAnimation = ({ src, tw, isLoop = true, ...props }) => {
  if (!src) return;
  return (
    <Lottie {...props} animationData={src} className={`${tw}`} loop={isLoop} />
  );
};
