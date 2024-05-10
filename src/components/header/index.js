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
  userIcon,
  vipIcon,
  vipLightIcon,
  glyph,
  noADIcon,
  subtractIcon,
  ArrowLeftIcon,
  AppImage,
  AppleStoreIcon,
  AndroidIcon,
} from '@/asset/icons';

import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { YingshiApi } from '@/util/YingshiApi';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { LoadingPage } from '@/components/loading';
import {
  setHeaderMenu,
  setSelectedId,
  setSpecialSelectedId,
} from '@/store/headerData';
import TopicHeader from './../../components/topicHeader';
import { updateUserInfo } from '@/services/yingshiUser';
import QRCode from 'qrcode.react';
import LoginFlow from '@/components/login/loginFlow';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import { useLoginOpen } from '@/hook/yingshiScreenState/useLoginOpen';

const getHeaderMenu = (state) => state.headerMenu;
const getHeaderMenuSelected = (state) => state.headerMenuSelected;
const getSpecialHeaderMenuSelected = (state) => state.specialHeaderMenuSelected;
const getCurrentScrollPosition = (state) => state.currentScrollPosition;

const Header = () => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const dropdownMoreRef = useRef(null);
  const dropdownSearchRef = useRef(null);
  const dropdownVipRef = useRef(null);
  const dropdownHistoryRef = useRef(null);
  const dropdownAppRef = useRef(null);
  const loginFlowRef = useRef(null);

  const { t } = useTranslation();

  const headerMenu = useSelector(getHeaderMenu);
  const selectedMenu = useSelector(getHeaderMenuSelected);
  const selectedSpecialMenu = useSelector(getSpecialHeaderMenuSelected);
  const currentScrollPosition = useSelector(getCurrentScrollPosition);

  const [visibleItems, setVisibleItems] = useState([]);
  const [hiddenItems, setHiddenItems] = useState([]);
  const { isVip, userInfo } = useYingshiUser();

  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMore, setOpenMore] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openVip, setOpenVip] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [openApp, setOpenApp] = useState(false);
  const [searchHistoryList, setSearchHistoryList] = useState([]);
  const [watchHistoryList, setWatchHistoryList] = useState([]);
  const [topTenList, setTopTenList] = useState([]);
  const [searchingList, setSearchList] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const [loadingSearching, setLoadingSearching] = useState(false);
  const [headerBlack, setHeaderBlack] = useState(false);
  const [_, setOpenLogin] = useLoginOpen();

  const handleOpenMore = () => {
    setOpenMore(!openMore);
  };

  const handleOpenVip = (value) => {
    setOpenVip(value);
  };

  const handleOpenHistory = (value) => {
    if (!openHistory == true) {
      let watchHistoryData = JSON.parse(
        localStorage.getItem('watchHistoryList')
      );
      let artPlayerData = JSON.parse(
        localStorage.getItem('artplayer_settings')
      );

      if (watchHistoryData !== null) {
        const updatedWatchHistoryData = watchHistoryData.map((item) => {
          const watchedTimes = getObjectValue(artPlayerData, item.vodurl);
          if (watchedTimes !== 0) {
            return { ...item, watchtimes: watchedTimes };
          } else {
            if (item.watchtimes !== 0) {
              return { ...item };
            } else {
              return { ...item, watchtimes: watchedTimes };
            }
          }
        });

        localStorage.setItem(
          'watchHistoryList',
          JSON.stringify(updatedWatchHistoryData)
        );
        setWatchHistoryList(
          JSON.parse(localStorage.getItem('watchHistoryList'))
        );
      }
    }
    setOpenHistory(value);
  };

  const handleOpenApp = (value) => {
    setOpenApp(value);
  };

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const getObjectValue = (obj, targetKey) => {
    // Check if the object is defined and if it contains the 'times' key
    if (obj && obj.times && obj.times[targetKey]) {
      return obj.times[targetKey];
    } else {
      return 0; // Return null if the key is not found
    }
  };

  const secondsToHHMMSS = (seconds) => {
    // Convert seconds to integer
    seconds = parseInt(seconds);

    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format hours, minutes, and remaining seconds as HH:MM:SS
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

    return formattedTime;
  };

  const handleChange = (event) => {
    setLoadingSearching(true);
    const newValue = event.target.value;

    // Check if the first character is a space
    if (newValue.trim().length === 0) {
      setSearchInput('');
      return; // Exit early if the first character is a space
    }

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
    if (searchInput == '') {
      return;
    }
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
    // setSearchInput('');
    router.push('/search/' + searchInput);
  };

  const handleClearSearchHistory = () => {
    localStorage.removeItem('searchHistoryList');
    setSearchHistoryList([]);
  };

  const handleClearWatchHistory = () => {
    localStorage.removeItem('artplayer_settings');
    localStorage.removeItem('watchHistoryList');
    setWatchHistoryList([]);
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
    if (value == 998) {
      router.push('/topic');
    } else if (value == 999) {
      localStorage.removeItem('videoTypeId');
      localStorage.removeItem('videoClass');
      router.push('/filmLibrary');
    } else {
      dispatch(setSelectedId(value));
      router.push('/');
      setSearchInput('');
    }
  };

  const goToSeachResult = (query) => {
    setOpenSearch(false);
    setSearchInput(query);
    router.push('/search/' + query);
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

  useEffect(() => {
    if (currentScrollPosition.res > 300) {
      setHeaderBlack(true);
    } else {
      setHeaderBlack(false);
    }
  }, [currentScrollPosition]);

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
        id: 998,
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
    if (pathname.startsWith('/topic')) {
      dispatch(setSpecialSelectedId(998));
      dispatch(setSelectedId(0));
    } else if (pathname.startsWith('/filmLibrary')) {
      dispatch(setSpecialSelectedId(999));
      dispatch(setSelectedId(0));
    } else if (pathname.startsWith('/play/')) {
      dispatch(setSpecialSelectedId(-1));
      dispatch(setSelectedId(0));
    } else {
      dispatch(setSpecialSelectedId(-1));
      dispatch(setSelectedId(selectedMenu.id));
    }
    if (!pathname.startsWith('/search/')) setSearchInput('');
  }, [pathname]);

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
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
          setOpenSearch(false);
        }
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

  useEffect(() => {
    const metaTag = document.querySelector('meta[name="viewport"]');
    metaTag.name = 'viewport';
    if (metaTag) {
      metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    }
    return () => {
      metaTag.content = 'width=device-width, initial-scale=1';
    };
  }, []);

  if (loading) {
    return <LoadingPage full={true} />;
  }

  let searchContainer = (
    <div className='items-center flex flex-1 md:flex-none'>
      <div ref={dropdownSearchRef} className='flex-1 md:flex-none'>
        <div className='relative flex flex-1 md:flex-none'>
          <div
            className={`flex justify-between pr-4 pl-2 self-center ${
              openSearch ? 'flex md:hidden' : 'hidden'
            }`}
          >
            <Image
              alt='back'
              src={leftArrow}
              onClick={() => {
                setOpenSearch(false);
                setSearchInput('');
              }}
            />
          </div>
          <div className='relative flex-1 md:ml-16'>
            <input
              type='text'
              placeholder='输入搜索关键词'
              value={searchInput}
              onChange={handleChange}
              className='border-0 border-gray-300 text-white rounded-full pl-10 md:pl-4 md:pr-10 pr-4 py-2 focus:outline-none w-full md:w-60 header-search-input-desktop text-[14px]'
              onClick={handleOpenSearch}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                  handleSearch();
                }
              }}
            />
            <div className='absolute inset-y-0 left-3 flex items-center justify-center md:hidden'>
              <Image
                src={searchIcon}
                alt='search'
                width={20}
                className='text-gray-400'
                onClick={handleSearch}
              />
            </div>
            <div className='absolute inset-y-0 right-3 items-center justify-center hidden md:flex'>
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
          <div className='absolute flex flex-col items-center pt-1 w-full h-[calc(100vh_-_52px)] md:h-[calc(50vh_-_52px)] z-20 left-0 md:left-auto md:w-96 md:ml-16'>
            <div className='py-3 px-4 bg-[#1d2023] md:rounded-md w-full h-full md:bg-[#2c313ae6] md:w-96'>
              <div className='no-scrollbar flex flex-col overflow-y-scroll w-full h-full'>
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
                            router.push(
                              `/play/${item.type_id}/1/${item.vod_id}`
                            );
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
                          <div
                            className='flex flex-row'
                            onClick={handleClearSearchHistory}
                          >
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
                                className='py-1 px-2 rounded-lg cursor-pointer hover-effect'
                                style={{
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  color: 'rgba(156, 156, 156, 1)',
                                }}
                                key={index}
                                onClick={() => {
                                  goToSeachResult(item);
                                }}
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
                          className='flex flex-row justify-between py-2.5 cursor-pointer search-hot-item'
                          key={index}
                          onClick={(e) => {
                            console.log('helelle');
                            e.preventDefault();
                            setOpenSearch(false);
                            router.push(
                              `/play/${item.type_id}/1/${item.vod_id}`
                            );
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
          </div>
        ) : null}
      </div>
    </div>
  );

  let vipContainer = (
    <div className='flex-row flex'>
      <div
        className='relative'
        ref={dropdownVipRef}
        // onMouseEnter={() => {
        //   handleOpenVip(true);
        // }}
        // onMouseLeave={() => {
        //   handleOpenVip(false);
        // }}
        onClick={() => {
          if (!userInfo) {
            // router.push('/myprofile?login=true');
            setOpenLogin(true);
          } else {
            router.push('/payment');
          }
        }}
      >
        <div className='flex h-full flex-row cursor-pointer rounded-full md:bg-[#1D2023] md:px-4 md:ml-2 md:rounded-full'>
          <Image className='mr-2' src={vipIcon} alt='vip' width={25} />
          <div className='flex items-center'>
            <span className='text-[#F4DBBA] text-[14px]'>VIP会员</span>
          </div>
        </div>
        {openVip ? (
          <div className='absolute flex flex-col md:items-center items-end pt-1 w-80 md:-left-24 z-10 right-0'>
            <div
              style={{
                width: 0,
                height: 0,
                top: '-10px',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '10px solid rgba(29, 32, 35, 1)',
              }}
            />
            <div
              className='p-3 w-full flex flex-col md:rounded-md rounded-b-lg rounded-tl-lg'
              style={{ backgroundColor: 'rgba(29, 32, 35, 1)' }}
            >
              <span className='text-center font-bold text-lg text-[#E2BE95]'>
                VIP特权
              </span>
              <div className='py-2 grid grid-rows-2 grid-flow-col gap-2'>
                <div className='flex items-center'>
                  <Image
                    className='mr-2'
                    src={vipLightIcon}
                    alt='vip'
                    width={24}
                  />
                  <span className='text-sm text-[#F4DBBA]'>VIP尊贵标识</span>
                </div>
                <div className='flex items-center'>
                  <Image
                    className='mr-2'
                    src={noADIcon}
                    alt='noAD'
                    width={24}
                  />
                  <span className='text-sm text-[#F4DBBA]'>纯净广告</span>
                </div>
                <div className='flex items-center'>
                  <Image className='mr-2' src={glyph} alt='glyph' width={24} />
                  <span className='text-sm text-[#F4DBBA]'>
                    解锁全部影视内容
                  </span>
                </div>
                <div className='flex items-center'>
                  <Image
                    className='mr-2'
                    src={subtractIcon}
                    alt='noAD'
                    width={24}
                  />
                  <span className='text-sm text-[#F4DBBA]'>畅享离线下载</span>
                </div>
              </div>
              <div className='flex bg-gradient-to-r from-[#FFCD92] to-[#B58C63] rounded p-1 justify-center'>
                <span className='text-[#000000] text-center font-bold'>
                  开通会员权益
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  let historyContainer = (
    <div className='flex-row flex'>
      <div
        className='relative'
        ref={dropdownHistoryRef}
        onMouseEnter={() => {
          handleOpenHistory(true);
        }}
        onMouseLeave={() => {
          handleOpenHistory(false);
        }}
      >
        <div className='h-full flex justify-center'>
          <Image
            className='cursor-pointer'
            src={HistoryIcon}
            alt='history'
            width={30}
          />
        </div>
        {openHistory ? (
          <div className='absolute flex flex-col items-center w-80 z-20 -left-36'>
            <div
              style={{
                width: 0,
                height: 0,
                top: '-10px',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '10px solid #2c313ae6',
              }}
            />
            <div
              className='p-3 w-full rounded-md'
              style={{ backgroundColor: '#2c313ae6' }}
            >
              <div className='flex pb-3 pl-2'>
                <span
                  className='text-lg'
                  style={{ color: 'rgba(255, 255, 255, 1)' }}
                >
                  播放历史
                </span>
              </div>
              {watchHistoryList.length > 0 ? (
                <div className='flex flex-col max-h-96 overflow-y-scroll overflow-x-hidden gap-4 no-scrollbar'>
                  {watchHistoryList
                    .slice()
                    .reverse()
                    .map((item, index) => {
                      return (
                        <div
                          key={index}
                          className='flex flex-row hover:text-[#0085E0] gap-x-2 cursor-pointer'
                          onClick={() => {
                            router.push(
                              `/play/${item.tid}/${item.nid}/${item.vodid}`
                            );
                            setOpenHistory(false);
                          }}
                        >
                          <div className='w-28 flex-none'>
                            <img
                              className='rounded-md w-28 h-16 object-cover'
                              src={item.vodpic}
                            />
                          </div>
                          <div className='flex-1 flex flex-col truncate gap-y-2'>
                            <span className='text-sm truncate'>
                              {item.vodname}
                            </span>
                            <span className='text-xs text-white'>
                              观看至 {secondsToHHMMSS(item.watchtimes)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className='flex-col items-center flex'>
                  <Image
                    className='mx-2'
                    src={searchEmptyIcon}
                    alt='empty'
                    width={120}
                  />
                  <span
                    className='text-sm'
                    style={{ color: 'rgba(156, 156, 156, 1)' }}
                  >
                    您还没有观看视频哦
                  </span>
                </div>
              )}

              <div
                className={`flex-row justify-center cursor-pointer pt-2 ${
                  watchHistoryList.length > 0 ? 'flex' : 'hidden'
                }`}
                onClick={() => {
                  handleClearWatchHistory();
                }}
              >
                <span
                  className='text-sm'
                  style={{ color: 'rgba(156, 156, 156, 1)' }}
                >
                  清除记录
                </span>
                <Image className='mx-1' src={clear} alt='clear' width={10} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className='flex items-center px-2'>
        <div className='border-l-2 border-white h-4' />
      </div>

      <div
        className='relative'
        ref={dropdownAppRef}
        onMouseEnter={() => {
          handleOpenApp(true);
        }}
        onMouseLeave={() => {
          handleOpenApp(false);
        }}
      >
        <div className='h-full flex flex-row cursor-pointer'>
          <Image className='mx-2' src={PhoneIcon} alt='app' width={14} />
          <div className='flex items-center md:flex hidden'>APP</div>
        </div>
        {openApp ? (
          <div className='absolute flex flex-col items-end pt-1 z-10 right-2'>
            <div
              style={{
                width: 0,
                height: 0,
                top: '-10px',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '10px solid #2c313ae6',
              }}
            />
            <div
              className='p-2 flex flex-row rounded-md rounded-tr-none'
              style={{ backgroundColor: '#2c313ae6' }}
            >
              <div className='flex-none w-[200px]'>
                <Image src={AppImage} alt='AppImage' width={200} />
              </div>
              <div className='flex-1 flex flex-col justify-center items-center pr-2 gap-y-2'>
                <Image alt='鲨鱼影视' src={Logo} width={120} />
                <span className='text-sm'>您每一天的影视平台</span>
                <div className='flex flex-row gap-x-5 pt-2'>
                  <div className='flex flex-col items-center gap-2'>
                    <div className='flex flex-row  items-center'>
                      <Image alt='appleStore' src={AppleStoreIcon} width={25} />
                      <span className='text-xs'>iOS App 下载</span>
                    </div>
                    <QRCode
                      className='rounded-md'
                      value='https://apps.apple.com/cn/app/id6474402534'
                      renderAs='canvas'
                      size={120}
                      includeMargin={true}
                    />
                  </div>
                  <div className='flex flex-col items-center gap-2'>
                    <div className='flex flex-row items-center'>
                      <Image alt='playStore' src={AndroidIcon} width={25} />
                      <span className='text-xs'>安卓 App 下载</span>
                    </div>
                    <QRCode
                      className='rounded-md'
                      value='https://play.google.com/store/apps/details?id=com.yingshitv'
                      renderAs='canvas'
                      size={120}
                      includeMargin={true}
                    />
                  </div>
                </div>
                <span className='text-sm'>扫码即可下载手机APP</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className='hidden'>{vipContainer}</div>

      <div className='flex items-center px-2'>
        <div className='border-l-2 border-white h-4' />
      </div>

      <div className='flex flex-row pl-4 items-center'>
        {/* md:flex */}
        <div
          onClick={() => {
            if (userInfo) {
              router.push('/myprofile');
            } else {
              loginFlowRef.current.start();
            }
          }}
        >
          <Image
            className='cursor-pointer'
            src={userIcon}
            alt='user'
            width={25}
          />
        </div>
        <LoginFlow ref={loginFlowRef} />
      </div>
    </div>
  );

  let defaultHeader = (
    <div
      className={`transition duration-500 ${
        headerBlack ? 'bg-black' : 'bg-blur-header'
      } ${
        pathname.startsWith('/play/') || pathname.startsWith('/filmLibrary')
          ? 'w-screen z-30'
          : 'md:absolute z-30 w-screen'
      }`}
    >
      <div className='flex pb-2.5 md:pb-4 pt-3 justify-center container md:pl-0'>
        <div className='gap-y-2 flex-col w-full md:flex-row flex'>
          <div className='flex-1 flex gap-x-2 md:justify-start '>
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
                  handleClick(headerMenu.headerMenu[0].id);
                }}
              />
            </div>
            {searchContainer}
            {!openSearch ? (
              <div className='flex justify-center md:hidden'>
                {/* add on md: infront of hidden */}
                {vipContainer}
              </div>
            ) : null}
          </div>
          <div className='flex gap-4 overflow-scroll md:hidden no-scrollbar'>
            {headerMenu.headerMenu?.map((navItem, index) => {
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
                    className={`truncate ${
                      selectedSpecialMenu.id === -1 &&
                      selectedMenu.id === navItem.id
                        ? 'text-blue-500'
                        : selectedSpecialMenu.id === navItem.id
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
          <div
            className='grow md:flex items-center justify-end hidden'
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
                      selectedSpecialMenu.id === -1 &&
                      selectedMenu.id === navItem.id
                        ? 'text-blue-500'
                        : selectedSpecialMenu.id === navItem.id
                        ? 'text-blue-500'
                        : 'text-white'
                    }`}
                  >
                    {navItem.name}
                  </span>
                  {selectedSpecialMenu.id === -1 &&
                  selectedMenu.id === navItem.id ? (
                    <div className='border-2 border-blue-500 w-5 h-0.5 rounded-lg'></div>
                  ) : selectedSpecialMenu.id === navItem.id ? (
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
                    <div className='absolute flex flex-col md:items-center items-end md:-left-2 pt-1 right-0 z-20'>
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          top: '-10px',
                          borderLeft: '10px solid transparent',
                          borderRight: '10px solid transparent',
                          borderBottom: '10px solid #2c313ae6',
                        }}
                      />
                      <div
                        className='py-3 flex flex-col md:rounded-md rounded-b-lg rounded-tl-lg'
                        style={{ backgroundColor: '#2c313ae6' }}
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
          <div className='hidden md:flex'>{historyContainer}</div>
        </div>
      </div>
    </div>
  );

  if (pathname.startsWith('/topic/') || pathname.startsWith('/xvod')) {
    return <div className={'desktop z-50'}>{defaultHeader}</div>;
  }

  if (pathname.startsWith('/filmLibrary') || pathname.startsWith('/topic/')) {
    return (
      <>
        <div className={'mobile'}>
          <TopicHeader topicName={'片库'} />
          <div style={{ height: '52px' }}></div>
        </div>

        <div className={'desktop z-50'}>{defaultHeader}</div>
      </>
    );
  }

  if (pathname.startsWith('/play')) {
    return <div className={'desktop z-50'}>{defaultHeader}</div>;
  }

  if (pathname.startsWith('/search/')) {
    return (
      <>
        <div className={'z-30 w-screen mobile'}>
          <div className='flex py-3 mx-2.5'>
            <div className='gap-y-2 flex-col w-full md:flex-row flex'>
              <div className='flex-1 flex gap-x-2 md:justify-start'>
                <div
                  className={`flex justify-between w-22 pl-2 pr-2 self-center ${
                    openSearch ? 'hidden' : ''
                  }`}
                >
                  <Image
                    alt='back'
                    src={leftArrow}
                    //  style={{ width: '12px' }}
                    onClick={() => {
                      router.back();
                      // setOpenSearch(false);
                      // setSearchInput('');
                    }}
                  />
                </div>
                {searchContainer}
              </div>
            </div>
          </div>
        </div>
        <div className='desktop z-50'>{defaultHeader}</div>
      </>
    );
  }

  if (pathname.startsWith('/topic')) {
    return (
      <>
        <div className={'z-30 w-screen mobile'}>
          <div className='flex py-3 mx-2.5'>
            <div className='gap-y-2 flex-col w-full md:flex-row flex'>
              <div className='flex-1 flex gap-x-2 md:justify-start'>
                <div
                  className={`flex justify-between w-22 pl-3 ${
                    openSearch ? 'hidden' : ''
                  }`}
                >
                  <span className='text-topic-title'> 播单 </span>
                </div>
                {searchContainer}
                {/* {!openSearch ? historyContainer : null} */}
                {!openSearch && vipContainer}
              </div>
            </div>
          </div>
        </div>
        <div className='desktop z-50'>{defaultHeader}</div>
      </>
    );
  }

  if (pathname.startsWith('/myprofile')) {
    return (
      <>
        <div className={'z-30 w-screen mobile'}>
          <div className='flex pt-4 mx-2.5'>
            <div className='gap-y-2 flex-col w-full md:flex-row flex'>
              <div className='flex-1 flex px-4 md:justify-start'>
                <span className='text-topic-title'> 我的 </span>
              </div>
            </div>
          </div>
        </div>
        <div className={'desktop z-50'}>{defaultHeader}</div>
      </>
    );
  }

  if (pathname.startsWith('/login/otp')) {
    return (
      <div className={'z-30 w-screen mobile'}>
        <div className='flex py-3 mx-2.5'>
          <div className='gap-y-2 flex-col w-full md:flex-row flex'>
            <div className='flex-1 flex gap-x-2 md:justify-start'>
              <div
                className={'flex w-[30px] h-[30px] justify-center items-center'}
              >
                <Image
                  src={ArrowLeftIcon}
                  alt={'back button'}
                  onClick={() => router.back()}
                  height={16}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pathname.startsWith('/login/nickname')) {
    return (
      <div className={'z-30 w-screen mobile'}>
        <div className='flex py-3 mx-2.5'>
          <div className='gap-y-2 flex-col w-full md:flex-row flex'>
            <div className='flex-1 flex gap-x-2 md:justify-start'>
              {/*<div*/}
              {/*  className={'flex w-[30px] h-[30px] justify-center items-center'}*/}
              {/*>*/}
              {/*  <Image*/}
              {/*    src={ArrowLeftIcon}*/}
              {/*    alt={'back button'}*/}
              {/*    onClick={() => router.push('/myprofile')}*/}
              {/*    height={16}*/}
              {/*  />*/}
              {/*</div>*/}
              <div
                className={'flex-1 flex justify-end items-center px-2'}
                onClick={() => {
                  updateUserInfo(); // will assign default username
                  router.push('/myprofile');
                }}
              >
                <span className={'text-[16px]'}>跳过</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pathname.startsWith('/payment')) {
    return null;
  }

  if (pathname.startsWith('/sport')) {
    return null;
  }

  if (pathname.startsWith('/service') || pathname.startsWith('/privacy')) {
    return (
      <div className={'z-30 w-screen mobile'}>
        <div className='flex py-4 mx-2.5'>
          <div className='gap-y-2 flex-col w-full md:flex-row flex'>
            <div className='relative flex-1 flex gap-x-2 md:justify-start'>
              <div
                className={
                  'flex w-[30px] h-[30px] justify-center items-center z-10'
                }
                onClick={() => {
                  router.back();
                }}
              >
                <Image src={ArrowLeftIcon} alt={'back button'} height={16} />
              </div>
              <div
                className={
                  'flex-1 absolute h-full w-full flex items-center justify-center'
                }
              >
                {/*{pathname.startsWith('/service') &&*/}
                {/*  <span className={'text-white'}>用户服务协议</span>*/}
                {/*}*/}
                {/*{pathname.startsWith('/privacy') &&*/}
                {/*  <span className={'text-white'}>隐私协议</span>*/}
                {/*}*/}
                <Image src={Logo} alt={'鲨鱼影视'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return defaultHeader;
};
export default Header;
