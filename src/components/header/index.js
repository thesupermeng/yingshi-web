'use client';
import useUser from '@/hook/user/useUser';
import { useSelector, useDispatch } from 'react-redux';
import {
  hideRightBarContent,
  setProfileModal,
  showRightBarContent,
} from '@/store/common';
import Image from 'next/image';
import { ProfileModalType } from '../profileModal';
import { RightSidebarContantTypes } from '../rightSideMenu';
import HeaderBetSlip from './headerBetSlip';
import Profile from './profile';
import Wallet from './wallet';
import { useTranslation } from 'next-i18next';
import {
  EastRichRedBlackLogo,
  EastRichWhiteRedText,
  HistoryIcon,
  Logo,
  PhoneIcon,
  searchIcon,
} from '@/asset/icons';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMore, setOpenMore] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  let searchHistory = [
    {
      id: 1,
      name: '海贼王',
    },
    {
      id: 2,
      name: '名侦探柯南',
    },
    {
      id: 3,
      name: '王牌御史',
    },
    {
      id: 4,
      name: '动漫',
    },
  ];
  let topTen = [
    {
      id: 1,
      name: '名侦探柯南',
      type: '动漫',
    },
    {
      id: 2,
      name: '海贼王',
      type: '动漫',
    },
    {
      id: 3,
      name: '王牌御史',
      type: '动漫',
    },
    {
      id: 4,
      name: '狂飙',
      type: '电影',
    },
    {
      id: 5,
      name: '子弹列车',
      type: '电影',
    },
    {
      id: 6,
      name: '阿凡达2:水之道',
      type: '电影',
    },
    {
      id: 7,
      name: '电锯人',
      type: '动漫',
    },
    {
      id: 8,
      name: '妖精的尾巴',
      type: '动漫',
    },
    {
      id: 9,
      name: '家庭教师',
      type: '动漫',
    },
    {
      id: 10,
      name: '犬夜叉',
      type: '动漫',
    },
  ];

  const handleOpenMore = () => {
    setOpenMore(!openMore);
  };

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const getTopNav = async () => {
    return YingshiApi(URL_YINGSHI_VOD.homeGetNav, {}, { method: 'GET' });
  };

  const handleClick = (value) => {
    dispatch(setSelectedId(value));
    if (value == 99) {
      router.push('/topic');
    } else {
      router.push('/');
    }
  };

  const calculateItemsVisibility = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const itemWidth = 57; // Assuming each item has a fixed width

      const maxVisibleItems =
        Math.floor(containerWidth / itemWidth) < headerMenu.headerMenu?.length
          ? Math.floor(containerWidth / itemWidth) - 1 <= 0
            ? 0
            : Math.floor(containerWidth / itemWidth) - 1
          : Math.floor(containerWidth / itemWidth);

      setVisibleItems(headerMenu.headerMenu?.slice(0, maxVisibleItems));
      setHiddenItems(headerMenu.headerMenu?.slice(maxVisibleItems));
    }
  };

  useEffect(() => {
    setLoading(true);
    // Simulating asynchronous data fetching
    const fetchData = async () => {
      let data = await getTopNav();
      data.push({
        id: 99,
        name: '播单',
      });
      dispatch(setHeaderMenu(data));
      dispatch(setSelectedId(data[0].id));
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

  return (
    <div
      className={
        pathname.startsWith('/play/')
          ? 'w-full z-20 bg-gradient-to-b from-black from-15%'
          : 'absolute z-10 w-full bg-gradient-to-b from-black from-15%'
      }
    >
      <div className='container flex py-3 mx-auto'>
        <div className='flex flex-1  flex-col md:flex-row'>
          <div className='flex-1 flex gap-x-5 justify-between'>
            <div className='flex justify-between'>
              <Image alt='鲨鱼影视' src={Logo} style={{ minWidth: '100px' }} />
            </div>
            <div className='flex flex-1 items-center'>
              <div ref={dropdownSearchRef}>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='输入搜索关键词'
                    value={value}
                    onChange={handleChange}
                    className='flex border-0 border-gray-300 text-white rounded-md pl-4 pr-10 py-2 focus:outline-none'
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    onClick={handleOpenSearch}
                  />
                  <Image
                    className='h-6 w-6 absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400'
                    src={searchIcon}
                    alt='search'
                    width={20}
                  />
                </div>
                {openSearch ? (
                  <div className='absolute z-10 flex flex-col items-center pt-1 w-80 '>
                    <div
                      className='py-3 px-4 flex flex-col rounded-md w-full'
                      style={{ backgroundColor: 'rgba(29, 32, 35, 0.88)' }}
                    >
                      <div className='flex flex-row justify-between items-center pb-2'>
                        <div className='text-sm'>历史搜索</div>
                        <div
                          className='text-xs'
                          style={{ color: 'rgba(156, 156, 156, 1)' }}
                        >
                          清除
                        </div>
                      </div>
                      <div className='flex flex-wrap py-2 gap-2'>
                        {searchHistory.map((item, index) => {
                          return (
                            <div
                              className='py-1 px-2 rounded-lg'
                              style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                color: 'rgba(156, 156, 156, 1)',
                              }}
                              key={index}
                            >
                              {item.name}
                            </div>
                          );
                        })}
                      </div>
                      <div className='flex flex-row justify-between'>
                        <div className='text-sm'>热搜总榜</div>
                      </div>
                      {topTen.map((item, index) => {
                        return (
                          <div
                            className='flex flex-row justify-between py-2.5'
                            key={index}
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
                              <div className='text-sm'>{item.name}</div>
                            </div>
                            <div
                              className='text-xs'
                              style={{ color: 'rgba(156, 156, 156, 1)' }}
                            >
                              {item.type}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className='flex-row flex md:hidden'>
              <Image
                className='cursor-pointer'
                src={HistoryIcon}
                alt='search'
                width={30}
              />
              <div className='flex items-center px-0'>
                <div className='h-4' />
              </div>
              <div className='flex flex-row cursor-pointer'>
                <Image
                  className='mx-2'
                  src={PhoneIcon}
                  alt='search'
                  width={14}
                />
              </div>
            </div>
          </div>
          <div
            className='grow flex items-center justify-end'
            ref={containerRef}
          >
            {visibleItems?.map((navItem, index) => {
              return (
                <div
                  className='w-14 flex flex-col items-center cursor-pointer'
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
                  <button onClick={handleOpenMore}>更多</button>
                  {openMore ? (
                    <div className='absolute z-10 flex flex-col md:items-center items-end md:-left-12 pt-1 right-0'>
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
              alt='search'
              width={30}
            />
            <div className='flex items-center px-2'>
              <div className='border-l-2 border-white h-4' />
            </div>
            <div className='flex flex-row cursor-pointer'>
              <Image className='mx-2' src={PhoneIcon} alt='search' width={14} />
              <div className='flex items-center'>APP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
