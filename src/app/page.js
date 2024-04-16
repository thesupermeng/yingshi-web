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
import { Carousel } from '@/components/carousel/carousel';

const getHeaderMenuSelected = (state) => state.headerMenuSelected;

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [carousel, setCarousel] = useState([]);
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
      setCarousel(data.carousel);
      setLoading(false);
    });
  }, [selectedMenu]);

  return (
    <div className='flex flex-1 justify-center' style={{ width: '100%' }}>
      {loading ? (
        <div>
          <LoadingPage full={false} />
        </div>
      ) : (
        <div className='flex flex-col w-full'>
          <Carousel carouselItems={carousel} />
          <div className='pt-4 md:mx-20 mx-2.5'>
            {categories != [] &&
              categories?.map((category, idx) => {
                return (
                  <div id={category.type_id} key={idx}>
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        fontStyle: 'normal',
                        fontFamily: 'PingFang SC',
                      }}
                    >
                      {category.type_name}
                    </span>
                    <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
                      {category.vod_list?.slice(0, 6).map((vod, i) => {
                        return <VideoVerticalCard vod={vod} key={i} />;
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
    // <div className='flex flex-1 justify-center'>
    //     {/* <div className='flex flex-[1_0_0] overflow-y-auto min-y-0 pt-6 flex-col bg-transparent'> */}
    //     {loading ? (
    //       <div>
    //         <LoadingPage full={false} />
    //       </div>
    //     ) : (
    //       <div style={{ height: 'calc(100vh - 50px)', width: '100%', overflowY: 'auto' }}>
    //         <Carousel carouselItems={carousel}/>
    //         {categories != [] &&
    //           categories?.map((category, idx) => {
    //             return (
    //               <div id={category.type_id} key={idx}>
    //                 <span
    //                   style={{
    //                     fontSize: '22px',
    //                     fontWeight: '600',
    //                     fontStyle: 'normal',
    //                     fontFamily: 'PingFang SC',
    //                   }}
    //                   className='px-4'
    //                 >
    //                   {category.type_name}
    //                 </span>
    //                 <div className='flex flex-row justify-between'>
    //                   {category.vod_list?.slice(0, 6).map((vod, i) => {
    //                     return <VideoVerticalCard vod={vod} key={i} />;
    //                   })}
    //                 </div>
    //               </div>
    //             );
    //           })}
    //       </div>
    //     )}
    // </div>
  );
}
