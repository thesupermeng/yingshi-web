'use client';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import {
  homeTab,
  homeTabActive,
  topicTab,
  topicTabActive,
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
      router.push('/filmLibrary');
    } else {
      dispatch(setSpecialSelectedId(-1));
      dispatch(setSelectedId(value));
      router.push('/');
    }
  };
  return (
    <div className='mobile'>
      <div className='footer row '>
        <div
          className='col flex-col d-flex justify-center align-center items-center'
          onClick={() => {
            handleClick(0);
          }}
        >
          <div className='d-flex'>
            <Image
              alt='鲨鱼影视'
              src={
                selectedSpecialMenu !== -1 && selectedMenu.id === 0 && pathname == '/'
                  ? homeTabActive
                  : homeTab
              }
              width={22}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div>首首</div>
        </div>

        <div
          className='col flex-col d-flex justify-center align-center items-center'
          onClick={() => {
            handleClick(998);
          }}
        >
          <div className='d-flex'>
            <Image
              alt='鲨鱼影视'
              src={pathname.startsWith('/topic') ? topicTabActive : topicTab}
              width={22}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div>播单</div>
        </div>
      </div>
    </div>
  );
};
export default MyFooter;
