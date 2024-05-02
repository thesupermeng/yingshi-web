'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { SWRConfig } from 'swr';
import { FBApi } from '@/util/FB_Api';

import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';

import './i18n';
import { LoadingPage } from '@/components/loading';
import { FullPageContent } from '@/componentsH5/FullPageContent';
import { H5Only } from '@/components/Fragments/EnvComponent';
import { VideoVerticalCard } from '@/components/videoItem/videoVerticalCard';
import { VideoHorizontalCard } from '@/components/videoItem/videoHorizontalCard';
import { isWeb } from '@/util/common';
export const RightBetCartWidth = 'w-[32rem]';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Carousel } from '@/components/carousel/carousel';
import { arrowRight, ArrowRightIcon } from '@/asset/icons';
import { Spinner } from '@/components/spinner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const getHeaderMenuSelected = (state) => state.headerMenuSelected;

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [yunying, setYunying] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const selectedMenu = useSelector(getHeaderMenuSelected);
  const [stillCanLoad, setStillCanLoad] = useState(false);
  const [topicList, setTopicList] = useState(null);
  const [nextPage, setNextPage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [classList, setClassList] = useState([]);

  const targetRef = useRef(null);

  const getTypePage = async (idValue) => {
    if(idValue == 99){
      return YingshiApi(
        URL_YINGSHI_VOD.homeGetPages,
        {
          id: idValue,
          dj: true,
          page: 1,
          limit: 60,
          vod_limit: 6
        },
        { method: 'GET' }
      );
    } else {
      return YingshiApi(
        URL_YINGSHI_VOD.homeGetPages,
        {
          id: idValue,
        },
        { method: 'GET' }
      );
    }
  };

  const getTopicListApi = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.playlistGetTopic + '?limit=5&page=' + nextPage,
      {},
      { method: 'GET' }
    );
  };

  const getTopicList = () => {
    let currentPage = nextPage;
    getTopicListApi().then((data) => {
      if (nextPage > 1) {
        setTopicList((prev) => [...prev, ...data.List]);
      } else {
        setTopicList(data.List);
      }
      if (nextPage > data.TotalPageCount - 1) {
        setStillCanLoad(false);
      } else {
        setStillCanLoad(true);
        setNextPage(currentPage + 1);
      }
    });
  };

  useEffect(() => {
    if (stillCanLoad) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // setIsVisible(entry.intersectionRatio >= 0.5);
          if (entry.intersectionRatio >= 0.5) {
            getTopicList();
            console.log('Element is at least 50% visible.');
          } else {
            console.log('Element is not yet 50% visible.');
          }
        },
        {
          threshold: 0.5, // 50% visibility threshold
        }
      );

      if (targetRef.current) {
        observer.observe(targetRef.current);
      }

      return () => {
        if (targetRef.current) {
          observer.unobserve(targetRef.current);
        }
      };
    }
  }, [nextPage, stillCanLoad]);

  useEffect(() => {
    if (selectedMenu.id == 0) {
      setStillCanLoad(true);
      setTopicList(null);
    } else {
      setStillCanLoad(false);
      setTopicList(null);
      setNextPage(0);
    }
    setLoading(true);
    getTypePage(selectedMenu.id).then((data) => {
      if(selectedMenu.id == 99){
        setClassList(data.class_list);
      }
      setCategories(data.categories);
      setYunying(data.yunying);
      setCarousel(data.carousel);
      setLoading(false);
    });
  }, [selectedMenu]);

  const handleClick = (item) => {
    localStorage.setItem('videoTypeId', item.type_id);
    localStorage.setItem('videoClass', item.type_name);
    router.push(`/filmLibrary`);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  })

  const handleScroll = () => {
    console.log(window.scrollY);
  }
  
  return (
    <div
      className='flex flex-1 justify-center flex-col'
      style={{ width: '100%' }}
      onScroll={handleScroll}
    >
      {loading ? (
        <div>
          <LoadingPage full={false} />
        </div>
      ) : (
        <>
          {selectedMenu.id != 99 ? (
            <div className='flex flex-col w-full'>
              <Carousel carouselItems={carousel} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* md:mx-20 mx-2.5  lg:w-[80%]*/}
                <div className='pt-4 container  w-[100%]'>
                  {yunying != [] &&
                    yunying?.map((yy, idx) => {
                      return (
                        <div id={yy.type_id} key={idx} className='lg:pt-3'>
                          <div className='flex justify-between'>
                            <span
                              style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                fontStyle: 'normal',
                                fontFamily: 'PingFang SC',
                              }}
                            >
                              {yy.type_name}
                            </span>
                          </div>
                          <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
                            {yy.vod_list?.slice(0, 6).map((vod, i) => {
                              return <VideoVerticalCard vod={vod} key={i} />;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  {categories != [] &&
                    categories?.map((category, idx) => {
                      return (
                        <div
                          id={category.type_id}
                          key={idx}
                          style={{ paddingTop: '3rem' }}
                        >
                          <div className='flex justify-between'>
                            <span
                              style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                fontStyle: 'normal',
                                fontFamily: 'PingFang SC',
                              }}
                            >
                              {category.type_name}
                            </span>
                            <div className='flex w-fit items-center cursor-pointer hover-blue'>
                              <span
                                className='mr-1'
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '400',
                                  fontStyle: 'normal',
                                  fontFamily: 'PingFang SC',
                                }}
                                onClick={() => handleClick(category)}
                              >
                                更多
                              </span>
                              <FontAwesomeIcon style={{
                                fontSize: '14px',
                                fontWeight: '400',
                                fontStyle: 'normal',
                                fontFamily: 'PingFang SC',
                              }} icon={faAngleRight} />
                            </div>
                          </div>
                          <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
                            {category.vod_list?.slice(0, 6).map((vod, i) => {
                              return <VideoVerticalCard vod={vod} key={i} />;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  {topicList != null &&
                    topicList?.map((topic, idx) => {
                      return (
                        <div
                          id={topic.topic_id}
                          key={idx}
                          style={{ paddingTop: '3rem' }}
                        >
                          <div className='flex justify-between'>
                            <span
                              style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                fontStyle: 'normal',
                                fontFamily: 'PingFang SC',
                              }}
                            >
                              {topic.topic_name}
                            </span>
                            <div className='flex w-fit items-center cursor-pointer hover-blue'>
                              <span
                                className='mr-1'
                                style={{
    
                                  fontSize: '12px',
                                  fontWeight: '400',
                                  fontStyle: 'normal',
                                  fontFamily: 'PingFang SC',
                                }}
                                onClick={() => {
                                  router.push('/topic/' + topic.topic_id);
                                }}
                              >
                                更多
                              </span>
                              <FontAwesomeIcon style={{
                                fontSize: '14px',
                                fontWeight: '400',
                                fontStyle: 'normal',
                                fontFamily: 'PingFang SC',
                              }} icon={faAngleRight} />
                            </div>
                          </div>
                          <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
                            {topic.vod_list?.slice(0, 6).map((vod, i) => {
                              return <VideoVerticalCard vod={vod} key={i} />;
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className='flex flex-col w-full'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/* md:mx-20 mx-2.5  lg:w-[80%]*/}
                  <div className='pt-4 container  w-[100%]'>
                    {yunying != [] &&
                      yunying?.map((yy, idx) => {
                        return (
                          <div id={yy.type_id} key={idx} className='lg:pt-3'>
                            <div className='flex justify-between'>
                              <span
                                style={{
                                  fontSize: '20px',
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  fontFamily: 'PingFang SC',
                                }}
                              >
                                {yy.type_name}
                              </span>
                            </div>
                            <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
                              {yy.vod_list?.slice(0, 6).map((vod, i) => {
                                return <VideoHorizontalCard vod={vod} key={i} typepage_id={selectedMenu.id} />;
                              })}
                            </div>
                          </div>
                        );
                      })}
                    {categories != [] &&
                      categories?.map((category, idx) => {
                        return (
                          <div
                            id={category.type_id}
                            key={idx}
                            style={{ paddingTop: '3rem' }}
                          >
                            <div className='flex justify-between'>
                              <span
                                style={{
                                  fontSize: '20px',
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  fontFamily: 'PingFang SC',
                                }}
                              >
                                {category.type_name}
                              </span>
                              <div className='flex w-fit items-center cursor-pointer hover-blue'>
                                <span
                                  className='mr-1'
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '400',
                                    fontStyle: 'normal',
                                    fontFamily: 'PingFang SC',
                                  }}
                                  onClick={(e) => {
                                    router.push(`/xvod/${category.vod_source_name}/${category.type_name}`);
                                  }}
                                >
                                  更多
                                </span>
                                <FontAwesomeIcon style={{
                                  fontSize: '14px',
                                  fontWeight: '400',
                                  fontStyle: 'normal',
                                  fontFamily: 'PingFang SC',
                                }} icon={faAngleRight} />
                              </div>
                            </div>
                            <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
                              {category.vod_list?.slice(0, 6).map((vod, i) => {
                                return <VideoHorizontalCard vod={vod} key={i} typepage_id={selectedMenu.id} />;
                              })}
                            </div>
                          </div>
                        );
                      })}
                    {topicList != null &&
                      topicList?.map((topic, idx) => {
                        return (
                          <div
                            id={topic.topic_id}
                            key={idx}
                            style={{ paddingTop: '3rem' }}
                          >
                            <div className='flex justify-between'>
                              <span
                                style={{
                                  fontSize: '20px',
                                  fontWeight: '600',
                                  fontStyle: 'normal',
                                  fontFamily: 'PingFang SC',
                                }}
                              >
                                {topic.topic_name}
                              </span>
                              <div className='flex w-fit items-center cursor-pointer hover-blue'>
                                <span
                                  className='mr-1'
                                  style={{
      
                                    fontSize: '12px',
                                    fontWeight: '400',
                                    fontStyle: 'normal',
                                    fontFamily: 'PingFang SC',
                                  }}
                                  onClick={() => {
                                    router.push('/topic/' + topic.topic_id);
                                  }}
                                >
                                  更多
                                </span>
                                <FontAwesomeIcon style={{
                                  fontSize: '14px',
                                  fontWeight: '400',
                                  fontStyle: 'normal',
                                  fontFamily: 'PingFang SC',
                                }} icon={faAngleRight} />
                              </div>
                            </div>
                            <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
                              {topic.vod_list?.slice(0, 6).map((vod, i) => {
                                return <VideoHorizontalCard vod={vod} key={i} typepage_id={selectedMenu.id} />;
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </>
          )

          }
        </>
      )}
      <div ref={targetRef}>
        {stillCanLoad && selectedMenu.id == 0 && <Spinner></Spinner>}
      </div>
    </div>
  );
}
