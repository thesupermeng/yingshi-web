'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import VodListViewMore from "../vodListViewMore";
import { VideoHorizontalCard } from "./videoHorizontalCard";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "../spinner";
import { getTypePage } from "@/app/actions";

export const VideoWithTitleHorizontalCard = ({
  data,
  navId,
  serverNextPage = 2,
  isStillCanLoad,
  platform = 'web',
}) => {
  const [categories, setCategories] = useState(data);
  const [nextPage, setNextPage] = useState(serverNextPage);
  const [stillCanLoad, setStillCanLoad] = useState(isStillCanLoad);

  const targetRef = useRef(null);

  useEffect(() => {
    if (stillCanLoad) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // setIsVisible(entry.intersectionRatio >= 0.5);
          if (entry.intersectionRatio >= 0.5) {
            getCategories();
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

  const getCategories = () => {
    let currentPage = nextPage;
    getTypePage(navId, currentPage).then((data) => {
      if ((data?.categories?.length ?? 0) < 10) {
        setStillCanLoad(false);
      }

      if (data?.categories !== undefined) {
        setCategories(prev => [...prev, ...data.categories])
      }

      setNextPage(currentPage + 1)
    });
  }

  return (
    <>
      {categories != [] &&
        categories?.map((category, idx) => {
          if (platform === 'mobile') {
            return (
              <div
                id={category.type_id}
                key={idx}
                style={{ paddingTop: '1rem' }}
              >
                <div className='flex justify-between'>
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      fontStyle: 'normal',
                      fontFamily: 'PingFang SC',
                    }}
                  >
                    {category.type_name}
                  </span>
                  <div className='flex w-fit items-center cursor-pointer hover-blue'>
                    <VodListViewMore
                      type={'xcategory'}
                      data={category}
                    />
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
                  {category.vod_list?.slice(0, 6).map((vod, i) => {
                    return (
                      <VideoHorizontalCard
                        vod={vod}
                        key={i}
                        typepage_id={navId}
                      />
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <div
              id={category.type_id}
              key={idx}
              style={{ paddingTop: '3rem' }}
            >
              <div className='flex justify-between'>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    fontFamily: 'PingFang SC',
                  }}
                >
                  {category.type_name}
                </span>
                <div className='flex w-fit items-center cursor-pointer hover-blue'>
                  <VodListViewMore
                    type={'xcategory'}
                    data={category}
                  />
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
                {category.vod_list?.slice(0, 6).map((vod, i) => {
                  return (
                    <VideoHorizontalCard
                      vod={vod}
                      key={i}
                      typepage_id={navId}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      <div ref={targetRef}>
        {stillCanLoad && navId == 0 && <Spinner></Spinner>}
      </div>
    </>
  );
}