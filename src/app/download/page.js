'use client';
import {DownloadBackgroundImage} from '@/asset/image';
import useGetConfig from '@/hook/user/useGetConfig';
import { getMobileOperatingSystem } from '@/util/common';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {AndroidIcon, AppImage, AppleStoreIcon, Logo} from '@/asset/icons';
import QRCode from 'qrcode.react';

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

  return (
    <div className="relative w-full grow flex justify-center items-center h-screen">
      <Image
        src={DownloadBackgroundImage}
        alt="downloadPageBg"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute flex space-x-10 z-10">
        <div className='flex-1 flex flex-col justify-center items-center pr-2 gap-y-2'>
          <Image alt='鲨鱼影视' src={Logo} width={120}/>
          <span className='text-sm'>海量高清视频免费观看</span>
          <div className='flex flex-row gap-x-5 pt-2'>
            <div className='flex flex-col items-center gap-2'>
              <div className='flex flex-row  items-center'>
                <Image alt='appleStore' src={AppleStoreIcon} width={25}/>
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
                <Image alt='playStore' src={AndroidIcon} width={25}/>
                <span className='text-xs'>安卓 App 下载</span>
              </div>
              <QRCode
                className='rounded-md'
                value='https://oss.yingshi.tv/assets/yingshi.apk'
                renderAs='canvas'
                size={120}
                includeMargin={true}
              />
            </div>
          </div>
          <span className='text-sm'>扫码下载 <span className={'text-[#FAC33D]'}>影视TV</span> APP</span>
        </div>
        <Image src={AppImage} alt="App Image" width={200} height={200}/>
      </div>
    </div>
  );
}
