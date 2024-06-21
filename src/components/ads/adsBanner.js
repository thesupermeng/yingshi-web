'use client';
import { useEffect, useCallback, useState } from 'react';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi, YingshiApi2 } from '@/util/YingshiApi';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';

export const AdsBanner = ({
  width = '100%',
  height = '100px',
  backgroundColor = '#A7A7A71A',
  imgUrl = '',
  navId = '1-13',
  // ads = null,
  adsList = [],
}) => {
  const { isVip, userInfo } = useYingshiUser();

  const [ads, setAds] = useState(null);

  useEffect(() => {
    if (navId && navId != 0) {
      const parts = navId?.split('-').map(Number);

      const filteredAdsList = adsList.filter(
        (ad) => ad.ads_id === 1 || ad.ads_id === 13
      );


      setAds(filteredAdsList);
    } else {
      console.log('no ads');
    }
  }, []);



  return (
    <>
      {ads ? (
        <div
          className='my-6'
          style={{
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <img
            src={ads[0]?.ads_pic}
            onClick={() => {
              window.open(ads[0].ads_url, '_blank');
            }}
          />
        </div>
      ) : (
        <div className='rounded-xl'></div>
      )}
    </>
  );
};
