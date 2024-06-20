'use client';
import { searchEmptyIcon } from '@/asset/icons';
import { LoadingPage } from '@/components/loading';
import { VideoVerticalCard } from '@/components/videoItem/videoVerticalCard';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { Spinner } from '@/components/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const getIsScroll = (state) => state.isScroll;
const getIsTop = (state) => state.isTop;

export const FilmLibrary = ({ advanceFilterItem, filterTypeList, paramsFilter, videos }) => {
  const [loading, setLoading] = useState(false);
  const [videoList, setVideoList] = useState(videos ? videos.List : null);
  const [loadingVideoList, setLoadingVideoList] = useState(false);
  const [stillCanLoad, setStillCanLoad] = useState(videos.Page < videos.TotalPageCount);
  const [nextPage, setNextPage] = useState(videos.Page + 1);
  const [collapse, setCollapse] = useState(false);
  const [buttonUncollapse, setButtonUncollapse] = useState(false);

  const isScrolling = useSelector(getIsScroll);
  const isAtTop = useSelector(getIsTop);

  const targetRef = useRef(null);
  const path = usePathname();

  const getSearchingListApi = async (params) => {
    return YingshiApi(
      URL_YINGSHI_VOD.searchingList,
      {
        order: 'desc',
        limit: 30,
        page: nextPage,
        tid: params.typeId,
        class: params.class == '全部类型' ? '' : params.class,
        by: params.by,
        area: params.area == '全部地区' ? '' : params.area,
        lang: params.lang == '全部语言' ? '' : params.lang,
        year: params.year == '全部时间' ? '' : params.year,
      },
      { method: 'GET' }
    );
  };

  const getSearchingList = async () => {
    let currentPage = nextPage;
    const videoListing = await getSearchingListApi(paramsFilter);

    setVideoList((prev) => [...prev, ...videoListing.List]);

    if (nextPage > videoListing.TotalPageCount - 1) {
      setStillCanLoad(false);
    } else {
      setStillCanLoad(true);
      setNextPage(currentPage + 1);
    }
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
    if (type == 'class') {
      list =
        filterTypeList[
          filterTypeList.findIndex(
            (item) => item.type_id === paramsFilter.typeId
          )
        ].type_extend_obj.class.split(',');
      list.unshift('全部类型');
    } else if (type == 'area') {
      list =
        filterTypeList[
          filterTypeList.findIndex(
            (item) => item.type_id === paramsFilter.typeId
          )
        ].type_extend_obj.area.split(',');
      list.unshift('全部地区');
    } else if (type == 'lang') {
      list =
        filterTypeList[
          filterTypeList.findIndex(
            (item) => item.type_id === paramsFilter.typeId
          )
        ].type_extend_obj.lang.split(',');
      list.unshift('全部语言');
    } else if (type == 'year') {
      list =
        filterTypeList[
          filterTypeList.findIndex(
            (item) => item.type_id === paramsFilter.typeId
          )
        ].type_extend_obj.year.split(',');
      list.unshift('全部时间');
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
          return path.replace(/\/id\/[^/]+/, match => `${match}/${type}/${value}`);
        case 'year':
          return `${path}/year/${value}`;
        default:
          return path;
      }
    }
  }

  return (
    <>
      <div className='flex flex-1 justify-center flex-col'>
        <div className="flex w-screen flex-col items-center">
          <div
            className={`bg-[#1D2023] w-screen h-auto p-1 z-20 top-[51px] md:static`}
          >
            <div className="flex md:flex-wrap gap-x-4 gap-y-2 pl-4 py-2 container">
              {filterTypeList.map((item, index) => {
                return (
                  <Link
                    className="flex flex-col items-center cursor-pointer"
                    id={item.type_id}
                    key={index}
                    href={`/vod/show/by/${advanceFilterItem[0].value}/id/${item.type_id}`}
                  >
                    <span
                      className={`hover:text-yellow-500 transition-colors duration-300 truncate ${
                        paramsFilter.typeId === item.type_id
                          ? 'text-yellow-500'
                          : 'text-white'
                      }`}
                    >
                      {item.type_name}
                    </span>
                    {paramsFilter.typeId === item.type_id ? (
                      <div className="border-2 border-yellow-500 w-5 h-0.5 rounded-lg"></div>
                    ) : null}
                  </Link>
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
              <div className="flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar">
                {advanceFilterItem.map((item, index) => {
                  return (
                    <Link
                      className={`flex flex-col items-center cursor-pointer ${
                        paramsFilter.by === item.value ? 'bg-[#FAC33D1F]' : ''
                      } p-2 rounded-md`}
                      id={item.value}
                      key={index}
                      href={generatePath(item.value, 'by')}
                    >
                      <span
                        className={`text-sm hover:text-yellow-500 transition-colors duration-300 truncate ${
                          paramsFilter.by === item.value
                            ? 'text-yellow-500'
                            : 'text-white'
                        }`}
                      >
                        {item.text}
                      </span>
                    </Link>
                  );
                })}
              </div>
              {filterTypeList[
                filterTypeList.findIndex(
                  (item) => item.type_id === paramsFilter.typeId
                )
              ].type_extend_obj.class != '' && (
                <div className="flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar">
                  {listConverter('class').map((item, index) => {
                    return (
                      <Link
                          className={`flex flex-col items-center cursor-pointer ${
                              paramsFilter.class === item ? 'bg-[#FAC33D1F]' : ''
                          } p-2 rounded-md`}
                          id={item}
                          key={index}
                          href={item === '全部类型' ?
                              path.replace(/\/class\/[^/]+/, '') :
                              generatePath(item, 'class')
                          }
                      >
                        <span
                          className={`text-sm hover:text-yellow-500 transition-colors duration-300 truncate ${
                            paramsFilter.class === item
                              ? 'text-yellow-500'
                              : 'text-white'
                          }`}
                        >
                          {item}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
              {filterTypeList[
                filterTypeList.findIndex(
                  (item) => item.type_id === paramsFilter.typeId
                )
              ].type_extend_obj.area != '' && (
                <div className="flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar">
                  {listConverter('area').map((item, index) => {
                    return (
                      <Link
                        className={`flex flex-col items-center cursor-pointer ${
                          paramsFilter.area === item ? 'bg-[#FAC33D1F]' : ''
                        } p-2 rounded-md`}
                        id={item}
                        key={index}
                        href={item === '全部地区' ?
                          path.replace(/\/area\/[^/]+/, '') :
                          generatePath(item, 'area')
                        }
                      >
                        <span
                          className={`text-sm hover:text-yellow-500 transition-colors duration-300 truncate ${
                            paramsFilter.area === item
                              ? 'text-yellow-500'
                              : 'text-white'
                          }`}
                        >
                          {item}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
              {filterTypeList[
                filterTypeList.findIndex(
                  (item) => item.type_id === paramsFilter.typeId
                )
              ].type_extend_obj.lang != '' && (
                <div className="flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar">
                  {listConverter('lang').map((item, index) => {
                    return (
                      <Link
                        className={`flex flex-col items-center cursor-pointer ${
                          paramsFilter.lang === item ? 'bg-[#FAC33D1F]' : ''
                        } p-2 rounded-md`}
                        id={item}
                        key={index}
                        href={item === '全部语言' ?
                            path.replace(/\/lang\/[^/]+/, '') :
                            generatePath(item, 'lang')
                        }
                      >
                        <span
                          className={`text-sm hover:text-yellow-500 transition-colors duration-300 truncate ${
                            paramsFilter.lang === item
                              ? 'text-yellow-500'
                              : 'text-white'
                          }`}
                        >
                          {item}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
              {filterTypeList[
                filterTypeList.findIndex(
                  (item) => item.type_id === paramsFilter.typeId
                )
              ].type_extend_obj.year != '' && (
                <div className="flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll no-scrollbar">
                  {listConverter('year').map((item, index) => {
                    return (
                      <Link
                        className={`flex flex-col items-center cursor-pointer ${
                          paramsFilter.year === item ? 'bg-[#FAC33D1F]' : ''
                        } p-2 rounded-md`}
                        id={item}
                        key={index}
                        href={item === '全部时间' ?
                            path.replace(/\/year\/[^/]+/, '') :
                            generatePath(item, 'year')
                        }
                      >
                        <span
                          className={`text-sm hover:text-yellow-500 transition-colors duration-300 truncate ${
                            paramsFilter.year === item
                              ? 'text-yellow-500'
                              : 'text-white'
                          }`}
                        >
                          {item}
                        </span>
                      </Link>
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
              <div className="rounded-full w-1 h-1 bg-yellow-500"></div>
              <div>{paramsFilter.class}</div>
              <div className="rounded-full w-1 h-1 bg-yellow-500"></div>
              <div>{paramsFilter.area}</div>
              <div className="rounded-full w-1 h-1 bg-yellow-500"></div>
              <div>{paramsFilter.lang}</div>
              <div className="rounded-full w-1 h-1 bg-yellow-500"></div>
              <div>{paramsFilter.year}</div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setCollapse(false);
                  setTimeout(() => {
                    setButtonUncollapse(true);
                  }, 300);
                }}
              >
                <FontAwesomeIcon
                  className="text-yellow-500 "
                  icon={faAngleDown}
                />
              </div>
            </div>
          </div>
          <div className="w-screen flex flex-1 flex-col">
            {videoList !== null ? (
              <div className='container grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-4'>
                {videoList.map((vod, i) => {
                  return <VideoVerticalCard vod={vod} key={i} />;
                })}
              </div>
            ) : (
              <div className="flex flex-1 justify-center items-center flex-col">
                <Image
                  className="mx-2"
                  src={searchEmptyIcon}
                  alt="empty"
                  width={120}
                />
                <span>暂无数据</span>
              </div>
            )}
          </div>
        </div>
        <div ref={targetRef}>
          {(stillCanLoad) && <Spinner></Spinner>}
        </div>
      </div>
    </>
  );
};
