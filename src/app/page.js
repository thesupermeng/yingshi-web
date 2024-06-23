'use client';
import './i18n';
import { LoadingPage } from '@/components/loading';
import { VideoVerticalCard } from '@/components/videoItem/videoVerticalCard';
import { VideoHorizontalCard } from '@/components/videoItem/videoHorizontalCard';
import { AdsBanner } from '@/components/ads/adsBanner.js';
export const RightBetCartWidth = 'w-[32rem]';
import { Carousel } from '@/components/carousel/carousel';
import { Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { YingshiApi2 } from '@/util/YingshiApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import { getTypePage, getTopicListApi } from '@/app/actions';
import VodListViewMore from '@/components/vodListViewMore';
import TopicPagingList from '@/components/topicPagingList';

export default function Home(params) {
  let paramsInput = params.category == undefined ? 0 : params.category;

  const [isLoading, setIsLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [yunying, setYunying] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [topicList, setTopicList] = useState(null);
  const [nextPage, setNextPage] = useState(0);
  const [stillCanLoad, setStillCanLoad] = useState(
    paramsInput == 0 ? true : false
  );


  //banner ads
  const initAdsList = JSON.parse(sessionStorage.getItem('adsList'));
  const [adsList, setAdsList] = useState([]);
  const getAllAds = async () => {
    return YingshiApi2(URL_YINGSHI_VOD.getAllAds, {}, { method: 'GET' });
  };
  const initAds = async () => {
    let allAds = await getAllAds();
    sessionStorage.setItem('adsList', JSON.stringify(allAds.data));

    setAdsList(allAds.data);
  };
  useLayoutEffect(() => {
    let adsList = initAdsList;
    if(!adsList)
      {
        adsList = JSON.parse(sessionStorage.getItem('adsList'));
      }
 
    if (adsList && adsList !== 'undefined') {
      setAdsList(adsList);
    } else {
      initAds();
    }
  }, []);
  //end banner ads

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getTypePage(paramsInput), (stillCanLoad && paramsInput == 0 && getTopicListApi(nextPage))]).then(([typePageData, topicListData]) => {
        if (typePageData) {
          if (paramsInput == 99) {
            setClassList(typePageData.class_list);
          }
          setCategories(typePageData.categories);
          setYunying(typePageData.yunying);
          setCarousel(typePageData.carousel);
        }

        if (topicListData) {
          let currentPage = nextPage;

          if (nextPage > 1) {
            try {
              setTopicList((prev) => [...prev, ...topicListData.List]);
            } catch (e) {
              console.log(e);
              console.log('crash');
              console.log(topicList);
              setTopicList(topicListData.List);
            }
          } else {
            setTopicList(topicListData.List);
          }
          if (nextPage > topicListData.TotalPageCount - 1) {
            setStillCanLoad(false);
          } else {
            setStillCanLoad(true);
            setNextPage(currentPage + 1);
          }
        }

        setIsLoading(false);
      }
    );
  }, []);

  // let classList = [];
  // let categories = [];
  // let yunying = [];
  // let carousel = [];
  // let topicList = null;
  // let nextPage = 0;
  // let stillCanLoad = paramsInput == 0 ? true : false;

  // await Promise.all([getTypePage(paramsInput), getTopicListApi(nextPage)]).then(([typePageData, topicListData]) => {
  //   if (typePageData) {
  //     if (paramsInput == 99) {
  //       classList = typePageData.class_list;
  //     }
  //     categories = typePageData.categories;
  //     yunying = typePageData.yunying;
  //     carousel = typePageData.carousel;
  //   }

  //   if (topicListData) {
  //     let currentPage = nextPage;

  //     if (nextPage > 1) {
  //       try {
  //         topicList = [...topicList, ...topicListData.List];
  //       } catch (e) {
  //         console.log(e);
  //         console.log('crash');
  //         console.log(topicList);
  //         topicList = topicListData.List;
  //       }
  //     } else {
  //       topicList = topicListData.List;
  //     }
  //     if (nextPage > topicListData.TotalPageCount - 1) {
  //       stillCanLoad = false;
  //     } else {
  //       stillCanLoad = true;
  //       nextPage = currentPage + 1;
  //     }
  //   }
  // })

  return (
    <div
      className='flex flex-1 justify-center flex-col'
      style={{ width: '100%' }}
    >
      {isLoading ? (
        <div>
          <LoadingPage full={false} />
        </div>
      ) : (
        <>
          {paramsInput != 99 ? (
            <div className='flex flex-col w-full'>
              <Carousel carouselItems={carousel} />
              <div className='container w-[100%]'>
                <AdsBanner adsList={adsList} navId={'1-13'} height='500px' />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/* md:mx-20 mx-2.5  lg:w-[80%]*/}
                <div className='container w-[100%]'>
                  {yunying != [] &&
                    yunying?.map((yy, idx) => {
                      return (
                        <div key={idx} className='lg:pt-3'>
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
                          <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-5 py-2'>
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
                        <div key={idx}>
                          {idx % 2 ? (
                            <AdsBanner
                              adsList={adsList}
                              navId={'1-13'}
                              height='500px'
                            />
                          ) : (
                            <div style={{ paddingTop: '20px' }}></div>
                          )}
                          <div id={category.type_id} key={idx}>
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
                                <VodListViewMore
                                  type={'category'}
                                  data={category}
                                />
                                <FontAwesomeIcon
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    fontStyle: 'normal',
                                    fontFamily: 'PingFang SC',
                                  }}
                                  icon={faAngleRight}
                                />
                              </div>
                            </div>
                            <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-5 py-2'>
                              {category.vod_list?.slice(0, 6).map((vod, i) => {
                                return <VideoVerticalCard vod={vod} key={i} />;
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <TopicPagingList
                    data={topicList}
                    navId={paramsInput}
                    serverNextPage={nextPage}
                    isStillCanLoad={stillCanLoad}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className='desktop flex flex-col w-full'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {/* md:mx-20 mx-2.5  lg:w-[80%]*/}
                  <div className='pt-4 container  w-[100%]'>
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
                                <VodListViewMore
                                  type={'xcategory'}
                                  data={category}
                                />
                                <FontAwesomeIcon
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    fontStyle: 'normal',
                                    fontFamily: 'PingFang SC',
                                  }}
                                  icon={faAngleRight}
                                />
                              </div>
                            </div>
                            <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-5 py-2'>
                              {category.vod_list?.slice(0, 6).map((vod, i) => {
                                return (
                                  <VideoHorizontalCard
                                    vod={vod}
                                    key={i}
                                    typepage_id={paramsInput}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className='mobile flex flex-col w-full'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {/* md:mx-20 mx-2.5  lg:w-[80%]*/}
                  <div className='pt-1 container  w-[100%]'>
                    {categories != [] &&
                      categories?.map((category, idx) => {
                        return (
                          <div
                            id={category.type_id}
                            key={idx}
                            style={{ paddingTop: '1rem' }}
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
                                <VodListViewMore
                                  type={'xcategory'}
                                  data={category}
                                />
                                <FontAwesomeIcon
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    fontStyle: 'normal',
                                    fontFamily: 'PingFang SC',
                                  }}
                                  icon={faAngleRight}
                                />
                              </div>
                            </div>
                            <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-5 py-2'>
                              {category.vod_list?.slice(0, 6).map((vod, i) => {
                                return (
                                  <VideoHorizontalCard
                                    vod={vod}
                                    key={i}
                                    typepage_id={paramsInput}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
