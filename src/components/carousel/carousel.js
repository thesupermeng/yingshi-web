import { useEffect, useState } from "react";
import styles from './style.module.css';
import Image from 'next/image';
import { PlayRightIcon } from '@/asset/icons';
import { useRouter } from 'next/navigation';

export const Carousel = ({ carouselItems }) => {
  const router = useRouter();

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentlyHover, setCurrentlyHover] = useState(false);
  const [carouselVodId, setCarouselVodId] = useState(0);

  useEffect(() => {
    if(!currentlyHover){
      const autoSwipeCarousel = setTimeout(() => {
        setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        setCarouselVodId()
      }, 3000);
  
      return () => {
        clearTimeout(autoSwipeCarousel);
      };
    }
  }, [carouselIndex, carouselItems, currentlyHover]);

  const onHover = (index) => {
    setCarouselIndex(index);
    setCurrentlyHover(true);
  }

  const onUnhover = (index) => {
    setCurrentlyHover(false);
  }

  const renderShortString = (str) => {
    if (str == null || str == undefined) {
      return str
    }

    if (str.length > 5) {
      return str.substring(0, 5) + '...'
    }

    return str
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
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                }}
              >
                <img
                  src={item.carousel_pic_pc}
                  alt={`Slide ${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', opacity: 0.9, position: 'relative'}}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/play/${carouselItems[carouselIndex].vod.vod_id}`);
                  }}
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
                <div className="lg:flex hidden" style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#fff', zIndex: 1, width: '100%' }}>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-2"></div>
                    <div className="col-span-9">
                      <div className="grid grid-cols-8 gap-4" style={{ paddingBottom: '5rem' }}>
                        <div className="col-span-2 mr-3">
                          <p className="text-lg">{item.carousel_name}</p>
                          <p className="text-sm pt-1" style={{ fontWeight: '200' }}>{item.vod.vod_year}{desc}</p>
                          <p className="text-sm pt-1" style={{ fontWeight: '200' }}>{item.vod.vod_remarks}</p>
                          <div 
                            style={{
                              cursor: 'pointer',
                              background: '#FFFFFF2E', 
                              width: 'fit-content',
                              padding: '0.5rem 1rem',
                              borderRadius: '100px',
                              marginTop: '0.5rem'
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/play/${carouselItems[carouselIndex].vod.vod_id}`);
                            }}
                            className="flex flex-row flex-wrap">
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
          <div className="lg:flex hidden col-span-6 mr-3" style={{ position: 'absolute', right: '0', bottom: '3rem' }}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3"></div>
              <div className="col-span-8" style={{ display: 'flex', flexDirection: 'row', zIndex: '10' }}>
                {carouselItems.map((previewItem, previewIndex) => (
                  <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        justifySelf: 'center',
                        height: '100%',
                        width: '6rem',
                        marginRight: '1.5rem',
                        cursor: 'pointer',
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
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(`/play/${previewItem.vod.vod_id}`);
                              }}
                          />
                      </div>
                      <div key={previewIndex} style={{ paddingRight: '10px', paddingLeft: '10px', textAlign: 'center', fontSize: '12px' }}>
                        {renderShortString(previewItem.carousel_name)}
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
