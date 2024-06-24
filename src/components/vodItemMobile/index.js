'use client';
import React from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';


const VodItemMobile = ({ vod }) => {
  const router = useRouter();

  const handlePlay = (vodId) => {
    router.push(`/vod/play/id/${vod.vod_id}/sid/${vod.type_id}/nid/1`);
  };

  return (
    <div className='col-lg-6 col-md-12 pt-3 pb-3 cursor-pointer' onClick={() => handlePlay(vod.vod_id)}>
      <div className='row'>
        <div className='col-12'>
          <div className='row'>
            <div style={{ width: '128px' }}>
              <img
                alt='vod'
                className='object-cover'
                src={vod?.vod_pic}
                style={{
                  borderRadius: '10px',
                  width: '100%',
                  aspectRatio: '5/7',
                }}
              />
            </div>

            <div className='col pl-0'>
              <div className='topic-details-title-mobile'>{vod.vod_name}</div>
              <div className='topic-details-title-sub text-secondary '>
                {vod.vod_year} {vod.vod_class}
              </div>
              <div className='topic-details-title-sub text-secondary '>
                主演:
                {vod?.vod_actor?.length > 20 ? vod?.vod_actor?.substring(0, 20) + '...' : vod.vod_actor}
              </div>
              <div className='topic-details-title-sub text-secondary '>
                {vod?.vod_blurb?.length > 42 ? vod.vod_blurb.substring(0, 42) + '...' : vod.vod_blurb}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VodItemMobile;
