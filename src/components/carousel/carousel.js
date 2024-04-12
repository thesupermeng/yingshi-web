import { useEffect, useState } from "react";

export const Carousel = ({ carouselItems }) => {

  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const autoSwipeCarousel = setTimeout(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3000);

    return () => {
      clearTimeout(autoSwipeCarousel);
    };
  }, [carouselIndex, carouselItems]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '5/2', overflow: 'hidden' }}>
      {carouselItems && carouselItems.length > 0 && (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          {carouselItems.map((item, index) => (
            <img
              key={index}
              src={item.carousel_pic_pc}
              alt={`Slide ${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: index === carouselIndex ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
