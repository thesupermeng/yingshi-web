'use client';
import { searchEmptyIcon } from '@/asset/icons';
import { LoadingPage } from '@/components/loading';
import { VideoVerticalCard } from '@/components/videoItem/videoVerticalCard';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi  , YingshiApi2} from '@/util/YingshiApi';
import Image from 'next/image';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Spinner } from '@/components/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { AdsBanner } from '@/components/ads/adsBanner.js';

const getIsScroll = (state) => state.isScroll;
const getIsTop = (state) => state.isTop;

export const FilmLibrary = () => {
  const [loading, setLoading] = useState(true);
  const [filterTypeList, setFilterTypeList] = useState(null);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [videoList, setVideoList] = useState(null);
  const [loadingVideoList, setLoadingVideoList] = useState(true);
  const [stillCanLoad, setStillCanLoad] = useState(false);
  const [nextPage, setNextPage] = useState(0);
  const [collapse, setCollapse] = useState(false);
  const [buttonUncollapse, setButtonUncollapse] = useState(false);
  const pathName = usePathname();
  const isScrolling = useSelector(getIsScroll);
  const isAtTop = useSelector(getIsTop);

  const targetRef = useRef(null);
  const path = usePathname();
  const params = useParams();
  const router = useRouter();

  const advanceFilterItem = [
    {
      text: '新上线',
      value: 'time',
    },
    {
      text: '热播榜',
      value: 'hits_day',
    },
    {
      text: '好评榜',
      value: 'score',
    },
  ];

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
    console.log('test');
    let adsList = initAdsList;
    if (!adsList) {
      adsList = JSON.parse(sessionStorage.getItem('adsList'));
    }

    if (adsList && adsList !== 'undefined') {
      console.log('adsList 111');
      console.log(adsList);
      setAdsList(adsList);
    } else {
      initAds();
    }
  }, []);
  //end banner ads

  const getFilterTypeList = async () => {
    return YingshiApi(URL_YINGSHI_VOD.filteringTypeList, {}, { method: 'GET' });
  };

  const getFilterParams = (path, filterTypeList) => {
    const filterParams = {};
    for (let i = 0; i < path.length; i += 2) {
      filterParams[path[i]] = decodeURIComponent(path[i + 1]);
    }

    const typeInfo = filterTypeList.find(
      (item) => item.type_id === parseInt(filterParams.id)
    );
    if (!typeInfo) {
      router.push('/404');
    }

    const {
      class: classList,
      area: areaList,
      lang: langList,
      year: yearList,
    } = typeInfo.type_extend_obj;

    const isValidClass = filterParams.class
      ? classList.split(',').includes(filterParams.class)
      : false;
    const isValidArea = filterParams.area
      ? areaList.split(',').includes(filterParams.area)
      : false;
    const isValidLang = filterParams.lang
      ? langList.split(',').includes(filterParams.lang)
      : false;
    const isValidYear = filterParams.year
      ? yearList.split(',').includes(filterParams.year)
      : false;

    return {
      order: 'desc',
      typeId: parseInt(filterParams.id),
      by: filterParams.by ? filterParams.by : advanceFilterItem[0].value,
      class: isValidClass ? filterParams.class : '全部类型',
      area: isValidArea ? filterParams.area : '全部地区',
      lang: isValidLang ? filterParams.lang : '全部语言',
      year: isValidYear ? filterParams.year : '全部时间',
    };
  };

  const getSearchingListApi = async (params) => {
    const defaultParams = 
    {
      order: 'desc',
      limit: 30,
      page: nextPage,
      tid: params.typeId,
      // class: params.class == '全部类型' ? '' : params.class,
      // by: params.by,
      // area: params.area == '全部地区' ? '' : params.area,
      // lang: params.lang == '全部语言' ? '' : params.lang,
      // year: params.year == '全部时间' ? '' : params.year,
    }

    let inputParams = defaultParams
    if (params.class != '全部类型'){
      inputParams={
        ...inputParams,
        class: params.class
      } 
    }

    if (params.area != '全部地区'){
      inputParams={
        ...inputParams,
        area: params.area
      } 
    }

    if (params.lang != '全部语言'){
      inputParams={
        ...inputParams,
        lang: params.lang
      } 
    }

    if (params.year != '全部时间'){
      inputParams={
        ...inputParams,
        year: params.year
      } 
    }

    return YingshiApi(
      URL_YINGSHI_VOD.searchingList,
      inputParams,
      { method: 'GET' }
    );
  };

  const getSearchingList = async () => {
    let currentPage = nextPage;
    const videoListing = await getSearchingListApi(paramsFilter);

    if (nextPage > 1) {
      setVideoList((prev) => [...prev, ...videoListing.List]);
    } else {
      setVideoList(videoListing.List);
    }

    if (nextPage > videoListing.TotalPageCount - 1) {
      setStillCanLoad(false);
    } else {
      setStillCanLoad(true);
      setNextPage(currentPage + 1);
    }

    setLoadingVideoList(false);
  };

  useEffect(() => {
    if (!isAtTop.res) {
      setCollapse(true);
    } else {
      setCollapse(false);
    }
  }, [isAtTop]);

  useEffect(() => {
    if (isScrolling.res) {
      if (buttonUncollapse) {
        setCollapse(true);
        setButtonUncollapse(false);
      }
    }
  }, [isScrolling]);

  useLayoutEffect(() => {
    setLoading(true);

    // Simulating asynchronous data fetching
    const fetchData = async () => {
      let filteringTypeList;
      let filterParams;
      let flagList = sessionStorage.getItem('filteringTypeList');
      if (flagList && flagList !== 'undefined') {
        filteringTypeList = JSON.parse(flagList);
      } else {
        filteringTypeList = await getFilterTypeList();
        sessionStorage.setItem(
          'filteringTypeList',
          JSON.stringify(filteringTypeList)
        );
      }

      filterParams = getFilterParams(params.slug, filteringTypeList);
      setFilterTypeList(filteringTypeList);
      setParamsFilter(filterParams);
      setNextPage(1);
      setLoading(false);
      return true;
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (paramsFilter !== null) {
      getSearchingList();
    }
  }, [paramsFilter]);

  const loadMore = () => {
    getSearchingList();
  };

  useEffect(() => {
    if (stillCanLoad) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // setIsVisible(entry.intersectionRatio >= 0.5);
          if (entry.intersectionRatio >= 0.5) {
            loadMore();
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

  const listConverter = (type) => {
    let list = [];

    try {
      if (type == 'class') {
        list = filterTypeList[
          filterTypeList.findIndex(
            (item) => item.type_id === paramsFilter.typeId
          )
        ].type_extend_obj.class.split(',');
        list.unshift('全部类型');
      } else if (type == 'area') {
        list = filterTypeList[
          filterTypeList.findIndex(
            (item) => item.type_id === paramsFilter.typeId
          )
        ].type_extend_obj.area.split(',');
        list.unshift('全部地区');
      } else if (type == 'lang') {
        list = filterTypeList[
          filterTypeList.findIndex(
            (item) => item.type_id === paramsFilter.typeId
          )
        ].type_extend_obj.lang.split(',');
        list.unshift('全部语言');
      } else if (type == 'year') {
        list = filterTypeList[
          filterTypeList.findIndex(
            (item) => item.type_id === paramsFilter.typeId
          )
        ].type_extend_obj.year.split(',');
        list.unshift('全部时间');
      }
    } catch (e) {
      console.log(e);
      console.log('crash in 片库');
      return [];
    }

    return list;
  };

  const heightFilter = () => {
    let num = 1;
    if (
      filterTypeList[
        filterTypeList.findIndex((item) => item.type_id === paramsFilter.typeId)
      ].type_extend_obj.class !== ''
    ) {
      num += 1;
    }

    if (
      filterTypeList[
        filterTypeList.findIndex((item) => item.type_id === paramsFilter.typeId)
      ].type_extend_obj.area !== ''
    ) {
      num += 1;
    }

    if (
      filterTypeList[
        filterTypeList.findIndex((item) => item.type_id === paramsFilter.typeId)
      ].type_extend_obj.lang !== ''
    ) {
      num += 1;
    }

    if (
      filterTypeList[
        filterTypeList.findIndex((item) => item.type_id === paramsFilter.typeId)
      ].type_extend_obj.year !== ''
    ) {
      num += 1;
    }

    return num * 56;
  };

  const generatePath = (value, type) => {
    const regex = new RegExp(`/${type}/[^/]+`);

    if (regex.test(path)) {
      return path.replace(regex, `/${type}/${value}`);
    } else {
      switch (type) {
        case 'by':
          return path.replace(/\/id\//, `/by/${value}/id`);
        case 'id':
        case 'class':
          return path.replace(/\/id\//, `/class/${value}/id/`);
        case 'area':
          return path.replace(/\/by\//, `/area/${value}/by/`);
        case 'lang':
          return path.replace(
            /\/id\/[^/]+/,
            (match) => `${match}/${type}/${value}`
          );
        case 'year':
          return `${path}/year/${value}`;
        default:
          return path;
      }
    }
  };

  return (
    <>
      <div className='flex flex-1 justify-start flex-col'>
        <div className=' w-[100%]'>
          <AdsBanner adsList={adsList} pathName={pathName} height='500px' />
        </div>

        <div className='flex w-screen flex-col items-center'>
          <div className={` w-screen p-1 z-10 top-[48px] md:static sticky`}>
            {filterTypeList && (
              <div className={`bg-[#1D2023] pt-2`}>
                <div className='flex md:flex-wrap gap-x-4 gap-y-2 pl-4 py-2 container'>
                  {filterTypeList.map((item, index) => {
                    return (
                      <div
                        className='flex flex-col items-center cursor-pointer'
                        id={item.type_id}
                        key={index}
                        onClick={() => {
                          router.push(
                            `/vod/show/by/${advanceFilterItem[0].value}/id/${item.type_id}`
                          );
                        }}
                      >
                        <span
                          className={`hover:text-blue-500 transition-colors duration-300 truncate ${
                            paramsFilter.typeId === item.type_id
                              ? 'text-blue-500'
                              : 'text-white'
                          }`}
                        >
                          {item.type_name}
                        </span>
                        {paramsFilter.typeId === item.type_id ? (
                          <div className='border-2 border-blue-500 w-5 h-0.5 rounded-lg'></div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <div
                  className={`transition-all duration-500 md:h-fit md:visible md:py-2
              ease-out ${
                collapse
                  ? 'opacity-0 h-0 collapse'
                  : `h-[${heightFilter()}px] py-2 `
              }
              flex flex-col divide-y divide-gray-800 container md:flex md:opacity-100`}
                >
                  <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar'>
                    {advanceFilterItem.map((item, index) => {
                      return (
                        <div
                          className={`flex flex-col items-center cursor-pointer ${
                            paramsFilter.by === item.value
                              ? 'bg-[#FAC33D1F]'
                              : ''
                          } p-2 rounded-md`}
                          id={item.value}
                          key={index}
                          onClick={() => {
                            router.replace(generatePath(item.value, 'by'));
                          }}
                        >
                          <span
                            className={`text-sm hover:text-blue-500 transition-colors duration-300 truncate ${
                              paramsFilter.by === item.value
                                ? 'text-blue-500'
                                : 'text-white'
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {filterTypeList[
                    filterTypeList.findIndex(
                      (item) => item.type_id === paramsFilter.typeId
                    )
                  ].type_extend_obj.class != '' && (
                    <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar'>
                      {listConverter('class').map((item, index) => {
                        return (
                          <div
                            className={`flex flex-col items-center cursor-pointer ${
                              paramsFilter.class === item
                                ? 'bg-[#FAC33D1F]'
                                : ''
                            } p-2 rounded-md`}
                            id={item}
                            key={index}
                            onClick={() => {
                              item === '全部类型'
                                ? router.replace(
                                    path.replace(/\/class\/[^/]+/, '')
                                  )
                                : router.replace(generatePath(item, 'class'));
                            }}
                          >
                            <span
                              className={`text-sm hover:text-blue-500 transition-colors duration-300 truncate ${
                                paramsFilter.class === item
                                  ? 'text-blue-500'
                                  : 'text-white'
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {filterTypeList[
                    filterTypeList.findIndex(
                      (item) => item.type_id === paramsFilter.typeId
                    )
                  ].type_extend_obj.area != '' && (
                    <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar'>
                      {listConverter('area').map((item, index) => {
                        return (
                          <div
                            className={`flex flex-col items-center cursor-pointer ${
                              paramsFilter.area === item ? 'bg-[#FAC33D1F]' : ''
                            } p-2 rounded-md`}
                            id={item}
                            key={index}
                            onClick={() => {
                              item === '全部地区'
                                ? router.replace(
                                    path.replace(/\/area\/[^/]+/, '')
                                  )
                                : router.replace(generatePath(item, 'area'));
                            }}
                          >
                            <span
                              className={`text-sm hover:text-blue-500 transition-colors duration-300 truncate ${
                                paramsFilter.area === item
                                  ? 'text-blue-500'
                                  : 'text-white'
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {filterTypeList[
                    filterTypeList.findIndex(
                      (item) => item.type_id === paramsFilter.typeId
                    )
                  ].type_extend_obj.lang != '' && (
                    <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar'>
                      {listConverter('lang').map((item, index) => {
                        return (
                          <div
                            className={`flex flex-col items-center cursor-pointer ${
                              paramsFilter.lang === item ? 'bg-[#FAC33D1F]' : ''
                            } p-2 rounded-md`}
                            id={item}
                            key={index}
                            onClick={() => {
                              item === '全部语言'
                                ? router.replace(
                                    path.replace(/\/lang\/[^/]+/, '')
                                  )
                                : router.replace(generatePath(item, 'lang'));
                            }}
                          >
                            <span
                              className={`text-sm hover:text-blue-500 transition-colors duration-300 truncate ${
                                paramsFilter.lang === item
                                  ? 'text-blue-500'
                                  : 'text-white'
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {filterTypeList[
                    filterTypeList.findIndex(
                      (item) => item.type_id === paramsFilter.typeId
                    )
                  ].type_extend_obj.year != '' && (
                    <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar'>
                      {listConverter('year').map((item, index) => {
                        return (
                          <div
                            className={`flex flex-col items-center cursor-pointer ${
                              paramsFilter.year === item ? 'bg-[#FAC33D1F]' : ''
                            } p-2 rounded-md`}
                            id={item}
                            key={index}
                            onClick={() => {
                              item === '全部时间'
                                ? router.replace(
                                    path.replace(/\/year\/[^/]+/, '')
                                  )
                                : router.replace(generatePath(item, 'year'));
                            }}
                          >
                            <span
                              className={`text-sm hover:text-blue-500 transition-colors duration-300 truncate ${
                                paramsFilter.year === item
                                  ? 'text-blue-500'
                                  : 'text-white'
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div
                  className={`transition-all duration-500 md:h-fit
              ease-out ${!collapse ? 'opacity-0 h-0 z-10' : 'h-[36px] py-2'}
              flex justify-between items-center px-4 container text-sm md:hidden`}
                >
                  <div>
                    {
                      advanceFilterItem.find(
                        (item) => item.value === paramsFilter.by
                      ).text
                    }
                  </div>
                  <div className='rounded-full w-1 h-1 bg-blue-500'></div>
                  <div>{paramsFilter.class}</div>
                  <div className='rounded-full w-1 h-1 bg-blue-500'></div>
                  <div>{paramsFilter.area}</div>
                  <div className='rounded-full w-1 h-1 bg-blue-500'></div>
                  <div>{paramsFilter.lang}</div>
                  <div className='rounded-full w-1 h-1 bg-blue-500'></div>
                  <div>{paramsFilter.year}</div>
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      setCollapse(false);
                      setTimeout(() => {
                        setButtonUncollapse(true);
                      }, 300);
                    }}
                  >
                    <FontAwesomeIcon
                      className='text-blue-500 '
                      icon={faAngleDown}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* bottom section  111 */}
          {loading ? (
            <LoadingPage full={true} />
          ) : (
            <div className='w-screen flex flex-1 flex-col'>
              {videoList !== null ? (
                <div className='container grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-4'>
                  {videoList.map((vod, i) => {
                    return <VideoVerticalCard vod={vod} key={i} />;
                  })}
                </div>
              ) : !loadingVideoList ? (
                <div
                  className='w-screen flex flex-1 flex-col'
                  style={{ minHeight: '300px' }}
                >
                  <div className='flex flex-1 justify-center items-center flex-col'>
                    <Image
                      className='mx-2'
                      src={searchEmptyIcon}
                      alt='empty'
                      width={120}
                    />
                    <span>暂无数据</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
        <div ref={targetRef}>
          {(stillCanLoad || loadingVideoList) && (
            <div
              className='w-screen flex flex-1 flex-col'
              style={{ minHeight: '300px' }}
            >
              <Spinner></Spinner>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
