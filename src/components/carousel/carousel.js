import { useEffect, useState } from "react";
import styles from './style.module.css';
import Image from 'next/image';
import { PlayRightIcon } from '@/asset/icons';

export const Carousel = ({ carouselItems }) => {

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentlyHover, setCurrentlyHover] = useState(false);

  useEffect(() => {
    if(!currentlyHover){
      const autoSwipeCarousel = setTimeout(() => {
        setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
      }, 3000);
  
      return () => {
        clearTimeout(autoSwipeCarousel);
      };
    }
  }, [carouselIndex, carouselItems, currentlyHover]);

  const onHover = (index) => {
    console.log('ITEM_____', index);
    setCarouselIndex(index);
    setCurrentlyHover(true);
  }

  const onUnhover = (index) => {
    console.log("???", index)
    setCurrentlyHover(false);
  }

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '5/2', overflow: 'hidden' }}>
      {carouselItems && carouselItems.length > 0 && (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          {carouselItems.map((item, index) => {
            let desc = " | " + item.vod.vod_area
            let vodClass = []
            if(item.vod.vod_class != null){
              vodClass = item.vod.vod_class.split(",");
            }
            vodClass = vodClass.slice(0, 2);
            vodClass.forEach((item, i) => {
                desc += " | " + item
            })
            return (
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
                  <div className="grid grid-cols-12 gap-4">
                    <div></div>
                    <div className="col-span-10">
                      <div className="grid grid-cols-8 gap-4" style={{ paddingBottom: '5rem' }}>
                        <div class="col-span-2 mr-3">
                          <p className="text-lg">{item.carousel_name}</p>
                          <p className="text-sm" style={{ fontWeight: '200' }}>{item.vod.vod_year}{desc}</p>
                          <p className="text-sm" style={{ fontWeight: '200' }}>{item.vod.vod_remarks}</p>
                          <div className="flex flex-row flex-wrap" style={{ background: '#FFFFFF2E', width: 'fit-content', padding: '0.5rem 1rem', borderRadius: '100px', marginTop: '0.5rem' }}>
                            <Image
                              style={{ paddingRight: '0.5rem' }}
                              src={PlayRightIcon}
                              alt="Icon"
                            />
                            <div className="text-sm">看正片</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            )
          })}
          <div class="col-span-6 mr-3" style={{ position: 'absolute', right: '0', bottom: '3rem' }}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3"></div>
              <div className="col-span-8" style={{ display: 'flex', flexDirection: 'row', zIndex: '100' }}>
                {carouselItems.map((previewItem, previewIndex) => (
                  <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        justifySelf: 'center',
                        height: '100%',
                        width: '6rem',
                        marginRight: '0.5rem',
                        cursor: 'pointer'
                      }}
                      key={previewIndex}
                      onMouseEnter={() => onHover(previewIndex)}
                      onMouseLeave={() => onUnhover(previewIndex)}
                      >
                      <div style={{ width: '100%', textAlign: 'center' }}>
                          <img
                              className={styles.carousel_item_card}
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
              <div className="col-span-1"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
