'use client';
import { useEffect, useRef, useState } from 'react';
import VodListViewMore from '../vodListViewMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { VideoVerticalCard } from '../videoItem/videoVerticalCard';
import { AdsBanner } from '../ads/adsBanner';
import { Spinner } from '../spinner';
import { getTopicListApi } from '@/app/actions';
import { YingshiApi2 } from '@/util/YingshiApi';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
const TopicPagingList = ({ data, navId, serverNextPage, isStillCanLoad }) => {
  const [topicList, setTopicList] = useState(data);
  const [nextPage, setNextPage] = useState(serverNextPage);
  const [stillCanLoad, setStillCanLoad] = useState(isStillCanLoad);

  const targetRef = useRef(null);

  //banner ads
  const [adsList, setAdsList] = useState([]);
  const getAllAds = async () => {
    return YingshiApi2(URL_YINGSHI_VOD.getAllAds, {}, { method: 'GET' });
  };
  const initAds = async () => {
    let allAds = await getAllAds();
    sessionStorage.setItem('adsList', JSON.stringify(allAds.data));
    console.log('init')
    console.log(allAds.data)
    setAdsList(allAds.data);
  };
  useEffect(() => {
    let adsList = sessionStorage.getItem('adsList');
    adsList = JSON.parse(adsList);
    if (adsList && adsList !== 'undefined') {
      setAdsList(adsList);
      
    } else {
      initAds();
    }
  }, []);
  //end banner ads

  useEffect(() => {
    if (stillCanLoad) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // setIsVisible(entry.intersectionRatio >= 0.5);
          if (entry.intersectionRatio >= 0.5) {
            getTopicList();
            // console.log('Element is at least 50% visible.');
          } else {
            // console.log('Element is not yet 50% visible.');
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
    }
  }, [nextPage, stillCanLoad]);

  const getTopicList = () => {
    let currentPage = nextPage;
    getTopicListApi(currentPage).then((data) => {
      if (nextPage > 1) {
        try {
          setTopicList((prev) => [...prev, ...data.List]);
        } catch (e) {
          setTopicList(data.List);
        }
      } else {
        setTopicList(data.List);
      }
      if (nextPage > data.TotalPageCount - 1) {
        setStillCanLoad(false);
      } else {
        setStillCanLoad(true);
        setNextPage(currentPage + 1);
      }
    });
  };

  return (
    <>
      {topicList != null &&
        topicList?.map((topic, idx) => {
          return (
            <div key={idx}>
              {/*{idx % 2 ? (*/}
              {/*  <AdsBanner adsList={adsList} navId={'1-13'} height='500px' />*/}
              {/*) : (*/}
              {/*  <div style={{ paddingTop: '20px' }}></div>*/}
              {/*)}*/}
              {(idx % 2 !== 0) && (
                <AdsBanner adsList={adsList} navId={'1-13'} height='500px' />
              )}
              <div id={topic.topic_id} key={idx} className={'pt-3'}>
                <div className='flex justify-between'>
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      fontStyle: 'normal',
                      fontFamily: 'PingFang SC',
                    }}
                  >
                    {topic.topic_name}
                  </span>
                  <div className='flex w-fit items-center cursor-pointer hover-blue'>
                    <VodListViewMore type={'topic'} data={topic} />
                    <FontAwesomeIcon
                      style={{
                        fontSize: '14px',
                        fontWeight: '400',
                        fontStyle: 'normal',
                        fontFamily: 'PingFang SC',
                      }}
                      icon={faAngleRight}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-x-5 gap-y-2 py-2'>
                  {topic.vod_list?.slice(0, 6).map((vod, i) => {
                    return <VideoVerticalCard vod={vod} key={i} />;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      <div ref={targetRef}>
        {stillCanLoad && navId == 0 && <Spinner></Spinner>}
      </div>
    </>
  );
};

export default TopicPagingList;
