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
import { useEffect, useState } from 'react';
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
  const { t } = useTranslation();

  // const onClick = () => {
  //   dispatch(hideRightBarContent('All'));
  //   dispatch(showRightBarContent(RightSidebarContantTypes.BetCart));
  // };
  const headerMenu = useSelector(getHeaderMenu);
  const selectedMenu = useSelector(getHeaderMenuSelected);

  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const getTopNav = async () => {
    return YingshiApi(URL_YINGSHI_VOD.homeGetNav, {}, { method: 'GET' });
  };

  const handleClick = (value) => {
    router.push('/');
    dispatch(setSelectedId(value));
  };

  useEffect(() => {
    setLoading(true);
    // Simulating asynchronous data fetching
    const fetchData = async () => {
      const data = await getTopNav();
      dispatch(setHeaderMenu(data));
      dispatch(setSelectedId(data[0].id));
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <LoadingPage full={true} />;
  }

  return (
    <div className='flex flex-row justify-around py-4 items-center'>
      <div>
        <Image alt='鲨鱼影视' src={Logo} />
      </div>
      <div className='relative'>
        <input
          type='text'
          placeholder='输入搜索关键词'
          value={value}
          onChange={handleChange}
          className='flex border-0 border-gray-300 text-white rounded-md pl-4 pr-10 py-1 focus:outline-none '
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />
        <Image
          className='h-6 w-6 absolute right-2 top-2/4 transform -translate-y-2/4 text-gray-400'
          src={searchIcon}
          alt='search'
          width={20}
        />
      </div>
      <div className='flex flex-row space-x-4'>
        {headerMenu.headerMenu?.map((navItem, id) => {
          return (
            <div
              className='flex flex-col items-center cursor-pointer'
              id={navItem.id}
              key={id}
              onClick={() => {
                handleClick(navItem.id);
              }}
            >
              <span
                className={`transition-colors duration-300 ${
                  selectedMenu.id === navItem.id ? 'text-blue-500' : 'text-white'
                } hover:text-blue-500`}
              >
                {navItem.name}
              </span>
              {selectedMenu.id === navItem.id ? (
                <div className='border-2 border-blue-500 w-5 h-0.5 rounded-lg'></div>
              ) : null}
            </div>
          );
        })}

        <div
          className='flex flex-row  justify-around cursor-pointer'
          onClick={() => router.push('/topic')}
        >
          播单
        </div>

        <div className='flex flex-row  justify-around cursor-pointer'>
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
        <div className='cursor-pointer'>history</div>
        <div className='cursor-pointer'>report</div>
      </div>
    </div>
  );
};

//   return (
//     <>
//       {/* <div className='flex-1 px-5 py-4'>
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <Image
//             src={EastRichWhiteRedText}
//             alt='Taya'
//             className={`flex-initial h-[3.65rem] w-[9rem]`}
//           />
//           <div className='flex items-center flex-initial gap-5'>
//             {isLogin && <Wallet />}

//             {isLogin ? (
//               <Profile />
//             ) : (
//               <>
//                 <button
//                   className='py-3 rounded-full px-[1.375rem] hover:bg-white/5'
//                   onClick={() => {
//                     dispatch(setProfileModal(ProfileModalType.LoginModal));
//                   }}
//                 >
//                   {t('login')}
//                 </button>
//                 <button
//                   className='py-2.5 px-[1.375rem] bg-tayaRed rounded-[6.25rem]'
//                   onClick={() => {
//                     dispatch(setProfileModal(ProfileModalType.SignUpModal));
//                   }}
//                 >
//                   <p>Sign Up</p>
//                 </button>
//               </>
//             )}

//             {!rightBarContent?.[RightSidebarContantTypes.BetCart] && (
//               <HeaderBetSlip onClick={onClick} />
//             )}
//           </div>
//         </div>
//       </div>*/}
//     </>
//   );
// };
export default Header;
