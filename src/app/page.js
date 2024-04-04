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
import Image from 'next/image';
import { useSelector } from 'react-redux';


const getHeaderMenuSelected = (state) => state.headerMenuSelected;

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const selectedMenu = useSelector(getHeaderMenuSelected);

  const getTypePage = async (idValue) => {
    return YingshiApi(
      URL_YINGSHI_VOD.homeGetPages,
      {
        id: idValue,
        limit: 6,
        page: 1,
      },
      { method: 'GET' }
    );
  };

  useEffect(() => {
    setLoading(true);
    getTypePage(selectedMenu.id).then((data) => {
      setCategories(data.categories);
      setLoading(false);
    });
  }, [selectedMenu]);

  return (
    <>
      <div style={{ width: '100%' }}>
        {/* <div className='flex flex-[1_0_0] overflow-y-auto min-y-0 pt-6 flex-col bg-transparent'> */}
        {loading ? (
          <div style={{ height: 'calc(100vh - 98px)' }}>
            <LoadingPage full={false} />
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 98px)', overflowY: 'auto' }}>
            {categories != [] &&
              categories?.map((category, idx) => {
                return (
                  <div id={category.type_id} key={idx}>
                    <span
                      style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        fontStyle: 'normal',
                        fontFamily: 'PingFang SC',
                      }}
                      className='px-4'
                    >
                      {category.type_name}
                    </span>
                    <div className='flex flex-row justify-between'>
                      {category.vod_list?.slice(0, 6).map((vod, i) => {
                        return <VideoVerticalCard vod={vod} key={i} />;
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}
