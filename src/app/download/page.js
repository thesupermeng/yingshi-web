'use client';
import {DownloadBackgroundImage} from '@/asset/image';
import useGetConfig from '@/hook/user/useGetConfig';
import { getMobileOperatingSystem } from '@/util/common';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {AndroidIcon, AppImage, AppleStoreIcon, Logo} from '@/asset/icons';
import QRCode from 'qrcode.react';
import styles from './style.module.css';
import {Button} from '@material-tailwind/react';

export default function Download() {
  const { config } = useGetConfig();
  // const router = useRouter();

  useEffect(() => {
    const userMobileOS = getMobileOperatingSystem();

    if (config) {
      if (userMobileOS === 'Android' || userMobileOS === 'Windows Phone') {
        window.location.href = config?.download_url?.android;
      } else if (userMobileOS === 'iOS') {
        window.location.href = config?.download_url?.ios;
      } else {
        window.location.href = '/';
      }
    }
  }, [config]);

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
      window.location.href = 'https://apps.apple.com/cn/app/id6474402534';
      // Additional iOS handling code here if needed
    } else {
      console.log('Operating system not supported');
    }
  };

  return (
    <div className="relative w-full grow flex justify-center items-center">
      <Image
        src={DownloadBackgroundImage}
        alt="downloadPageBg"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className={`${styles.desktop} z-10`}>
        <div className='flex flex-1 flex-col justify-center items-center pr-10 gap-y-2'>
          <Image alt='鲨鱼影视' src={Logo} width={200}/>
          <span className='text-m'>海量高清视频免费观看</span>
          <div className='flex flex-row gap-x-10 pt-2'>
            <div className='flex flex-col items-center gap-2'>
              <div className='flex flex-row  items-center'>
                <Image alt='appleStore' src={AppleStoreIcon} width={25}/>
                <span className='text-m'>iOS App 下载</span>
              </div>
              <QRCode
                className='rounded-md'
                value='https://apps.apple.com/cn/app/id6474402534'
                renderAs='canvas'
                size={220}
                includeMargin={true}
              />
            </div>
            <div className='flex flex-col items-center gap-2'>
              <div className='flex flex-row items-center'>
                <Image alt='playStore' src={AndroidIcon} width={25}/>
                <span className='text-m'>安卓 App 下载</span>
              </div>
              <QRCode
                className='rounded-md'
                value='https://oss.yingshi.tv/assets/yingshi.apk'
                renderAs='canvas'
                size={220}
                includeMargin={true}
              />
            </div>
          </div>
          <span className='text-m'>扫码下载 <span className={'text-[#FAC33D]'}>影视TV</span> APP</span>
        </div>
        <Image src={AppImage} alt="App Image" width={290} height={290}/>
      </div>
      <div className={`${styles.mobile} flex-col gap-6 z-10`}>
        <div className={'flex flex-col gap-3 justify-center items-center'}>
          <Image alt='鲨鱼影视' src={Logo} width={150}/>
          <span className='text-[22px]'>您每一天的影视平台</span>
          <Image src={AppImage} alt="App Image" width={220} height={200}/>
        </div>
        <Button
          className={'h-12 w-22 rounded-[10px] bg-[#FAC33D] flex items-center justify-center'}
          onClick={downloadApp}
        >
          <span className={'text-[#1D2023] text-[15px] font-semibold'}>立即体验</span>
        </Button>
      </div>
    </div>
  );
}
