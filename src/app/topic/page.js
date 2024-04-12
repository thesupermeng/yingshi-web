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
import { debounce } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';

import styles from './style.module.css';

export default function Page({ params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [topicList, setTopicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stillCanLoad, setStillCanLoad] = useState(true);
  let totalPage = 0 
  let loading = false;

  // useEffect(() => {

  //   if(loading)
  //   {
  //     return;
  //   }

  //  console.log('Fetch data from the to-do list API')
  //   getTopicList();

  // }, [currentPage]);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollY + windowHeight >= documentHeight - 100) {
      // setCurrentPage(currentPage + 1);

      console.log('111')

      getTopicList();
    }
  };


  const router = useRouter()
  const goToTopicDetails = (topic) => {

    console.log(topic)
    console.log(topic.topic_id)
    const jsonString = JSON.stringify(topic);
    // Store the stringified JSON object in sessionStorage
    
    localStorage.setItem('topicItem', jsonString);

    router.push('/topic/' + topic.topic_id)
  };

  const debouncedHandleScroll = debounce(handleScroll, 600);
  
  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [currentPage]);

  const getTopicList = async () => {

    if (loading == true || !stillCanLoad || (currentPage > totalPage-1 && totalPage !=0)) {
      return
    }
   
    loading = true;
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCurrentPage(currentPage + 1);
    console.log('0000000');

    let res = await getTopicListApi();

    console.log('isLoading after');
    console.log(isLoading);

    if (res.List) {
      let tempList = res.List;

      if(totalPage == 0)
      {
        totalPage = res.TotalPageCount
      }

      if (currentPage == totalPage) {
        setStillCanLoad(false);
        setIsLoading(false);
        return
      }
      console.log('111111');

      const combinedList = [...topicList, ...tempList];
   
      console.log('combinedList');
      console.log(combinedList);
   
      setTopicList(prevTopicList => [...prevTopicList, ...tempList]);

      loading = false;
    //  setIsLoading(false);
      console.log(topicList);
    }
    else
    { 
      setStillCanLoad(false)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      loading = false;
      setIsLoading(false);
    }
  };

  const getTopicListApi = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.playlistGetTopic + '?limit=18&page=' + currentPage,
      {},
      { method: 'GET' }
    );
  };

  useEffect(() => {
    getTopicList();
  }, []);

  // if (loading) {
  //   return <LoadingPage full={!isWeb()} />;
  // }

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
      <div className='d-flex container pb-6'>
        <div className='row '>
          {topicList.map((topic) => (
            <div className='col-4' key={topic.topic_id}>
              {/* Render topic details here */}
              <div className='row topic-wrap' onClick={() => goToTopicDetails(topic)}>
                <div className='col-12 mx-0 px-0'>
                  <div className='d-flex topic-card'>
                    <div className='col-4 px-0'>
                      <div className={`object-cover topic-img`}>
                        <img
                          alt='topic items'
                          className={`object-cover`}
                          src={topic?.vod_list[0].vod_pic_list[0]}
                          style={{ borderRadius: '10px' , width: '123px' , height:'170px' }}
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

      {isLoading && (
        <div className='d-flex container py-6 justify-center justify-items-center '>
          <div className='row  '>
            <img
              alt='播单'
              src='/img/loading-spinner.gif'
              style={{ width: 130, height: 'auto' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
