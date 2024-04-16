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
            <div
              key={index}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: index === carouselIndex ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
              }}
            >
              <img
                src={item.carousel_pic_pc}
                alt={`Slide ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#fff', zIndex: 1, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <p>
                    {item.carousel_name}
                  </p>
                </div>
                <div style={{ paddingRight: '100px' }}>
                  <p>
                    {item.carousel_name} {item.carousel_name} {item.carousel_name} {item.carousel_name} {item.carousel_name} {item.carousel_name} {item.carousel_name} 
                  </p>
                </div>
              </div> */}
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#fff', zIndex: 1, width: '100%' }}>
                <div class="grid grid-cols-12 gap-4">
                  <div></div>
                  <div className="col-span-10">
                    <div class="grid grid-cols-8 gap-4">
                      <div class="col-span-2 mr-3">
                        {item.carousel_name}
                      </div>
                      <div class="col-span-6 mr-3">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          {carouselItems.map((previewItem, previewIndex) => (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                justifySelf: 'center',
                                height: '100%',
                                marginRight: '0.5rem',
                            }}>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <img
                                        src={previewItem.vod.vod_pic}
                                        alt={`Slide ${previewIndex}`}
                                        style={{ width: '100%', aspectRatio: '5/7', objectFit: 'cover', borderRadius: '12px' }}
                                    />
                                </div>
                                <div key={previewIndex} style={{ paddingRight: '10px', paddingLeft: '10px', textAlign: 'center', fontSize: '12px' }}>
                                    {previewItem.carousel_name}
                                </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
