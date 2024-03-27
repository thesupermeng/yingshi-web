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
import { Logo, searchIcon } from '@/asset/icons';
import Image from 'next/image';

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
    setSelected(value);
    getTypePage(value).then((data) => {
      setCategories(data.categories);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getTopNav().then((data) => {
      setTopNav(data);
      setSelected(data[0].id);
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
          <div>
            <Image alt='鲨鱼影视' src={Logo} />
          </div>
          <div className='relative'>
            <input
              type='text'
              placeholder='输入搜索关键词'
              value={value}
              onChange={handleChange}
              className='w-96 border-0 border-gray-300 text-black rounded-md px-4 py-1 focus:outline-none '
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
            />
            <Image
              className='h-6 w-6 absolute right-2 top-2/4 transform -translate-y-2/4 text-gray-400'
              src={searchIcon}
              alt='search'
              width={20}
            />
          </div>
          <div className='flex flex-row space-x-4'>
            {topNav?.map((navItem, id) => {
              return (
                <div
                  className='flex flex-col items-center cursor-pointer'
                  id={navItem.id}
                  key={id}
                  onClick={() => {
                    changePage(navItem.id);
                  }}
                >
                  <span
                    className={`transition-colors duration-300 ${
                      selected === navItem.id ? 'text-blue-500' : 'text-white'
                    } hover:text-blue-500`}
                  >
                    {navItem.name}
                  </span>
                  {selected === navItem.id ? (
                    <div className='border-2 border-blue-500 w-5 h-0.5 rounded-lg'></div>
                  ) : null}
                </div>
              );
            })}

            <div className='cursor-pointer'>App</div>
            <div className='cursor-pointer'>history</div>
            <div className='cursor-pointer'>report</div>
          </div>
        </div>

        {/* <div className='flex flex-[1_0_0] overflow-y-auto min-y-0 pt-6 flex-col bg-transparent'> */}
        <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
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
