import React from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const VodItemDesktop = ({ vod }) => {
  const router = useRouter();

  const handlePlay = (vodId) => {
    router.push(`/play/${vod.type_id}/1/${vod.vod_id}`);
  };

  return (
    <div className='col-lg-6 col-md-12 mt-2 mb-2 cursor-pointer'>
      <div className='topic-details-card' onClick={() => handlePlay(vod.vod_id)}>
        <div className='row'>
          <div className='col-12'>
            <div className='row'>
              <div className='col-lg-3 col-md-2'>
                <img
                  alt='vod'
                  className='object-cover'
                  src={vod?.vod_pic_list[0]}
                  style={{
                    borderRadius: '10px',
                    width: '132px',
                    height: '206px',
                  }}
                />
              </div>

              <div className='col-lg-9 col-md-10'>
                <div className='topic-details-title'>{vod.vod_name}</div>
                <div className='topic-details-title-sub text-secondary '>
                  {vod.vod_year} {vod.vod_class}
                </div>
                <div className='topic-details-title-sub text-secondary '>
                  主演:
                  {vod?.vod_actor?.length > 38
                    ? vod.vod_actor.substring(0, 35) + '...'
                    : vod.vod_actor}
                </div>
                <div className='topic-details-title-sub text-secondary '>
                  {vod.vod_blurb.length > 75
                    ? vod.vod_blurb.substring(0, 73) + '...'
                    : vod.vod_blurb}
                </div>
                <button className='btn btn-topic-play' onClick={() => handlePlay(vod.vod_id)}>
                  <FontAwesomeIcon icon={faPlay} /> <span className='ml-2'> 立即播放 </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VodItemDesktop;
