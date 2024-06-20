'use client'
import { useEffect, useRef, useState } from "react";
import VodListViewMore from "../vodListViewMore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { VideoVerticalCard } from "../videoItem/videoVerticalCard";
import { AdsBanner } from "../ads/adsBanner";
import { Spinner } from "../spinner";
import { getTopicListApi } from "@/app/actions";

const TopicPagingList = ({ data, navId, serverNextPage, isStillCanLoad }) => {
  const [topicList, setTopicList] = useState(data)
  const [nextPage, setNextPage] = useState(serverNextPage)
  const [stillCanLoad, setStillCanLoad] = useState(isStillCanLoad)

  const targetRef = useRef(null);

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
              {idx % 2 ? (
                <AdsBanner navId={navId} height='500px' />
              ) : (
                <div style={{ paddingTop: '20px' }}></div>
              )}
              <div id={topic.topic_id} key={idx}>
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
                  <div className='flex w-fit items-center cursor-pointer hover-yellow'>
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
                <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-5 py-2'>
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
  )
}

export default TopicPagingList;