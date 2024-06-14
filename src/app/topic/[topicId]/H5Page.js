'use client';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import styles from './../style.module.css';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import TopicHeader from './../../../components/topicHeader';
import VodItemDesktop from './../../../components/vodItemDesktop'
import VodItemMobile from './../../../components/vodItemMobile'


export default function Page() {
  const { topicId } = useParams();
  const [topicObj, setTopicObj] = useState(null);
  const router = useRouter();

  const getTopicDetailsApi = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.playlistGetTopicDetail + '?id=' + topicId,
      {},
      { method: 'GET' }
    );
  };

  const getTopicDetails = async () => {
    console.log('topicId');
    console.log(topicId);

    let res = await getTopicDetailsApi();
    setTopicObj(res);
    console.log('res');
    console.log(res);
  };

  useEffect(() => {
    getTopicDetails();
  }, []);

  return (
    <>
      {topicObj && (
        <>
          {/* desktop view */}
          <div className='desktop'>
            <div className={styles.containerHeader}>
              <div className='d-flex' style={{ width: '100%' }}>
                <div className='overlay' style={{ width: '100%' }}>
                  <div className='px-0 d-flex flex-column w-screen'>
                    <div className='topic-container-header container content-end'>
                      <div className='topic-header-text'>
                        {topicObj.topic_name}
                      </div>
                      <div className='topic-header-text-sub'>
                        {topicObj.topic_blurb}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='d-flex container pt-3' style={{ width: '100%' }}>
              <div className='topic-header-text-sub'>
                (共{topicObj?.vod_list?.length || 0}部)
              </div>
            </div>

            <div className='d-flex container pt-3' style={{ width: '100%' }}>
              <div className='row'>
                {topicObj?.vod_list?.map((vod) => (
                  <VodItemDesktop vod={vod} />
                ))}
              </div>
            </div>
          </div>

          {/* mobile view */}
          <div className='mobile pb-6'>
            <TopicHeader topicName={topicObj.topic_name} />
            <div  className='px-2.5'>
            {/* mobile content */}
            <div className='topic-header-text-sub mt-3'>
              {topicObj.topic_blurb}
            </div>

            <div className='topic-header-text-sub mt-3'>
              (共{topicObj?.vod_list?.length || 0}部)
            </div>
            {/* mobile vod list  */}
            <div className='row mt-2'>
              {topicObj?.vod_list?.map((vod) => (
             <VodItemMobile vod={vod} />
              ))}
            </div>
            </div>
            
          </div>
        </>
      )}
    </>
  );
}
