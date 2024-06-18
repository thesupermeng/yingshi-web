import { useEffect, useCallback, useState } from 'react';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';

export const AdsBanner = ({
  width = '100%',
  height = '100px',
  backgroundColor = '#A7A7A71A',
  imgUrl = '',
  navId = 0,
  ads = null,
}) => {
  // const [ads, setAds] = useState(null);
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

  // useEffect(() => {
  //   let slotId = 100 + navId;
  //   if (slotId > 99 && slotId < 110) {
  //     getAdsSlotAds(slotId).then((data) => {
  //       setAds(data);
  //     });
  //   }
  // }, []);

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
            src={ads.ads_pic}
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
