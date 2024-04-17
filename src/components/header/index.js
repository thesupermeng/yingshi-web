'use client';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import {
  HistoryIcon,
  Logo,
  PhoneIcon,
  searchIcon,
  moreIcon,
  searchEmptyIcon,
  leftArrow,
  clear,
} from '@/asset/icons';

import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { YingshiApi } from '@/util/YingshiApi';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { LoadingPage } from '@/components/loading';
import { setHeaderMenu, setSelectedId } from '@/store/headerData';

const getHeaderMenu = (state) => state.headerMenu;
const getHeaderMenuSelected = (state) => state.headerMenuSelected;

const Header = () => {
  const dispatch = useDispatch();
  // const { rightBarContent } = useSelector((s) => s.common);
  //const { isLogin } = useUser();
  const containerRef = useRef(null);
  const dropdownMoreRef = useRef(null);
  const dropdownSearchRef = useRef(null);
  const { t } = useTranslation();

  // const onClick = () => {
  //   dispatch(hideRightBarContent('All'));
  //   dispatch(showRightBarContent(RightSidebarContantTypes.BetCart));
  // };
  const headerMenu = useSelector(getHeaderMenu);
  const selectedMenu = useSelector(getHeaderMenuSelected);
  const [visibleItems, setVisibleItems] = useState([]);
  const [hiddenItems, setHiddenItems] = useState([]);

  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMore, setOpenMore] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchHistoryList, setSearchHistoryList] = useState([]);
  const [topTenList, setTopTenList] = useState([]);
  const [searchingList, setSearchList] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const [loadingSearching, setLoadingSearching] = useState(false);

  const handleOpenMore = () => {
    setOpenMore(!openMore);
  };

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleChange = (event) => {
    setLoadingSearching(true);
    const newValue = event.target.value;
    setSearchInput(newValue);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to call the function after 3 seconds
    const newTimeoutId = setTimeout(async () => {
      // Call your function here
      // const encodedData = encodeURIComponent(newValue);
      // console.log(encodedData)
      if (newValue !== '') {
        const res = await getSearchingList(newValue);
        if (res.List != null) {
          setSearchList(res.List);
        } else {
          setSearchList([]);
        }
        setLoadingSearching(false);
      }
    }, 2000);

    // Update the timeoutId state
    setTimeoutId(newTimeoutId);
  };

  const handleSearch = () => {
    handleAddSearchHistory();
  };

  const handleAddSearchHistory = () => {
    let searchHistoryData = JSON.parse(
      localStorage.getItem('searchHistoryList')
    );

    if (searchHistoryData != null) {
      if (searchHistoryData.indexOf(searchInput) == -1) {
        searchHistoryData.push(searchInput);
      }

      if (searchHistoryData.length > 10) {
        searchHistoryData.splice(0, 1);
      }
    } else {
      searchHistoryData = [searchInput];
    }

    localStorage.setItem(
      'searchHistoryList',
      JSON.stringify(searchHistoryData)
    );
    setSearchHistoryList(JSON.parse(localStorage.getItem('searchHistoryList')));
    setOpenSearch(false);
    router.push('/search/' + searchInput);
  };

  const handleClearSearchHistory = () => {
    localStorage.removeItem('searchHistoryList');
    setSearchHistoryList([]);
  };

  const getTopNav = async () => {
    return YingshiApi(URL_YINGSHI_VOD.homeGetNav, {}, { method: 'GET' });
  };

  const getTopTenList = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.topTenList,
      {
        // TODO, temp hardcode
        id: 1,
        appName: 'E7%88%B1%E9%9F%A9%E5%89%A7TV',
        platform: 'ANDROID',
        channelId: 'GOOGLE_PLAY',
        ip: '211.24.92.4',
      },
      { method: 'GET' }
    );
  };

  const getSearchingList = async (value) => {
    return YingshiApi(
      URL_YINGSHI_VOD.searchingList,
      {
        wd: value,
        limit: 15,
        page: 1,
      },
      { method: 'GET' }
    );
  };

  const handleClick = (value) => {
    dispatch(setSelectedId(value));
    if (value == 99) {
      router.push('/topic');
    } else if (value == 999) {
      router.push('/filmLibrary');
    } else {
      router.push('/');
    }
  };

  const calculateItemsVisibility = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const itemWidth = 56; // Assuming each item has a fixed width
      const maxVisibleItems =
        Math.floor(containerWidth / itemWidth) < headerMenu.headerMenu?.length
          ? Math.floor(containerWidth / itemWidth) - 1 <= 0
            ? 0
            : Math.floor(containerWidth / itemWidth) - 1
          : headerMenu.headerMenu?.length;
      setVisibleItems(headerMenu.headerMenu?.slice(0, maxVisibleItems));
      setHiddenItems(headerMenu.headerMenu?.slice(maxVisibleItems));
    }
  };

  useEffect(()=> {
    if (pathname.startsWith('/filmLibrary')) dispatch(setSelectedId(999));
      else if (pathname.startsWith('/topic')) dispatch(setSelectedId(99));
      else if (pathname.startsWith('/play/')) dispatch(setSelectedId(-1));
  }, [pathname])

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('searchHistoryList'));
    if (list) {
      setSearchHistoryList(list);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    // Simulating asynchronous data fetching
    const fetchData = async () => {
      let menuItem = await getTopNav();
      const topTenItem = await getTopTenList();

      setTopTenList(topTenItem.vod_list);
      menuItem.push({
        id: 99,
        name: '播单',
      });
      menuItem.push({
        id: 999,
        name: '片库',
      });
      dispatch(setHeaderMenu(menuItem));
      dispatch(setSelectedId(menuItem[0].id));

      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    calculateItemsVisibility();
    const resizeListener = () => {
      calculateItemsVisibility();
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [headerMenu]);

  useEffect(() => {
    // Function to close the dropdown when clicking outside of it
    function handleClickOutsideDropDownMore(event) {
      if (
        dropdownMoreRef.current &&
        !dropdownMoreRef.current.contains(event.target)
      ) {
        setOpenMore(false);
      }
    }

    function handleClickOutsideSearch(event) {
      if (
        dropdownSearchRef.current &&
        !dropdownSearchRef.current.contains(event.target)
      ) {
        setOpenSearch(false);
      }
    }

    // Attach event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutsideDropDownMore);
    document.addEventListener('mousedown', handleClickOutsideSearch);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropDownMore);
      document.removeEventListener('mousedown', handleClickOutsideSearch);
    };
  }, []);

  if (loading) {
    return <LoadingPage full={true} />;
  }

  let defaultHeader = (
    <div
      className={
        pathname.startsWith('/play/') || pathname.startsWith('/filmLibrary')
          ? 'w-screen z-30 bg-gradient-to-b from-black from-15%'
          : 'md:absolute z-30 w-screen bg-gradient-to-b from-black from-15%'
      }
    >
      <div className='flex py-3 md:mx-20 mx-2.5 justify-center'>
        <div className='gap-y-2 flex-col w-full xl:w-11/12 md:flex-row flex'>
          <div className='flex-1 flex gap-x-2 md:justify-start'>
            <div
              className={`flex justify-between w-24 md:w-28 ${
                openSearch ? 'hidden md:flex' : ''
              }`}
            >
              <Image
                alt='鲨鱼影视'
                src={Logo}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleClick(headerMenu.headerMenu[0].id)
                }}
              />
            </div>
            <div className='items-center flex flex-1 md:flex-none'>
              <div ref={dropdownSearchRef} className=' flex-1 md:flex-none'>
                <div className='relative flex flex-1 md:flex-none'>
                  <div
                    className={`flex justify-between pr-4 pl-2 ${
                      openSearch ? 'flex md:hidden' : 'hidden'
                    }`}
                  >
                    <Image
                      alt='back'
                      src={leftArrow}
                      style={{ width: '12px' }}
                      onClick={() => {
                        setOpenSearch(false);
                        setSearchInput('');
                      }}
                    />
                  </div>
                  <input
                    type='text'
                    placeholder='输入搜索关键词'
                    value={searchInput}
                    onChange={handleChange}
                    className='border-0 border-gray-300 text-white md:rounded-md rounded-full pl-4 pr-10 py-2 focus:outline-none w-full md:w-60'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    onClick={handleOpenSearch}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                  <Image
                    className='h-6 w-6 absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400'
                    src={searchIcon}
                    alt='search'
                    width={20}
                    onClick={handleSearch}
                  />
                </div>
                {openSearch ? (
                  <div className='absolute flex flex-col items-center pt-1 w-full h-[calc(100%_-_52px)] z-10 left-0 md:left-auto md:w-96 md:h-[500px]'>
                    <div className='py-3 px-4 flex flex-col md:rounded-md w-full h-full md:h-fit overflow-scroll bg-[#1d2023] md:bg-[#1d2023e0] md:w-96'>
                      {searchInput ? (
                        loadingSearching ? (
                          <LoadingPage full={false} />
                        ) : searchingList.length > 0 ? (
                          searchingList.map((item, index) => {
                            return (
                              <div
                                className='flex flex-row justify-between py-2.5'
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenSearch(false);
                                  setSearchInput('');
                                  handleAddSearchHistory();
                                  router.push(`/play/${item.vod_id}`);
                                }}
                              >
                                <div className='flex flex-row'>
                                  <div className='text-sm'>{item.vod_name}</div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className='flex items-center justify-center flex-col h-full'>
                            <Image
                              className='mx-2'
                              src={searchEmptyIcon}
                              alt='empty'
                              width={120}
                            />
                            <span>暂无播单</span>
                          </div>
                        )
                      ) : (
                        <>
                          {searchHistoryList.length > 0 ? (
                            <div>
                              <div className='flex flex-row justify-between items-center pb-2'>
                                <div className='text-sm'>历史搜索</div>
                                <div className='flex flex-row' onClick={handleClearSearchHistory}>
                                  <span
                                    className='text-xs'
                                    style={{ color: 'rgba(156, 156, 156, 1)' }}
                                  >
                                    清除
                                  </span>
                                  <Image
                                    className='mx-1'
                                    src={clear}
                                    alt='clear'
                                    width={10}
                                  />
                                </div>
                              </div>
                              <div className='flex flex-wrap py-2 gap-2'>
                                {searchHistoryList.map((item, index) => {
                                  return (
                                    <div
                                      className='py-1 px-2 rounded-lg'
                                      style={{
                                        background: 'rgba(255, 255, 255, 0.06)',
                                        color: 'rgba(156, 156, 156, 1)',
                                      }}
                                      key={index}
                                    >
                                      {item}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                          <div className='flex flex-row justify-between'>
                            <div className='text-sm'>热搜总榜</div>
                          </div>
                          {topTenList.map((item, index) => {
                            return (
                              <div
                                className='flex flex-row justify-between py-2.5'
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenSearch(false);
                                  router.push(`/play/${item.vod_id}`);
                                }}
                              >
                                <div className='flex flex-row'>
                                  <div
                                    className='text-sm w-8 text-center font-bold'
                                    style={{
                                      color:
                                        index == 0
                                          ? 'rgba(0, 106, 178, 1)'
                                          : index == 1
                                          ? 'rgba(0, 133, 224, 1)'
                                          : index == 2
                                          ? 'rgba(96, 191, 255, 1)'
                                          : 'rgba(156, 156, 156, 1)',
                                    }}
                                  >
                                    {index + 1}
                                  </div>
                                  <div className='text-sm'>{item.vod_name}</div>
                                </div>
                                <div
                                  className='text-xs pr-4'
                                  style={{ color: 'rgba(156, 156, 156, 1)' }}
                                >
                                  {item.type_name}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            {!openSearch ? (
              <div className='flex-row flex md:hidden'>
                <Image
                  className='cursor-pointer'
                  src={HistoryIcon}
                  alt='history'
                  width={30}
                />
                <div className='flex items-center px-0'>
                  <div className='h-4' />
                </div>
                <div className='flex flex-row cursor-pointer'>
                  <Image
                    className='mx-2'
                    src={PhoneIcon}
                    alt='app'
                    width={15}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <div
            className='grow flex items-center justify-end'
            style={{ maxWidth: `${headerMenu.headerMenu?.length * 56}px` }}
            ref={containerRef}
          >
            {visibleItems?.map((navItem, index) => {
              return (
                <div
                  className='flex flex-1 flex-col items-center cursor-pointer header-tab'
                  id={navItem.id}
                  key={index}
                  onClick={() => {
                    handleClick(navItem.id);
                  }}
                >
                  <span
                    className={`hover:text-blue-500 transition-colors duration-300 truncate ${
                      selectedMenu.id === navItem.id
                        ? 'text-blue-500'
                        : 'text-white'
                    }`}
                  >
                    {navItem.name}
                  </span>
                  {selectedMenu.id === navItem.id ? (
                    <div className='border-2 border-blue-500 w-5 h-0.5 rounded-lg'></div>
                  ) : null}
                </div>
              );
            })}
            {hiddenItems.length > 0 && (
              <div className='w-14 flex flex-col items-center cursor-pointer'>
                <div className='relative' ref={dropdownMoreRef}>
                  <button
                    onClick={handleOpenMore}
                    className='flex flex-row items-center'
                  >
                    <span>更多</span>
                    <Image
                      className='mx-1'
                      alt='more'
                      src={moreIcon}
                      width={14}
                    />
                  </button>
                  {openMore ? (
                    <div className='absolute flex flex-col md:items-center items-end md:-left-2 pt-1 right-0'>
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          top: '-10px',
                          borderLeft: '10px solid transparent',
                          borderRight: '10px solid transparent',
                          borderBottom: '10px solid rgba(29, 32, 35, 0.88)',
                        }}
                      />
                      <div
                        className='py-3 flex flex-col md:rounded-md rounded-b-lg rounded-tl-lg'
                        style={{ backgroundColor: 'rgba(29, 32, 35, 0.88)' }}
                      >
                        {hiddenItems?.map((navItem, index) => {
                          return (
                            <div
                              className='w-32 flex flex-col cursor-pointer py-2 items-center'
                              id={navItem.id}
                              key={index}
                              onClick={() => {
                                handleClick(navItem.id);
                                setOpenMore(!openMore);
                              }}
                            >
                              <span
                                className={`hover:text-blue-500 transition-colors duration-300 truncate ${
                                  selectedMenu.id === navItem.id
                                    ? 'text-blue-500'
                                    : 'text-white'
                                }`}
                              >
                                {navItem.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
          <div className='flex-row hidden md:flex'>
            <Image
              className='cursor-pointer'
              src={HistoryIcon}
              alt='history'
              width={30}
            />
            <div className='flex items-center px-2'>
              <div className='border-l-2 border-white h-4' />
            </div>
            <div className='flex flex-row cursor-pointer'>
              <Image className='mx-2' src={PhoneIcon} alt='app' width={14} />
              <div className='flex items-center'>APP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  if (pathname.startsWith('/topic/')) {
    return (<></>)
  };

  if (pathname.startsWith('/play')) {
    return (
      <div className={'desktop'}>
{defaultHeader}
    </div>)
  };

 

  if (pathname.startsWith('/topic')) {
    return (
      <>
        <div className={'md:absolute z-30 w-screen mobile'}>
          <div className='flex py-3 md:mx-20 mx-2.5'>
            <div className='gap-y-2 flex-col w-full md:flex-row flex'>
              <div className='flex-1 flex gap-x-2 md:justify-start'>
                <div
                  className={`flex justify-between w-24 md:w-28 ${
                    openSearch ? 'hidden md:flex' : ''
                  }`}
                >
                  <span className='text-topic-title'> 播单 </span>
                </div>
                <div className='items-center flex flex-1 md:flex-none'>
                  <div ref={dropdownSearchRef} className=' flex-1 md:flex-none'>
                    <div className='relative flex flex-1 md:flex-none'>
                      <div
                        className={`flex justify-between pr-2 ${
                          openSearch ? 'flex md:hidden' : 'hidden'
                        }`}
                      >
                        <Image
                          alt='back'
                          src={leftArrow}
                         // style={{ width: '25px' }}
                          onClick={() => {
                            setOpenSearch(false);
                            setSearchInput('');
                          }}
                        />
                      </div>
                      {/* topic search bar */}
                      <div className='relative flex-1'>
                        <input
                          type='text'
                          placeholder='输入搜索关键词'
                          value={searchInput}
                          onChange={handleChange}
                          className='border-0 border-gray-300 text-white rounded-full pl-10 pr-10 py-2 focus:outline-none w-full'
                          style={{
                            backgroundColor:
                              'rgba(255, 255, 255, 0.08) !important',
                          }}
                          onClick={handleOpenSearch}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                          }}
                        />
                        <div className='absolute inset-y-0 left-3 flex items-center justify-center'>
                          <Image
                            src={searchIcon}
                            alt='search'
                            width={20}
                            className='text-gray-400'
                            onClick={handleSearch}
                          />
                        </div>
                      </div>
                    </div>
                    {openSearch ? (
                      <div className='absolute flex flex-col items-center pt-1 w-full h-[calc(100%_-_52px)] z-10 left-0 md:left-auto md:w-96 md:h-[500px]'>
                        <div className='py-3 px-4 flex flex-col md:rounded-md w-full h-full overflow-scroll bg-[#1d2023] md:bg-[#1d2023e0] md:w-96 md:h-[500px]'>
                          {searchInput ? (
                            loadingSearching ? (
                              <LoadingPage full={false} />
                            ) : searchingList.length > 0 ? (
                              searchingList.map((item, index) => {
                                return (
                                  <div
                                    className='flex flex-row justify-between py-2.5'
                                    key={index}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOpenSearch(false);
                                      setSearchInput('');
                                      handleAddSearchHistory();
                                      router.push(`/play/${item.vod_id}`);
                                    }}
                                  >
                                    <div className='flex flex-row'>
                                      <div className='text-sm'>
                                        {item.vod_name}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className='flex items-center justify-center flex-col h-full'>
                                <Image
                                  className='mx-2'
                                  src={searchEmptyIcon}
                                  alt='empty'
                                  width={120}
                                />
                                <span>暂无播单</span>
                              </div>
                            )
                          ) : (
                            <>
                              {searchHistoryList.length > 0 ? (
                                <div>
                                  <div className='flex flex-row justify-between items-center pb-2'>
                                    <div className='text-sm'>历史搜索</div>
                                    <div
                                      className='text-xs'
                                      style={{
                                        color: 'rgba(156, 156, 156, 1)',
                                      }}
                                      onClick={handleClearSearchHistory}
                                    >
                                      清除
                                    </div>
                                  </div>
                                  <div className='flex flex-wrap py-2 gap-2'>
                                    {searchHistoryList.map((item, index) => {
                                      return (
                                        <div
                                          className='py-1 px-2 rounded-lg'
                                          style={{
                                            background:
                                              'rgba(255, 255, 255, 0.06)',
                                            color: 'rgba(156, 156, 156, 1)',
                                          }}
                                          key={index}
                                        >
                                          {item}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : null}
                              <div className='flex flex-row justify-between'>
                                <div className='text-sm'>热搜总榜</div>
                              </div>
                              {topTenList.map((item, index) => {
                                return (
                                  <div
                                    className='flex flex-row justify-between py-2.5'
                                    key={index}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOpenSearch(false);
                                      router.push(`/play/${item.vod_id}`);
                                    }}
                                  >
                                    <div className='flex flex-row'>
                                      <div
                                        className='text-sm w-8 text-center font-bold'
                                        style={{
                                          color:
                                            index == 0
                                              ? 'rgba(0, 106, 178, 1)'
                                              : index == 1
                                              ? 'rgba(0, 133, 224, 1)'
                                              : index == 2
                                              ? 'rgba(96, 191, 255, 1)'
                                              : 'rgba(156, 156, 156, 1)',
                                        }}
                                      >
                                        {index + 1}
                                      </div>
                                      <div className='text-sm'>
                                        {item.vod_name}
                                      </div>
                                    </div>
                                    <div
                                      className='text-xs'
                                      style={{
                                        color: 'rgba(156, 156, 156, 1)',
                                      }}
                                    >
                                      {item.type_name}
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                {!openSearch ? (
                  <div className='flex-row flex md:hidden'>
                    <Image
                      className='cursor-pointer'
                      src={HistoryIcon}
                      alt='history'
                      width={30}
                    />
                    <div className='flex items-center px-0'>
                      <div className='h-4' />
                    </div>
                    <div className='flex flex-row cursor-pointer'>
                      <Image
                        className='mx-2'
                        src={PhoneIcon}
                        alt='app'
                        width={15}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className='desktop'>{defaultHeader}</div>
      </>
    );
  };

  return defaultHeader;
};
export default Header;
