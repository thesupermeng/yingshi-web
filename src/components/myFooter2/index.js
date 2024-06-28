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

import { AppIcon } from '@/asset/icons';


const MyFooter2 = () => {

  const getIsUserChina = (state) => state.yingshiScreen.isUserChina;
  const isUserChina = useSelector(getIsUserChina);
  const [iosLink, setIosLink] = useState('https://apps.apple.com/cn/app/id6474402534');
  useEffect(() => {
    setIosLink(isUserChina.link_jump);
  }, [isUserChina]);

  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  if (
    pathname.startsWith('/vod/play') ||
    pathname.startsWith('/search/') ||
    pathname.startsWith('/payment') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/setpin') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/service') ||
    pathname.startsWith('/sport') ||
    pathname.startsWith('/myprofile/watchHistory') ||
    pathname.startsWith('/myprofile/userCenter') ||
    pathname.startsWith('/myprofile/feedback') ||
    //aha
    pathname.startsWith('/sport/user/deposit') ||
    pathname.startsWith('/sport/user/withdraw') ||
    pathname.startsWith('/sport/user/transaction') ||
    pathname.startsWith('/sport/user/history') ||
    pathname.startsWith('/purchase-redirect') 


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
  };

  const downloadApp = () => {
    const os = getOperatingSystem();
    if (os === 'Android') {
      // Make sure app_download_link is defined
      // window.location.href =
      //   'https://play.google.com/store/apps/details?id=com.yingshitv&hl=en'; 
        window.open('https://oss.yingshi.tv/assets/yingshi.apk', '_blank');
    } else if (os === 'iOS' || os === 'MacOS') {

      window.location.href = iosLink
      
      // Additional iOS handling code here if needed
    } else {
      console.log('Operating system not supported');
    }
  };

  return (
    <div className='mobile fixed bottom-[60px] w-full'>
      <div className='justify-center flex'>
        <div
          className='flex'
          style={{
            color: '#FFF',
            position: 'absolute',
            bottom: '2rem',
            background: '#FAC33D',
            fontSize: '0.9rem',
            padding: '0.4rem 1.5rem',
            borderRadius: '1rem',
          }}
          onClick={downloadApp}
        >
          <div>
            <Image src={Favicon} alt='icon' width={22} />
          </div>
          <div className='pl-2 text-[#1D2023]'>下载影视APP，看精彩流畅视频</div>
        </div>
      </div>
    </div>
  );
};
export default MyFooter2;
