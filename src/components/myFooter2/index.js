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
  profileTabActive,
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



import {
  AppIcon,
} from '@/asset/icons';

const MyFooter2 = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();


  if (pathname.startsWith('/play') ||
    pathname.startsWith('/search/') ||
    pathname.startsWith('/login')
  ) {
    return <></>;
  }

  const getOperatingSystem = () => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      return 'Android';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
      return 'MacOS';
    } else {
      return 'not supported';
    }
  }

  const downloadApp = () => {
    const os = getOperatingSystem();
    if (os === 'Android') {
      window.location.href = app_download_link; // Make sure app_download_link is defined
    } else if (os === 'iOS' || os === 'MacOS') {
      window.location.href = 'https://apps.apple.com/cn/app/id6474402534';
      // Additional iOS handling code here if needed
    } else {
      console.log('Operating system not supported');
    }
  }

  return (
    <div className='mobile'>
      <div className='flex mb-2 justify-center hover-effect' onClick={downloadApp}>

        <div class="download-badge d-flex">

          <Image
            src={AppIcon}
            style={{ width: 30, height: 'auto', display: 'flex' }}
          />
          <span className='d-flex ml-2'>下载鲨鱼影视APP，看精彩流畅视频</span>
        </div>
      </div>
    </div>
  );
};
export default MyFooter2;
