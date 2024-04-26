import { useEffect, useState } from "react";
import styles from './style.module.css';
import Image from 'next/image';
import { PlayRightIcon } from '@/asset/icons';
import { useRouter } from 'next/navigation';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const Carousel = ({ carouselItems }) => {
  const router = useRouter();

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentlyHover, setCurrentlyHover] = useState(false);
  const [carouselVodId, setCarouselVodId] = useState(0);

  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    dots: true, // Add dots
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),

  };

  useEffect(() => {
    if (!currentlyHover) {
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
    <>
      <div className="mobile" style={{ position: 'relative', width: '100%', aspectRatio: '2/1', overflow: 'hidden' }}>
        <div className="mobile">
          <Slider {...settings}>
            {carouselItems != null && carouselItems.length > 0 && carouselItems.map((item, index) => {
              return (
                <div key={index}>
                  <div style={{ zIndex: '1', position: 'absolute', bottom: '0', paddingLeft: '1.2rem', paddingBottom: '2rem' }}>
                    {item.carousel_name}
                  </div>
                  <div className="slider-container" style={{ position: 'relative' }} onClick={(e) => {
                    e.preventDefault();
                    router.push(`/play/${item.vod.type_id}/1/${item.vod.vod_id}`);
                  }}>
                    <img

                      src={item.carousel_pic_mobile}
                      alt={`Slide ${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', opacity: 0.9, position: 'relative' }}
                    />
                    <div className="gradient-overlay"></div>
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>
      </div>
      <div className="desktop" style={{ position: 'relative', width: '100%', aspectRatio: '5/2', overflow: 'hidden' }}>
        {carouselItems && carouselItems.length > 0 && (
          <div className="desktop d-flex" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            {carouselItems.map((item, index) => {
              let desc = " | " + item.vod.vod_area
              let vodClass = []
              if (item.vod.vod_class != null) {
                vodClass = item.vod.vod_class.split(",");
              }
              vodClass = vodClass.slice(0, 2);
              vodClass.forEach((item, i) => {
                desc += " | " + item
              })
              return (
                <div
                  key={index}
                  className="wrap-is-me"
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: index === carouselIndex ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}
                >
                  <img
                    src={item.carousel_pic_pc}
                    alt={`Slide ${index}`}
                    className="slide-is-me d-flex"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', opacity: 0.9, position: 'relative' }}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/play/${carouselItems[carouselIndex].vod.type_id}/1/${carouselItems[carouselIndex].vod.vod_id}`);
                    }}
                  />

                  <div className="desktop  d-flex" style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#fff', zIndex: 1, width: '100%' }}>
                    <div className="flex container">
                      <div className="col pt-3">
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
                            router.push(`/play/${carouselItems[carouselIndex].vod.type_id}/1/${carouselItems[carouselIndex].vod.vod_id}`);
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

                      <div style={{ display: 'flex', flexDirection: 'row', zIndex: '10' }}>
                        {carouselItems.map((previewItem, previewIndex) => (
                          <div 
                          className="hidden xl:flex"
                          style={{
                   
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            justifySelf: 'center',
                            height: '100%',
                            width: '6rem',
                            marginRight: '1rem',
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
                                  router.push(`/play/${previewItem.vod.type_id}/1/${previewItem.vod.vod_id}`);
                                }}
                              />
                            </div>
                            <div key={previewIndex} style={{ paddingRight: '10px', paddingLeft: '10px', textAlign: 'center', fontSize: '12px', paddingTop: '6px' }}>
                              {renderShortString(previewItem.carousel_name)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>


                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  );
};
