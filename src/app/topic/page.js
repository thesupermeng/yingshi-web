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

import styles from './style.module.css';

export default function Page({ params }) {
  const [loading, setLoading] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  const getTopicList = async () => {
    return YingshiApi(URL_YINGSHI_VOD.playlistGetTopic + '?limit=18&page='+currentPage, {}, { method: 'GET' });
  };

  const initPage = async () => {
    setLoading(true);
    let res = await getTopicList();
    let topicList = res.List
    setTopicList(topicList)
    console.log(topicList)
    setLoading(false);
  };


  useEffect(() => {
    initPage()
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
  <div className="d-flex" style={{ width: '100%' }}>
    <div className="overlay" style={{ width: '100%' }}>
      <div className="grid grid-cols-12 pb-24 lg:px-0 md:px-0 px-4">
        <div className="lg:col-span-1 md:col-span-1 desktop"></div>
        <div className="lg:col-span-10 md:col-span-10 col-span-12">
          <div className={styles.detailsTitle}>播单</div>
          {/* <div className="pl-1">播单</div> */}
        </div>
      </div>
    </div>
  </div>
</div>

{/* topic list  */}
<div className='d-flex'>

     {topicList.map(topic => (
          <div key={topic.topic_id}>
            {/* Render topic details here */}
            <p>{topic.topic_name}</p>
          </div>
        ))}





</div>



      

   
    </>
  );
}
