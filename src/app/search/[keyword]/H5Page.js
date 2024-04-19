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
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import VodItemMobile from './../../../components/vodItemMobile'
import Image from 'next/image';

import {

  searchEmptyIcon,

} from '@/asset/icons';

export default function Page() {
  const { keyword } = useParams();
  const [searchResults, setSearchResults] = useState();
  const [isSearching, setIsSearching] = useState(true);
  const router = useRouter();



  //todo remove this 
  const topicObj = false;


  const getSearchResultApi = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.searchingList + '?wd=' + keyword + '&limit=100&page=1',
      {},
      { method: 'GET' }
    );
  };

  const getSearchResult = async () => {
    setIsSearching(true)
    console.log('keyword');
    console.log(keyword);

    let res = await getSearchResultApi();

    console.log('result is ')
    console.log(res)
    setSearchResults(res);
    setIsSearching(false)
  };

  useEffect(() => {
    getSearchResult();
  }, []);

  useEffect(() => {
    console.log('set result is ')
    console.log(searchResults)
  }, [searchResults]);

  return (
    <>
      <div className='desktop'>
        <div className={styles.containerHeader}>
          <div className='d-flex' style={{ width: '100%' }}>
            <div className='overlay' style={{ width: '100%' }}>
              <div className='row px-0 d-flex flex-column '>
                <div className='topic-container-header container content-end'>
                  <div className='topic-header-text'>{keyword}</div>
                  <div className='topic-header-text-sub'>


                    搜索"{keyword}" ，找到
                    <span className='search-count'>
                      {isSearching === false ? (
                        <span>{searchResults?.List?.length}</span>
                      ) : (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      )}</span>

                    部影视作品
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {searchResults && (
        <>


          {/* desktop  view  */}
          <div className='desktop'>
            <div className='d-flex container pt-3 ' style={{ width: '100%' }}>
              <div className='row'>
                {searchResults?.List?.map((vod) => (
                  <div className='col-6 mt-2 mb-2'>
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
                            <div className='col-3'>
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

                            <div className='col-9'>
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
                                {vod.vod_actor?.length > 38
                                  ? vod.vod_actor?.substring(0, 35) + '...'
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

          {/* movile   view  */}


          <div className='mobile'>
            <div className='d-flex container pt-3' style={{ width: '100%' }}>
              <div className='row'>
                {searchResults?.List?.map((vod) => (
                  <VodItemMobile vod={vod} />
                ))}
              </div>
            </div>
          </div>


          {searchResults?.List == null &&

            <div className='flex items-center justify-center flex-col h-full'>
              <Image
                className='mx-2'
                src={searchEmptyIcon}
                alt='empty'
                width={120}
              />
              <span>暂无数据</span>

              <span className="text-xs pt-2">    抱歉没有搜索到"{keyword}"的相关视频</span>



            </div>


          }

        </>
      )}
      {/* topic list  */}
      {/* <div className='d-flex container pb-6'>
        <div className='row '></div>
      </div> */}
    </>
  );
}
