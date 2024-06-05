'use client';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { Favicon } from '@/asset/icons';
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
  AppIcon,
} from '@/asset/icons';

const MyFooter2 = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();


  if (pathname.startsWith('/play') ||
    pathname.startsWith('/search/') ||
    pathname.startsWith('/payment') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/setpin') ||
    pathname.startsWith('/enterpin') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/service') ||
    pathname.startsWith('/sport') ||
    pathname.startsWith('/myprofile/watchHistory') ||
    pathname.startsWith('/myprofile/userCenter') ||
    pathname.startsWith('/myprofile/feedback')
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
      window.location.href = 'https://play.google.com/store/apps/details?id=com.yingshitv&hl=en'; // Make sure app_download_link is defined
    } else if (os === 'iOS' || os === 'MacOS') {
      window.location.href = 'https://apps.apple.com/cn/app/id6474402534';
      // Additional iOS handling code here if needed
    } else {
      console.log('Operating system not supported');
    }
  }

  return (
    <div className='mobile' style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        className='flex'
        style={{
          color: '#FFF',
          position: 'absolute',
          bottom:'2rem',
          background: '#0085E0',
          fontSize: '0.9rem',
          padding: '0.4rem 1.5rem',
          borderRadius: '1rem'
        }}
        onClick={downloadApp}
      >
        <div><Image src={Favicon} alt='icon' width={22} /></div>
        <div className='pl-2'>打开影视APP，看精彩流畅视频</div>
      </div>
    </div>
  );
};
export default MyFooter2;
