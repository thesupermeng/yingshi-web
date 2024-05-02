'use client';
import Gallery from '@/components/gallery';
import { StreamerInfo } from '@/components/streamer/StreamerInfo';
import { URL_USER } from '@/config/url';
import { UserApi } from '@/util/UserApi';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { LoadingPage } from '@/components/loading';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { isWeb } from '@/util/common';
import { YingshiApi } from '@/util/YingshiApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from './../../components/spinner';

import styles from './style.module.css';

export default function Page({ params }) {
  const [isLoading, setIsLoading] = useState(true);
  const [topicList, setTopicList] = useState([]);
  let topicListTotal = [];
  let currentPage = 0;
  let stillCanLoad = true
  // const [isVisible, setIsVisible] = useState(false);
  let totalPage = 0;
  let loading = false;
  const targetRef = useRef(null);

  const router = useRouter();
  const goToTopicDetails = (topic) => {
    router.push('/topic/' + topic.topic_id);
  };

  const getTopicList = async () => {
    if (
      loading == true ||
      !stillCanLoad ||
      (currentPage > totalPage - 1 && totalPage != 0)
    ) {
      return;
    }
    loading = true;
    await new Promise((resolve) => setTimeout(resolve, 600));
    currentPage = currentPage + 1;
    let res = await getTopicListApi();

    if (res.List) {
      let tempList = res.List;

      if (totalPage == 0) {
        totalPage = res.TotalPageCount;
      }

      if (currentPage == totalPage) {
        stillCanLoad = false
        setIsLoading(false);
        return;
      }

      // if (currentPage == 2) {
      //   stillCanLoad = false
      //   setIsLoading(false);
      //   return
      // }



      topicListTotal = [...topicListTotal, ...tempList];
      let combinedList = topicListTotal;
      console.log(combinedList);
      setTopicList(combinedList);
      loading = false;
      console.log(topicList);



    } else {
      stillCanLoad = false
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
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // setIsVisible(entry.intersectionRatio >= 0.5);
        if (entry.intersectionRatio >= 0.5) {
          getTopicList();
          console.log('Element is at least 50% visible.');
        } else {
          console.log('Element is not yet 50% visible.');
        }
      },
      {
        threshold: 0.5, // 50% visibility threshold
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* desktop view  */}
      <div className='desktop'>
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
              <div className='col-lg-4 col-md-6' key={topic.topic_id}>
                {/* Render topic details here */}
                <div
                  className='row topic-wrap'
                  onClick={() => goToTopicDetails(topic)}
                >
                  <div className='col-12 mx-0 px-0'>
                    <div className='d-flex topic-card'>
                      <div    style={{
                              padding: '10px',
                              width: '123px',
                              borderRadius: '10px',
                            
                            }}
                           >
                
                          <img
                            alt='topic items'
                            className={`object-cover`}
                            src={topic?.vod_list[0].vod_pic_list[0]}
                            style={{
                              borderRadius: '10px',
                              width: '123px',
                              height: '170px',
                            }}
                          />
                    
                      </div>
                      <div className='col d-flex flex-column justify-content-between'>
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
      </div>

      {/* mobile  view  */}

      <div className='mobile'>
        <div className='row w-screen'>
          {topicList.map((topic) => (
            <div
              className='mb-2 cursor-pointer'
              key={topic.topic_id}
              onClick={() => goToTopicDetails(topic)}
            >
              <div className='col-12 pt-2 d-flex justify-content-between align-items-center pb-1 font-semibold'>
                <span>{topic.topic_name}</span>
                <span className='mr-2'>
                  {' '}
                  <FontAwesomeIcon icon={faAngleRight} />
                </span>
              </div>

              <div className='col-12 mobile-topic-desc'>
                {topic.topic_blurb.length > 52
                  ? `${topic.topic_blurb.slice(0, 52)}...`
                  : topic.topic_blurb}
              </div>

              <div className='col-12' key={topic.topic_id}>
                <div className='row g-2'>
                  {topic?.vod_list?.slice(0, 3).map((vod) => (
                    <div
                      className='col-4 cursor-pointer'
                      key={vod.vod_id}
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/play/${vod.type_id}/1/${vod.vod_id}`);
                      }}
                    >
                      {' '}
                      {/* Add px-1 class for horizontal padding */}
                      <img
                        alt='topic items'
                        className={`object-cover w-100`}
                        src={vod?.vod_pic_list[0]}
                        style={{
                          borderRadius: '10px',
                          aspectRatio: '5/7',
                          width: '100%',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* loading spinner  */}
      <div ref={targetRef}>{isLoading && <Spinner></Spinner>}</div>


      {!isLoading &&
        <div className='flex items-center justify-center flex-col my-6 py-6'>
          <span className='test-xs text-muted'>没有更多了</span>
        </div>
      }
    </>
  );
}
