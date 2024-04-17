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
              <div className='d-flexx' style={{ width: '100%' }}>
                <div className='overlay' style={{ width: '100%' }}>
                  <div className='row px-0 d-flex flex-column '>
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
                (共{topicObj.vod_list.length}部)
              </div>
            </div>

            <div className='d-flex container pt-3' style={{ width: '100%' }}>
              <div className='row'>
                {topicObj.vod_list.map((vod) => (
                  <div className='col-lg-6 col-md-12 mt-2 mb-2 cursor-pointer'>
                    <div
                      className='topic-details-card'
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/play/${vod.vod_id}`);
                      }}
                    >
                      <div className='row '>
                        <div className='col-12'>
                          <div className='row'>
                            <div className='col-lg-3 col-md-2'>
                              <img
                                alt='vod'
                                className={`object-cover`}
                                src={vod?.vod_pic_list[0]}
                                style={{
                                  borderRadius: '10px',
                                  width: '132px',
                                  height: '206px',
                                }}
                              />
                            </div>

                            <div className='col-lg-9 col-md-10'>
                              <div className='topic-details-title'>
                                {' '}
                                {vod.vod_name}{' '}
                              </div>
                              <div className='topic-details-title-sub text-secondary '>
                                {' '}
                                {vod.vod_year} {vod.vod_class}
                              </div>
                              <div className='topic-details-title-sub text-secondary '>
                                {' '}
                                主演:
                                {vod.vod_actor.length > 38
                                  ? vod.vod_actor.substring(0, 35) + '...'
                                  : vod.vod_actor}
                              </div>
                              <div className='topic-details-title-sub text-secondary '>
                                {vod.vod_blurb.length > 75
                                  ? vod.vod_blurb.substring(0, 73) + '...'
                                  : vod.vod_blurb}
                              </div>
                              <button className='btn btn-topic-play'>
                                <FontAwesomeIcon icon={faPlay} />{' '}
                                <span className='ml-2'> 立即播放 </span>
                              </button>
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

          {/* mobile view */}
          <div className='mobile mt-2 px-4 pb-6'>
            {/* sticky  header  */}
            <div
              className='flex items-center justify-center cursor-pointer'
              onClick={(e) => {
                e.preventDefault();
                history.back();
              }}
            >
              <span
                className='flex'
                style={{
                  position: 'absolute',
                  left: '16px',
                }}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </span>
              <span className='flex'>{topicObj.topic_name}</span>
            </div>
            {/* mobile content */}
            <div className='topic-header-text-sub mt-3'>
              {topicObj.topic_blurb}
            </div>

            <div className='topic-header-text-sub mt-3'>
              (共{topicObj.vod_list.length}部)
            </div>
            {/* mobile vod list  */}
            <div className='row mt-2'>
              {topicObj.vod_list.map((vod) => (
                <div className='col-lg-6 col-md-12 pt-3 pb-3 cursor-pointer'>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/play/${vod.vod_id}`);
                    }}
                  >
                    <div className='row '>
                      <div className='col-12'>
                        <div className='row'>
                          <div
                            style={{
                              width: '128px',
                            }}
                          >
                            <img
                              alt='vod'
                              className={`object-cover`}
                              src={vod?.vod_pic_list[0]}
                              style={{
                                borderRadius: '10px',
                                width: '100%',
                                aspectRatio: '5/7',
                              }}
                            />
                          </div>

                          <div className='col pl-0'>
                            <div className='topic-details-title-mobile'>
                              {' '}
                              {vod.vod_name}{' '}
                            </div>
                            <div className='topic-details-title-sub text-secondary '>
                              {' '}
                              {vod.vod_year} {vod.vod_class}
                            </div>
                            <div className='topic-details-title-sub text-secondary '>
                              {' '}
                              主演:
                              {vod.vod_actor.length > 20
                                ? vod.vod_actor.substring(0, 20) + '...'
                                : vod.vod_actor}
                            </div>
                            <div className='topic-details-title-sub text-secondary '>
                              {vod.vod_blurb.length > 42
                                ? vod.vod_blurb.substring(0, 42) + '...'
                                : vod.vod_blurb}
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
        </>
      )}
    </>
  );
}
