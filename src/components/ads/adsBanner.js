'use client'
import { useEffect, useCallback, useState } from 'react';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi , YingshiApi2 } from '@/util/YingshiApi';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';

export const AdsBanner = ({
  width = '100%',
  height = '100px',
  backgroundColor = '#A7A7A71A',
  imgUrl = '',
  navId = '1-13',
  //ads = null,
}) => {
  const [ads, setAds] = useState(null);
  const { isVip, userInfo } = useYingshiUser();

  // const getAdsSlotAds = async (slotId) => {
  //   return YingshiApi(
  //     URL_YINGSHI_VOD.getAdsSlot,
  //     {
  //       slot_id: slotId,
  //     },
  //     { method: 'GET' }
  //   );
  // };

  const getAllAds = async () => {
    return YingshiApi2(
      URL_YINGSHI_VOD.getAllAds,{},{method: 'GET'}
    );
  };

  const initAds  = async (slotId) => {
    let allAds = await getAllAds()
    sessionStorage.setItem('adsList' ,JSON.stringify(allAds.data) );
  };

  useEffect(() => {

    let adsList = sessionStorage.getItem('adsList');
    adsList = JSON.parse(adsList)
    if(adsList && adsList !== 'undefined' && navId)
      {
        console.log('got ads')
        console.log(adsList)
        const parts = navId?.split('-').map(Number);

        setAds(parts);

        const filteredAdsList = adsList.filter(ad => ad.ads_id === 1 || ad.ads_id === 13);

console.log('filteredAdsList');
   
        console.log(filteredAdsList)
      }
      else
      {
        console.log('no ads')
        initAds()
      }
  

    // let slotId = 100 + navId;
    // if (slotId > 99 && slotId < 110) {
    //   getAdsSlotAds(slotId).then((data) => {
    //     setAds(data);
    //   });
    // }
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
            src={ads?.ads_pic}
            onClick={() => {
              window.open(ads.ads_url, '_blank');
            }}
          />
        </div>
      ) : (
        <div className='rounded-xl'></div>
      )}
    </>
  );
};
