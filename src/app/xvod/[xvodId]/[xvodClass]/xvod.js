'use client';
import { useEffect, useState, useRef } from 'react';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import styles from './style.module.css';
import { VideoHorizontalCard } from '@/components/videoItem/videoHorizontalCard';
import { Spinner } from '@/components/spinner';
import TopicHeader from './../../../../components/topicHeader';

export const XVodList = ({ list, xvodId, xvodClass }) => {
  const [vods, setVods] = useState(list.List);
  const [stillCanLoad, setStillCanLoad] = useState(list.Page < list.TotalPageCount);
  const [nextPage, setNextPage] = useState(list.Page + 1);
  const targetRef = useRef(null);

  const getXVodListApi = async () => {
    let url =
      URL_YINGSHI_VOD.getXVodDetails +
      '?limit=30&page=' +
      nextPage +
      '&vod_source_name=' +
      xvodId +
      '&class=' +
      xvodClass;

    console.log(url);
    return YingshiApi(url, {}, { method: 'GET' });
  };

  const getXVodList = async () => {
    let currentPage = nextPage;
    const xvodList = await getXVodListApi();

    setVods((prev) => [...prev, ...xvodList.List]);

    if (nextPage > xvodList.TotalPageCount -1) {
      setStillCanLoad(false);
    } else {
      setStillCanLoad(true);
      setNextPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (stillCanLoad) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio >= 0.5) {
            getXVodList();
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
    }
  }, [nextPage, stillCanLoad]);

  return (
    <>
      <div
        className='w-full grow  justify-center '
        style={{ display: 'block' }}
      >
        <div className='mobile'>
          <TopicHeader topicName={decodeURIComponent(xvodClass)} />
          {/* <div style={{ height: '52px' }}></div> */}
        </div>

        <div>
          <div className={`${styles.containerHeader} desktop`}></div>
          <div
            className='d-flex container pb-6'
            style={{ flexDirection: 'column' }}
          >
            <div className='text-xl desktop'>
              {decodeURIComponent(xvodClass)}
            </div>
            <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
              {vods !== [] &&
                vods?.map((vod, idx) => {
                  return (
                    <VideoHorizontalCard
                      vod={vod}
                      key={idx}
                      typepage_id={99}
                    />
                  );
                })}
            </div>
          </div>
        </div>

         loading spinner
        <div ref={targetRef}>
          {stillCanLoad && (
            <div className=' items-center justify-center flex-col my-6 py-6'>
              <Spinner></Spinner>
            </div>
          )}
        </div>

        {!stillCanLoad && (
          <div className='flex items-center justify-center flex-col my-6 py-6'>
            <span className='test-xs text-muted'>没有更多了</span>
          </div>
        )}
      </div>
    </>
  );
}
