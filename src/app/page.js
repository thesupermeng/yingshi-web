'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { SWRConfig } from 'swr';
import { FBApi } from '@/util/FB_Api';

import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';

import './i18n';
import { LoadingPage } from '@/components/loading';
import { FullPageContent } from '@/componentsH5/FullPageContent';
import { H5Only } from '@/components/Fragments/EnvComponent';
import { VideoVerticalCard } from '@/components/videoItem/videoVerticalCard';
import { isWeb } from '@/util/common';
export const RightBetCartWidth = 'w-[32rem]';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [topNav, setTopNav] = useState([]);
  const [categories, setCategories] = useState([]);

  const getTopNav = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.homeGetNav,
      {},
      { method: 'GET' }
    );
  };

  const getTypePage = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.homeGetPages,
      {
        id: 0,
        limit: 6,
        page: 4
      },
      { method: 'GET' }
    );
  };

  useEffect(() => {
    getTopNav().then((data) => {
      setTopNav(data);
    });
    getTypePage().then((data) => {
      setCategories(data.categories);
    });
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      // router.replace('/home');
    }
  }, [pathname]);

  if (loading) {
    return <LoadingPage full={!isWeb()} />;
  }
  return (
    <>
      <div style={{ width: '100%' }}>
        <div className='flex flex-row'>
          {topNav?.map((navItem, idx) => {
            return (
              <div id={navItem.id} key={idx}>
                {navItem.name}
              </div>
            );
          })}
        </div>
        
        {/* <div className='flex flex-[1_0_0] overflow-y-auto min-y-0 pt-6 flex-col bg-transparent'> */}
        <div style={{ height: '80vh', overflowY: 'auto' }}>
          {
            categories?.map((category, idx) => {
              return (
                <div id={category.type_id} key={idx}>
                  <span style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    fontFamily: 'PingFang SC'
                  }} className='px-4'>{category.type_name}</span>
                  <div className='flex flex-row justify-between'>
                    {category.vod_list?.slice(0, 6).map((vod, i) => {
                        return (
                          <VideoVerticalCard 
                            vod={vod} key={i}/>
                        )
                    })}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
}
