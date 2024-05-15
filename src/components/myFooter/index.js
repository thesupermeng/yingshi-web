'use client';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import {
  homeTab,
  homeTabActive,
  topicTab,
  topicTabActive,
  profileTab,
  profileTabActive, AhaLogoActive, AhaLogo,
} from '@/asset/icons';
import { use, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  setHeaderMenu,
  setSelectedId,
  setSpecialSelectedId,
} from '@/store/headerData';
const getHeaderMenuSelected = (state) => state.headerMenuSelected;
const getSpecialHeaderMenuSelected = (state) => state.specialHeaderMenuSelected;

const MyFooter = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const selectedMenu = useSelector(getHeaderMenuSelected);
  const selectedSpecialMenu = useSelector(getSpecialHeaderMenuSelected);

  // useEffect(() => {
  //   console.log("pathname")
  //   console.log(pathname)
  //   console.log("selectedMenu")
  //   console.log(selectedMenu.id)
  //   if (pathname.startsWith('/filmLibrary')) dispatch(setSelectedId(999));
  //   else if (pathname.startsWith('/topic')) dispatch(setSelectedId(99));
  //   else if (pathname.startsWith('/play/')) dispatch(setSelectedId(-1));
  // }, [selectedMenu]);

  const handleClick = (value) => {
    if (value == 998) {
      dispatch(setSpecialSelectedId(value));
      router.push('/topic');
    } else if (value == 999) {
      dispatch(setSpecialSelectedId(value));
      router.push('/film-library');
    }  else if (value == 990) {
      dispatch(setSpecialSelectedId(value));
      router.push('/myprofile');
    } else if (value == 997) {
      dispatch(setSpecialSelectedId(value));
      router.push('/sport');
    } else {
      dispatch(setSpecialSelectedId(-1));
      dispatch(setSelectedId(value));
      router.push('/');
    }
  };


  if (pathname.startsWith('/play') ||
      pathname.startsWith('/search/') ||
      pathname.startsWith('/payment') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/privacy') ||
      pathname.startsWith('/service') ||
      pathname.startsWith('/myprofile/watchHistory') ||
      pathname.startsWith('/myprofile/userCenter') ||
      pathname.startsWith('/myprofile/feedback')

  ) {
    return <></>;
  }

  const tabs = [
    {
      onClick: () => {
        handleClick(0);
      },
      active: selectedSpecialMenu !== -1 && selectedMenu.id === 0 && pathname == '/',
      icon: homeTab,
      iconActive: homeTabActive,
      title: '首页',
    },
    // {
    //   onClick: () => {
    //     handleClick(997);
    //   },
    //   active: pathname.startsWith('/sport'),
    //   icon: AhaLogo,
    //   iconActive: AhaLogoActive,
    //   title: 'aha体育',
    // },
    {
      onClick: () => {
        handleClick(998);
      },
      active: pathname.startsWith('/topic') ,
      icon: topicTab,
      iconActive: topicTabActive,
      title: '播单',
    },
    {
      onClick: () => {
        handleClick(990);
      },
      active: pathname.startsWith('/myprofile'),
      icon: profileTab,
      iconActive: profileTabActive,
      title: '我的',
    },
  ]

  return (
    <div className='mobile'>
      <div className='flex mb-2'>
        {tabs.map((tab, index) => (
          <TabItem key={index} {...tab} />
        ))}
      </div>
    </div>
  );
};

const TabItem = ({onClick, active, icon, iconActive, title}) => {
  return (
    <div
      className='col flex-col d-flex justify-center align-center items-center'
      onClick={onClick}
    >
      <div className='d-flex'>
        <Image
          alt='鲨鱼影视'
          src={active ? iconActive : icon}
          width={22}
          style={{cursor: 'pointer'}}
        />
      </div>
      <div
        className={`text-[14px] font-medium ${active ? 'text-shayuBlue' : 'text-[#6A6A6A]'}`}>{title}
      </div>
    </div>
  )
}

export default MyFooter;
