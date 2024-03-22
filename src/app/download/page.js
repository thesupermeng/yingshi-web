'use client';
import { LandingPageBg } from '@/asset/icons';
import { FullPageContent } from '@/componentsH5/FullPageContent';
import useGetConfig from '@/hook/user/useGetConfig';
import { getMobileOperatingSystem } from '@/util/common';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Download() {
  const { config } = useGetConfig();
  const router = useRouter();

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
    <FullPageContent className='z-[9999]'>
      <Image
        src={LandingPageBg}
        alt='landingPageBg'
        fill
        onClick={() => {
          router.push('/');
        }}
      />
    </FullPageContent>
  );
}
