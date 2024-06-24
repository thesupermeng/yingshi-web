'use client'
import { useEffect, useLayoutEffect, useState } from 'react';
import styles from './style.module.css';
import Image from 'next/image';
import { PlayRightIcon } from '@/asset/icons';
import { useRouter } from 'next/navigation';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';

export const Carousel = ({ carouselItemsProps  ,   pathName = '/' ,   adsList = []}) => {
  const router = useRouter();
  const { isVip, userInfo } = useYingshiUser();

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentlyHover, setCurrentlyHover] = useState(false);
  const [carouselVodId, setCarouselVodId] = useState(0);
  const [carouselItems, setCarouselItems] = useState(null);
  let navId = '126-135';

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
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '3'
        }}
      >
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),

  };

  const findAdBySlotId = (ads, slotId) => {
    if (!ads) {
      return;
    }

    let result = ads.filter(
      (ad) => ad.slot_id_list_array && ad.slot_id_list_array.includes(slotId)
    );
    return result[0];
  };

const initCarousel = () =>{
  var pathFlag = pathName.substr(pathName.length - 1);

  if (pathFlag == '/') {
      navId = '126-135';
  }
  //1 
  if (pathFlag == '1') {
    navId = '127-136';
  }

  //综艺
  if (pathFlag == '2') {
    navId = '128-137';
  }
//综艺
  if (pathFlag == '3') {
    navId = '130-139';
  }

    // 动漫
  if (pathFlag == '4') {
    navId = '131-140';
  }

   // 记录片
  if (pathFlag == '5') {
    navId = '132-141';
  }
  //韩剧
  if (pathFlag == '6') {
    navId = '133-142';
  }
  //美剧
  if (pathFlag == '7') {
    navId = '134-143';
  }
   let result = []
   const parts = navId?.split('-').map(Number);
   parts.forEach((item, index) => {
    let temp = findAdBySlotId(adsList, item);
    result.push(temp);
  });
   let tempCarou; 
   if(result &&result !=undefined && result.length>0 && result[0] !=undefined && !isVip)
    {
       tempCarou = {
           "carousel_id": 0,
          "carousel_name": result[0].ads_event_title,
          "carousel_remarks": "",
          "carousel_pic_pc": result[0].ads_pic,
          "carousel_pic_mobile": result[1].ads_pic,
          "carousel_vod_pic": result[0].ads_thumbnail,
          "carousel_vod_area": result[0].ads_tag,
          "carousel_vod_year": result[0].ads_event_title,
          "carousel_vod_type_id": 0,
          "carousel_content_id": 0,
          "ads_url": result[0].ads_url
       }

    }
   if(tempCarou)
    {

      let tempObj = [{...tempCarou} , ...carouselItemsProps]
      setCarouselItems(tempObj)
    }
   else
   {
    setCarouselItems(carouselItemsProps)
   }
}

  useLayoutEffect(() => {
    initCarousel()
  }, []);



  useEffect(() => {

    initCarousel()
  }, [isVip]);

  useEffect(() => {

    if (!currentlyHover) {
      let autoSwipeCarousel = null;
      if (carouselItems != null) {
        autoSwipeCarousel = setTimeout(() => {
          setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
          setCarouselVodId()
        }, 3000);
      }

      return () => {
        if (autoSwipeCarousel != null) {
          clearTimeout(autoSwipeCarousel);
        }
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
    {carouselItems &&(
      <>
      <div className="mobile" style={{ position: 'relative', width: '100%', aspectRatio: '2/1', overflow: 'hidden' }}>
        <div className="mobile">
          <Slider {...settings}>
            {carouselItems != null && carouselItems.length > 0 && carouselItems.map((item, index) => {
              return (
                <div key={index + '-top'}>
                  <div style={{ zIndex: '1', position: 'absolute', bottom: '0', paddingLeft: '1.2rem', paddingBottom: '2rem' }}>
                    {item.carousel_name}
                  </div>
                  <div className="slider-container" style={{ position: 'relative' }} onClick={(e) => {
                    e.preventDefault();

                    if(item.carousel_content_id == 0 )
                      {
                        window.open(item.ads_url, '_blank');
                        return 
                      }
                    router.push(`/vod/play/id/${item.carousel_content_id}/sid/${item.carousel_vod_type_id}/nid/1`);
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
      <div className="desktop" style={{ position: 'relative', width: '100%', aspectRatio: '5/2', overflow: 'hidden' , cursor:'pointer' }}>
        {carouselItems && carouselItems.length > 0 && (
          <div className="desktop d-flex" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            {carouselItems.map((item, index) => {
              let desc = ' | ' + item.carousel_vod_area
              let vodClass = []
              if (item.carousel_vod_class != null) {
                vodClass = item.carousel_vod_class.split(',');
              }
              vodClass = vodClass.slice(0, 2);
              vodClass.forEach((item, i) => {
                desc += ' | ' + item
              })
              return (
                <div
                  key={index + '-btn'}
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
                      if(carouselItems[carouselIndex].carousel_content_id == 0 )
                        {
                          window.open(carouselItems[carouselIndex].ads_url, '_blank');
                          return 
                        }
                      router.push(`/vod/play/id/${carouselItems[carouselIndex].carousel_content_id}/sid/${carouselItems[carouselIndex].carousel_vod_type_id}/nid/1`);
                    }}
                  />

                  <div className="desktop  d-flex" style={{ position: 'absolute', bottom: '40px', left: '10px', color: '#fff', zIndex: 1, width: '100%' }}>
                    <div className="flex container">
                      <div className="col pt-3">
                        <p className="text-lg">{item.carousel_name}</p>
                        <p className="text-sm pt-1" style={{ fontWeight: '200' }}>{item.carousel_vod_year}{desc}</p>
                        <p className="text-sm pt-1" style={{ fontWeight: '200' }}>{item.carousel_vod_remarks}</p>
                         {item?.carousel_id !=0  && 
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
                            if(carouselItems[carouselIndex].carousel_content_id == 0 )
                              {
                                window.open(carouselItems[carouselIndex].ads_url, '_blank');
                                return 
                              }
                              else
                              {
                                router.push(`/vod/play/id/${carouselItems[carouselIndex].carousel_content_id}/sid/${carouselItems[carouselIndex].carousel_vod_type_id}/nid/1`);
                              }
                             
                          }}
                          className="flex flex-row flex-wrap hover-effect">
                          <Image
                            style={{ paddingRight: '0.5rem' }}
                            src={PlayRightIcon}
                            alt="Icon"
                          />
                        
                          <div className="text-sm">看正片</div>
                         
                        </div>
                      }
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'row', zIndex: '10', width: '80%', justifyContent: 'flex-end' }}>
                        {carouselItems.map((previewItem, previewIndex) => (
<>
                  
                          <div
                           key={previewItem.carousel_content_id + '-1'}
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
                         
                            onMouseEnter={() => onHover(previewIndex)}
                            onMouseLeave={() => onUnhover(previewIndex)}
                          >
                            <div style={{ width: '100%', textAlign: 'center' }}>
                              <img
                                className={styles.carousel_item_card}
                                src={previewItem.carousel_vod_pic}
                                alt={`Slide ${previewIndex}`}
                                style={{ width: '100%', aspectRatio: '5/7', objectFit: 'cover', borderRadius: '12px' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if(previewItem.carousel_content_id == 0 )
                                    {
                                      window.open(previewItem.ads_url, '_blank');
                                      return 
                                    }
                                  router.push(`/vod/play/id/${previewItem.carousel_content_id}/sid/${previewItem.carousel_vod_type_id}/nid/1`);
                                }}
                              />
                            </div>
                            <div key={previewIndex + '-3'} style={{ paddingRight: '10px', paddingLeft: '10px', textAlign: 'center', fontSize: '12px', paddingTop: '6px' }}>
                              {/* {renderShortString(previewItem.carousel_name)} */}
                              <p className="line-clamp-1">{previewItem.carousel_name}</p>
                            </div>
                          </div>
                     
                      </>
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
       )
 }
    </>
  );
};
