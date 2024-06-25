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
  // navId = '1-13',
  // ads = null,
  adsList = [],
  pathName = '/',
}) => {
  let navId = '1-13';
  const { isVip, userInfo } = useYingshiUser();

  const [ads, setAds] = useState(null);

  const findAdBySlotId = (ads, slotId) => {
    if (!ads) {
      return;
    }

    let result = ads.filter(
      (ad) => ad.slot_id_list_array && ad.slot_id_list_array.includes(slotId)
    );
    return result[0];
  };

  useEffect(() => {
    var pathFlag = pathName.substr(pathName.length - 1);

    if (pathFlag == '/') {
      navId = '1-13';
    }
    //综合
    if (
      pathFlag == '1' ||
      pathFlag == '2' ||
      pathFlag == '3' ||
      pathFlag == '4' ||
      pathFlag == '5'
    ) {
      navId = '4-16';
    }
    //韩剧
    if (pathFlag == '6') {
      navId = '9-17';
    }
    //美剧
    if (pathFlag == '7') {
      navId = '10-18';
    }

    console.log('ads banner');
    console.log(adsList);
    if (pathName.startsWith('/topic')) {
      navId = '11-14';
    }

    if (pathName.startsWith('/vod/show')) {
      navId = '12-15';
    }

    if (navId && navId != 0) {
      const parts = navId?.split('-').map(Number);

      const filteredAdsList = [];

      // adsList.filter(
      //   (ad) => ad.ads_id === 1 || ad.ads_id === 13
      // );

      parts.forEach((item, index) => {
        let result = findAdBySlotId(adsList, item);
        filteredAdsList.push(result);
      });

      setAds(filteredAdsList);
    } else {
      console.log('no ads');
    }
  }, []);

  return (
    <>
      {ads && !isVip ? (
        <div
          className={(ads[0] !== undefined || ads[1] != undefined) && 'my-6'}
          style={{
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <img
            className='desktop'
            src={ads[0]?.ads_pic}
            onClick={() => {
              window.open(ads[0].ads_url, '_blank');
            }}
          />
          <img
            className='mobile'
            src={ads[1]?.ads_pic}
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
