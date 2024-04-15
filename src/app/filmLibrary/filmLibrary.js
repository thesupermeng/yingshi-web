import { searchEmptyIcon } from '@/asset/icons';
import { LoadingPage } from '@/components/loading';
import { VideoVerticalCard } from '@/components/videoItem/videoVerticalCard';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

export const FilmLibrary = ({}) => {
  const [loading, setLoading] = useState(true);
  const [filterTypeList, setFilterTypeList] = useState(null);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [videoList, setVideoList] = useState(null);

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

  const getFilterTypeList = async () => {
    return YingshiApi(URL_YINGSHI_VOD.filteringTypeList, {}, { method: 'GET' });
  };

  const getSearchingList = async (params) => {
    return YingshiApi(
      URL_YINGSHI_VOD.searchingList,
      {
        order: 'desc',
        limit: 30,
        page: 1,
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

  useEffect(() => {
    // Simulating asynchronous data fetching
    const fetchData = async () => {
      const filteringTypeList = await getFilterTypeList();
      setFilterTypeList(filteringTypeList);
      setParamsFilter({
        typeId: filteringTypeList[0].type_id,
        by: advanceFilterItem[0].value,
        class: '全部类型',
        area: '全部地区',
        lang: '全部语言',
        year: '全部时间',
      });
    };

    fetchData();
  }, []);

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

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (paramsFilter !== null) {
        const videoListing = await getSearchingList(paramsFilter);

        setVideoList(videoListing);
        setLoading(false);
      }
    };

    fetchData();
  }, [paramsFilter]);

  const filterVideoList = (value, type) => {
    let params = { ...paramsFilter };
    if (type == 'type') {
      params.typeId = value;
    } else if (type == 'by') {
      params.by = value;
    } else if (type == 'class') {
      params.class = value;
    } else if (type == 'area') {
      params.area = value;
    } else if (type == 'lang') {
      params.lang = value;
    } else if (type == 'year') {
      params.year = value;
    }
    setParamsFilter(params);
  };

  return (
    <div className='flex flex-1 justify-center'>
      {loading ? (
        <LoadingPage full={false} />
      ) : (
        <div className='flex w-full flex-col items-center'>
          <div className='bg-[#1D2023] w-screen p-1'>
            <div className='flex flex-col divide-y divide-gray-800 py-2 md:mx-20 mx-2.5'>
              <div className='flex md:flex-wrap gap-x-4 gap-y-2 pl-2 py-2'>
                {filterTypeList.map((item, index) => {
                  return (
                    <div
                      className='flex flex-col items-center cursor-pointer'
                      id={item.type_id}
                      key={index}
                      onClick={() => {
                        filterVideoList(item.type_id, 'type');
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
              <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2'>
                {advanceFilterItem.map((item, index) => {
                  return (
                    <div
                      className={`flex flex-col items-center cursor-pointer ${
                        paramsFilter.by === item.value ? 'bg-[#0085E01f]' : ''
                      } p-2 rounded-md`}
                      id={item.value}
                      key={index}
                      onClick={() => {
                        filterVideoList(item.value, 'by');
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
              <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll'>
                {listConverter('class').map((item, index) => {
                  return (
                    <div
                      className={`flex flex-col items-center cursor-pointer ${
                        paramsFilter.class === item ? 'bg-[#0085E01f]' : ''
                      } p-2 rounded-md`}
                      id={item}
                      key={index}
                      onClick={() => {
                        filterVideoList(item, 'class');
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
              <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll'>
                {listConverter('area').map((item, index) => {
                  return (
                    <div
                      className={`flex flex-col items-center cursor-pointer ${
                        paramsFilter.area === item ? 'bg-[#0085E01f]' : ''
                      } p-2 rounded-md`}
                      id={item}
                      key={index}
                      onClick={() => {
                        filterVideoList(item, 'area');
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
              <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll'>
                {listConverter('lang').map((item, index) => {
                  return (
                    <div
                      className={`flex flex-col items-center cursor-pointer ${
                        paramsFilter.lang === item ? 'bg-[#0085E01f]' : ''
                      } p-2 rounded-md`}
                      id={item}
                      key={index}
                      onClick={() => {
                        filterVideoList(item, 'lang');
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
              <div className='flex md:flex-wrap gap-x-4 gap-y-2 py-2 overflow-scroll'>
                {listConverter('year').map((item, index) => {
                  return (
                    <div
                      className={`flex flex-col items-center cursor-pointer ${
                        paramsFilter.year === item ? 'bg-[#0085E01f]' : ''
                      } p-2 rounded-md`}
                      id={item}
                      key={index}
                      onClick={() => {
                        filterVideoList(item, 'year');
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
            </div>
          </div>
          {videoList.Total > 0 ? (
            <div className='md:mx-20 mx-2.5 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-4'>
              {videoList.List?.map((vod, i) => {
                return <VideoVerticalCard vod={vod} key={i} />;
              })}
            </div>
          ) : (
            <div className='flex flex-1 justify-center items-center flex-col'>
              <Image
                className='mx-2'
                src={searchEmptyIcon}
                alt='empty'
                width={120}
              />
              <span>暂无播单</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
