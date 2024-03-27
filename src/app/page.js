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
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState(0);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const getTopNav = async () => {
    return YingshiApi(URL_YINGSHI_VOD.homeGetNav, {}, { method: 'GET' });
  };

  const getTypePage = async (pageId) => {
    return YingshiApi(
      URL_YINGSHI_VOD.homeGetPages,
      {
        id: pageId,
        limit: 6,
        page: 4,
      },
      { method: 'GET' }
    );
  };

  const changePage = (value) => {
    setLoading(true);
    getTypePage(value).then((data) => {
      setCategories(data.categories);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getTopNav().then((data) => {
      setTopNav(data);
      getTypePage(data.id).then((data) => {
        setCategories(data.categories);
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return <LoadingPage full={!isWeb()} />;
  }
  return (
    <>
      <div style={{ width: '100%' }}>
        <div className='flex flex-row justify-around py-4 items-center'>
          <div>Logo Image</div>
          <div>
            <input
              type='text'
              placeholder={'输入搜索关键词'}
              value={value}
              onChange={handleChange}
              className='border border-gray-300 text-black rounded-md px-6 py-1 focus:outline-none focus:border-blue-500'
            />
          </div>
          <div className='flex flex-row space-x-4'>
            {topNav?.map((navItem, idx) => {
              return (
                <div
                  id={navItem.id}
                  key={idx}
                  onClick={() => {
                    changePage(navItem.id);
                  }}
                >
                  {navItem.name}
                </div>
              );
            })}

            <div>App</div>
            <div>history</div>
            <div>report</div>
          </div>
        </div>

        {/* <div className='flex flex-[1_0_0] overflow-y-auto min-y-0 pt-6 flex-col bg-transparent'> */}
        <div style={{ height: '80vh', overflowY: 'auto' }}>
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
      </div>
    </>
  );
}
