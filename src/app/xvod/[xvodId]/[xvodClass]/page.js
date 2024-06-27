'use client';
import { LoadingPage } from '@/components/loading';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import styles from './style.module.css';
import { VideoHorizontalCard } from '@/components/videoItem/videoHorizontalCard';
import { Spinner } from '@/components/spinner';
import TopicHeader from './../../../../components/topicHeader';
export default function Page() {
  const params = useParams();
  const xvodId = params.xvodId;
  const xvodClass = params.xvodClass;

  const [vods, setVods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let vodListTotal = [];
  let currentPage = 0;
  let stillCanLoad = true;
  // const [isVisible, setIsVisible] = useState(false);
  let totalPage = 0;
  let loading = false;
  const targetRef = useRef(null);

  const getXVodListApi = async () => {
    let url =
      URL_YINGSHI_VOD.getXVodDetails +
      '?limit=30&page=' +
      currentPage +
      '&vod_source_name=' +
      xvodId +
      '&class=' +
      xvodClass;
    console.log(url);
    return YingshiApi(url, {}, { method: 'GET' });
  };

  const getXVodList = async () => {
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
    let res = await getXVodListApi();

    if (res.List) {
      console.log(res.List);
      let tempList = res.List;

      if (totalPage == 0) {
        totalPage = res.TotalPageCount;
      }

      if (currentPage == totalPage) {
        stillCanLoad = false;
        setIsLoading(false);
        return;
      }

      vodListTotal = [...vodListTotal, ...tempList];
      let combinedList = vodListTotal;
      setVods(combinedList);
      loading = false;

      setIsLoading(false);
    } else {
      stillCanLoad = false;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      loading = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getXVodList().then((data) => {
      if (data && data.List.length > 0) {
        setVods([...vods, ...data.List]);
      }
    });
  }, [xvodId, xvodClass]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // setIsVisible(entry.intersectionRatio >= 0.5);
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
  }, []);

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

        {!isLoading && (
          <div>
            {/* <div className={`${styles.containerHeader} desktop`}></div> */}

            <div
              className='d-flex container pb-6'
              style={{ flexDirection: 'column' }}
            >
              <div className='text-xl desktop'>
                {decodeURIComponent(xvodClass)}
              </div>
              <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 py-2'>
                {vods != [] &&
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
        )}

        {/* loading spinner  */}
        <div ref={targetRef}>
          {isLoading && (
            <div className=' items-center justify-center flex-col my-6 py-6'>
              <Spinner></Spinner>
            </div>
          )}
        </div>

        {!isLoading && (
          <div className='flex items-center justify-center flex-col my-6 py-6'>
            <span className='test-xs text-muted'>没有更多了</span>
          </div>
        )}
      </div>
    </>
  );
}
