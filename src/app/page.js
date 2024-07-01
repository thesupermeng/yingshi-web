'use client';
import './i18n';
import { LoadingPage } from '@/components/loading';
import { VideoVerticalCard } from '@/components/videoItem/videoVerticalCard';
import { VideoHorizontalCard } from '@/components/videoItem/videoHorizontalCard';
import { AdsBanner } from '@/components/ads/adsBanner.js';
export const RightBetCartWidth = 'w-[32rem]';
import { useSelector, useDispatch } from 'react-redux';
import { Carousel } from '@/components/carousel/carousel';
import { Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { YingshiApi2  , getIPAddress2} from '@/util/YingshiApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import { getTypePage, getTopicListApi } from '@/app/actions';
import VodListViewMore from '@/components/vodListViewMore';
import TopicPagingList from '@/components/topicPagingList';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { VideoWithTitleHorizontalCard } from '@/components/videoItem/videoWithTitleHorizontalCard';
import { setIsUserChina } from '@/store/yingshiScreen';

const getHeaderMenu = (state) => state.headerMenu;
export default function Home(params) {

  const dispatch = useDispatch();

  let paramsInput = params.category == undefined ? 0 : params.category;
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [yunying, setYunying] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [topicList, setTopicList] = useState(null);
  const [nextPage, setNextPage] = useState(0);

  const getIsUserChina = (state) => state.yingshiScreen.isUserChina;
  const isUserChina = useSelector(getIsUserChina);


  const headerMenu = useSelector(getHeaderMenu);

  const [headerMenuState, setHeaderMenuState] = useState(null);
  const [stillCanLoad, setStillCanLoad] = useState(
    paramsInput == 0 ? true : false
  );
  const [still99CanLoad, setStill99CanLoad] = useState(
    paramsInput == 99 ? true : false
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
    if (!adsList) {
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
    // console.log('headerMenu');
    // console.log(headerMenu.headerMenu);
    setHeaderMenuState(headerMenu.headerMenu);
  }, [headerMenu]);



  useLayoutEffect(() => {
   // init ip 
    initIp()
  }, []);

  const initIp = async() => {
    let ipObj = await getIPAddress2();
    if(ipObj && ipObj.IPv4 &&ipObj.country_code)
    sessionStorage.setItem('ipAddress' ,ipObj.IPv4)
    dispatch(setIsUserChina(ipObj))


  }

  // useEffect(() => {
  //   console.log('isUserChina')
  //   console.log(isUserChina)
  // }, [isUserChina]);


  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getTypePage(paramsInput),
      stillCanLoad && paramsInput == 0 && getTopicListApi(nextPage),
    ]).then(([typePageData, topicListData]) => {
      if (typePageData) {
        // if (paramsInput == 99) {
        //   setClassList(typePageData.class_list);
        // }
        setClassList(typePageData.class_list);
        // console.log('class_list');
        // console.log(typePageData.class_list);
        setCategories(typePageData.categories);
        setYunying(typePageData.yunying);

        setCarousel(typePageData.carousel);
      } else if (paramsInput == 99 && typePageData === undefined) {
        setStill99CanLoad(false)
      }

      if (topicListData) {
        let currentPage = nextPage;

        if (nextPage > 1) {
          try {
            setTopicList((prev) => [...prev, ...topicListData.List]);
          } catch (e) {
            console.log(e);
            // console.log('crash');
            // console.log(topicList);
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
    });
  }, []);

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
              <Carousel
                adsList={adsList}
                carouselItemsProps={carousel}
                pathName={pathName}
              />
              <div className='container w-[100%]'>
                <AdsBanner
                  adsList={adsList}
                  pathName={pathName}
                  height='500px'
                />
              </div>
              {classList != [] &&
                paramsInput != 99 &&
                headerMenuState &&
                classList && (
                  <div
                    className='container w-full overflow-x-auto max-w-full'
                    style={{
                      display: 'flex',
                      overflowX: 'auto',
                      scrollbarWidth: 'none',
                      padding: '10px 8px 10px 8px',
                    }}
                  >

                    <>
                      <Link
                        href={`/vod/show/by/time/id/${paramsInput}`}
                        className='btn btn-dark hover-effect text-white btn-dark-catagory'
                        style={{ flex: '0 0 auto', borderRadius: '10px' }}
                      >
                        全部
                        {/* {headerMenuState.id[paramsInput]?.name} */}
                        {
                          headerMenuState.find(
                            (item) => item.id === paramsInput
                          )?.name
                        }
                      </Link>
                    </>


                    {classList != [] &&
                      paramsInput != 99 &&
                      classList &&
                      classList?.map((cItem, cIndex) => {
                        return (
                          <Link
                            href={`/vod/show/by/time/class/${cItem}/id/${paramsInput}`}
                            key={cIndex + '-class'}
                            className='btn btn-dark hover-effect text-white btn-dark-catagory text-nowrap'
                            style={{ borderRadius: '10px' }}
                          >
                            {cItem}
                          </Link>
                        );
                      }) //class list map
                    }
                  </div>
                )}



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
                          <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-x-5 gap-y-2 py-2'>
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
                        <div key={idx} className={'pt-3'}>
                          {(idx % 2 !== 0) && (
                            <AdsBanner
                              pathName={pathName}
                              navId={'1-13'}
                              height='500px'
                            />
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
                            <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-x-5 gap-y-2 py-2'>
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
              <div className='container w-[100%]'>
                <AdsBanner
                  adsList={adsList}
                  pathName={pathName}
                  height='500px'
                />
              </div>
            </div>
          ) : (
            <>
              <div className='desktop flex flex-col w-full'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {/* md:mx-20 mx-2.5  lg:w-[80%]*/}
                  <div className='pt-4 container  w-[100%]'>
                    <VideoWithTitleHorizontalCard
                      data={categories}
                      navId={paramsInput}
                      isStillCanLoad={still99CanLoad}
                      platform='web'
                    />
                  </div>
                </div>
              </div>
              <div className='mobile flex flex-col w-full'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {/* md:mx-20 mx-2.5  lg:w-[80%]*/}
                  <div className='pt-1 container  w-[100%]'>
                    <VideoWithTitleHorizontalCard
                      data={categories}
                      navId={paramsInput}
                      isStillCanLoad={still99CanLoad}
                      platform='mobile'
                    />
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
