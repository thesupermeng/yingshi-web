'use client';
import Gallery from '@/components/gallery';
import { StreamerInfo } from '@/components/streamer/StreamerInfo';
import { URL_USER } from '@/config/url';
import { UserApi } from '@/util/UserApi';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { LoadingPage } from '@/components/loading';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { isWeb } from '@/util/common';
import { YingshiApi } from '@/util/YingshiApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

import styles from './style.module.css';

export default function Page({ params }) {
  const [loading, setLoading] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const getTopicList = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.playlistGetTopic + '?limit=18&page=' + currentPage,
      {},
      { method: 'GET' }
    );
  };

  const initPage = async () => {
    setLoading(true);
    let res = await getTopicList();
    let topicList = res.List;
    setTopicList(topicList);
    console.log(topicList);
    setLoading(false);
  };

  useEffect(() => {
    initPage();
  }, []);

  // const [selected, setSelected] = useState(0);
  // const [streamerData, setStreamerData] = useState({});

  // const getStreamerData = async () => {
  //   return UserApi(
  //     URL_USER.getSteamer,
  //     { id: params?.streamer_id, recommend_count: 10 },
  //     { method: 'GET' }
  //   );
  // };

  // useEffect(() => {
  //   getStreamerData().then((data) => {
  //     setStreamerData(data?.data);
  //   });
  // }, [params?.streamer_id]);

  if (loading) {
    return <LoadingPage full={!isWeb()} />;
  }

  return (
    <>
      <div className={styles.containerHeader}>
        <div className='d-flex' style={{ width: '100%' }}>
          <div className='overlay' style={{ width: '100%' }}>
            <div className='topic-container-header container px-0 d-flex  flex-column'>
              <div className='topic-header-text'>播单</div>
            </div>
          </div>
        </div>
      </div>

      {/* topic list  */}
      <div className='d-flex container'>
        <div className='row '>
          {topicList.map((topic) => (
            <div className='col-4' key={topic.topic_id}>
              {/* Render topic details here */}
              <div className='row topic-wrap'>
                <div className='col-12 mx-0 px-0'>
                  <div className='d-flex topic-card'>
                    <div className='col-4 px-0'>
                      <div className={`object-cover h-auto w-full topic-img`}>
                        <img
                          alt='播单'
                          src={topic?.vod_list[0].vod_pic_list[0]}
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                    </div>
                    <div className='col-8 px-0 d-flex flex-column justify-content-between'>
                      <div>
                        <div className='text-base font-bold pb-2'>
                          {topic.topic_name}
                        </div>
                        <div className='text-xs topic-blurb'>
                          {topic.topic_blurb.length > 105
                            ? `${topic.topic_blurb.substring(0, 105)}...`
                            : topic.topic_blurb}
                        </div>
                        <div className='text-primary pt-4 text-xs'>
                          查看更多 <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* loading spinner   */}
      <div className='d-flex container py-6 justify-center justify-items-center '>
        <div className='row  '>
          <img
            alt='播单'
            src='/img/loading-spinner.gif'
            style={{ width: 130, height: 'auto' }}
          />
        </div>
      </div>
    </>
  );
}
