import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { YingshiApi } from '@/util/YingshiApi';
import Artplayer from './player.js';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { ShareHorizontal } from '@/components/shareHorizontal';
import { VodCard } from '@/components/vod/vodCard.js';
import { VodSourceList } from '@/components/vod/vodSourceList.js';
import { VodEpisodeList } from '@/components/vod/vodEpisodeList.js';
import { Config } from '@/util/config.js';
import { VodPopularList } from '@/components/vod/vodPopularList.js';
import { VodContent } from '@/components/vod/vodContent.js';
import styles from './style.module.css';
import { AdsBanner } from '@/components/ads/adsBanner.js';
import { VideoVerticalCard } from '@/components/videoItem/videoVerticalCard';
import { ArrowLeftIcon, ArrowRightIcon } from '@/asset/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { convertTimeStampToDateTime } from '@/util/date';

export const PlayVod = ({ vodId, tId, nId }) => {
  const router = useRouter();

  const { t } = useTranslation();

  const domElementRef = useRef(null);
  const playerDivRef = useRef(null);
  const [vod, setVod] = useState(null);
  const [preventMutipleCall, setPreventMutipleCall] = useState(false);
  const [playerDivHeight, setPlayerDivHeight] = useState(0);
  const [vodSourceSelected, setVodSourceSelected] = useState(null);
  const [episodeSelected, setEpisodeSelected] = useState(null);
  const [episodeGroups, setEpisodeGroups] = useState([]);
  const [episodeGroupSelected, setEpisodeGroupSelected] = useState({});
  const [suggestedVods, setSuggestedVods] = useState([]);
  const [toggleJianJie, setToggleJianJie] = useState(false);
  const [desc, setDesc] = useState('');

  const getVodDetails = async () => {
    if (tId == 0) {
      return YingshiApi(
        URL_YINGSHI_VOD.getVodDetails,
        {
          id: vodId,
        },
        { method: 'GET' }
      );
    } else {
      return YingshiApi(
        URL_YINGSHI_VOD.getVodDetails,
        {
          id: vodId,
          tid: tId,
        },
        { method: 'GET' }
      );
    }
  };

  const getSuggestedVodType = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.searchingList,
      {
        category: vod?.vod_class?.split(',').shift(),
        tid: vod?.type_id.toString() ?? '',
        limit: 12,
      },
      { method: 'GET' }
    );
  };

  useEffect(() => {
    if (vod) {
      let desc = vod.vod_year + ' ' + vod.vod_area;
      let vodClass = [];
      if (vod.vod_class != null) {
        vodClass = vod.vod_class.split(',');
      }
      vodClass = vodClass.slice(0, 2);
      vodClass.forEach((item, i) => {
        desc += ' ' + item;
      });

      setDesc(desc);
    }
  }, [vod]);

  useEffect(() => {
    if (episodeSelected == null) {
      getVodDetails().then((data) => {
        if (
          data === undefined ||
          data.length <= 0 ||
          data.List === undefined ||
          data.List?.length <= 0
        )
          return;
        let res = data.List[0];
        setVod(res);

        if (res.vod_sources.length > 0) {
          let source = res.vod_sources[0];

          setVodSourceSelected(source);
          if (source.vod_play_list.urls.length > Config.vodEpisodeGroupMax) {
            const tolGroup = Math.ceil(
              source.vod_play_list.urls.length / Config.vodEpisodeGroupMax
            );
            const groups = [];

            for (let i = 0; i < tolGroup; i++) {
              groups.push({
                from: i * Config.vodEpisodeGroupMax + 1,
                to:
                  tolGroup === i + 1
                    ? source.vod_play_list.urls.length
                    : (i + 1) * Config.vodEpisodeGroupMax,
              });
            }

            setEpisodeGroups(groups);
            setEpisodeGroupSelected(groups.length > 0 ? groups[0] : {});
          } else {
            const defaultGroup = {
              from: 1,
              to: source.vod_play_list.urls.length,
            };

            setEpisodeGroups([defaultGroup]);
            setEpisodeGroupSelected(defaultGroup);
          }

          if (source.vod_play_list.urls.length > 0) {
            if (nId && nId > 0) {
              setEpisodeSelected(source.vod_play_list.urls[nId - 1]);
            } else {
              setEpisodeSelected(source.vod_play_list.urls[0]);
            }
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    getSuggestedVodType().then((data) => {
      setSuggestedVods(data.List);
    });
  }, [vod]);

  useEffect(() => {
    console.log(vod)
    if (episodeSelected !== null) {
      let watchHistory = {
        tid: tId,
        nid: episodeSelected.nid + 1,
        vodid: vodId,
        vodpic: vod.vod_pic,
        vodname: vod.vod_name,
        vodurl: episodeSelected.url,
        watchtimes: 0,
      };
      let watchHistoryData = JSON.parse(
        localStorage.getItem('watchHistoryList')
      );

      if (watchHistoryData != null) {
        if (
          watchHistoryData.findIndex(
            (item) => item.vodurl === watchHistory.vodurl
          ) == -1
        ) {
          watchHistoryData.push(watchHistory);
        } else {
          watchHistoryData = watchHistoryData.filter(
            (item) => item.vodurl !== watchHistory.vodurl
          );
          watchHistoryData.push(watchHistory);
        }

        if (watchHistoryData.length > 10) {
          watchHistoryData.splice(0, 1);
        }
      } else {
        watchHistoryData = [watchHistory];
      }
      localStorage.setItem(
        'watchHistoryList',
        JSON.stringify(watchHistoryData)
      );
    }
  }, [episodeSelected]);

  const onSelectSource = (source) => {
    setVodSourceSelected(source);

    if (source.vod_play_list.urls?.length > 0) {
      setEpisodeSelected(source.vod_play_list.urls[0]);
    }
  };

  const onSelectEpisodeGroup = (group) => {
    setEpisodeGroupSelected(group);
  };

  const onSelectEpisode = (episode) => {
    setEpisodeSelected(episode);
  };

  const onVideoEnd = () => {
    const indexFound = vodSourceSelected?.vod_play_list?.urls?.findIndex(
      (urlObj) => urlObj === episodeSelected
    );

    if (
      indexFound === -1 ||
      indexFound + 1 >= (vodSourceSelected?.vod_play_list?.urls?.length ?? 0)
    ) {
      return;
    }

    setEpisodeSelected(vodSourceSelected?.vod_play_list?.urls[indexFound + 1]);
  };

  useEffect(() => {
    if (playerDivRef.current) {
      const playerDivHeight = playerDivRef.current.offsetHeight;
      setPlayerDivHeight(playerDivHeight);
    }
  });

  const openJianJie = () => {
    setToggleJianJie(!toggleJianJie);
  };

  return (
    <div ref={domElementRef} className='lg:w-[85%] w-screen'>
      {vod == null ? (
        <div style={{ height: '80vh' }}></div>
      ) : (
        <div className='flex flex-row space-x-4'>
          <div
            className='flex-1 space-y-4 no-scrollbar'
            style={{ width: '78%' }}
          >
            <div
              ref={playerDivRef}
              className='aspect-[16/9] absolute w-screen lg:relative lg:w-[100%]'
              style={{ zIndex: '1' }}
            >
              <div
                className='p-3 lg:hidden block'
                onClick={() => router.back()}
                style={{
                  background: 'black',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {vod.vod_name}
                <div
                  className='pt-3'
                  style={{
                    position: 'absolute',
                    top: '0',
                    marginTop: '0.4rem',
                  }}
                >
                  <Image src={ArrowLeftIcon} alt='Icon' />
                </div>
              </div>
              <Artplayer
                className='aspect-[16/9]'
                option={{
                  container: '.artplayer-app',
                  url: episodeSelected?.url ?? '',
                  fullscreen: true,
                  autoplay: true,
                  muted: false,
                }}
                getInstance={(art) => console.info(art)}
                onVideoEnd={onVideoEnd}
              />
            </div>
            <div
              className='lg:hidden block'
              style={{ height: `${playerDivHeight}px` }}
            ></div>
            {/* Web Share Horizontal */}
            <div className='lg:flex hidden'>
              <ShareHorizontal className={'w-[80%]'} />
            </div>
            <VodContent
              vodContent={vod.vod_content}
              vodEpisodeSelected={episodeSelected}
              vodEpisodeInfo={vod.vod_episode_info}
            />

            <div
              className='lg:hidden flex flex-col space-y-4'
              style={{ width: '100%' }}
            >
              <div className=''>
                <div className={`space-y-4 ${styles.vodMetaContainer}`}>
                  <VodCard
                    imgSource={vod.vod_pic}
                    vodName={vod.vod_name}
                    vodUpdateDate={vod.vod_time}
                    vodYear={vod.vod_year}
                    vodClass={vod.vod_class}
                    vodRemark={vod.vod_remarks}
                    vodEpisodeSelected={episodeSelected}
                    vodEpisodeInfo={vod.vod_episode_info}
                    vod={vod}
                  />

                  <VodSourceList
                    vodSources={vod.vod_sources}
                    vodSourceSelected={vodSourceSelected}
                    onSelectSource={onSelectSource}
                  />

                  <VodEpisodeList
                    episodeGroups={episodeGroups}
                    episodeGroup={episodeGroupSelected}
                    vodSource={vodSourceSelected}
                    episodeSource={episodeSelected}
                    onSelectEpisodeGroup={onSelectEpisodeGroup}
                    onSelectEpisode={onSelectEpisode}
                    style={{
                      maxHeight: 300,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='flex justify-center'>
              <div className='lg:w-[100%] w-[90%]'>
                <div style={{ marginTop: '30px', marginBottom: '10px' }}>
                  <span className='text-xl' style={{ fontWeight: '500' }}>
                    {t('相关推荐')}
                  </span>
                </div>
                <div
                  className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5'
                  style={{ marginTop: '0px', marginBottom: '5rem' }}
                >
                  {suggestedVods.length > 0 &&
                    suggestedVods?.slice(0, 12).map((vod, i) => {
                      return <VideoVerticalCard vod={vod} key={i} />;
                    })}
                </div>
              </div>
            </div>
          </div>

          <div
            className='lg:flex hidden flex-col space-y-4'
            style={{ width: '22%' }}
          >
            <div className=''>
              {!toggleJianJie ? (
                <div className={`space-y-4 ${styles.vodMetaContainer}`}>
                  <VodCard
                    imgSource={vod.vod_pic}
                    vodName={vod.vod_name}
                    vodUpdateDate={vod.vod_time}
                    vodYear={vod.vod_year}
                    vodClass={vod.vod_class}
                    vodRemark={vod.vod_remarks}
                    vod={vod}
                    openJianJie={openJianJie}
                  />

                  <VodSourceList
                    vodSources={vod.vod_sources}
                    vodSourceSelected={vodSourceSelected}
                    onSelectSource={onSelectSource}
                  />

                  <VodEpisodeList
                    episodeGroups={episodeGroups}
                    episodeGroup={episodeGroupSelected}
                    vodSource={vodSourceSelected}
                    episodeSource={episodeSelected}
                    onSelectEpisodeGroup={onSelectEpisodeGroup}
                    onSelectEpisode={onSelectEpisode}
                    style={{
                      maxHeight: 300,
                    }}
                  />
                </div>
              ) : (
                <div className={`space-y-4 ${styles.vodMetaContainer}`}>
                  <div
                    className='flex flex-row cursor-pointer'
                    onClick={openJianJie}
                  >
                    <div className='mx-3' style={{ margin: 'auto' }}>
                      <Image src={ArrowLeftIcon} alt='Icon' />
                    </div>
                    <div>{vod.vod_name}</div>
                  </div>
                  <div></div>
                  <div className='pb-6' style={{ color: '#9C9C9C' }}>
                    <div className='text-sm pt-1'>{desc}</div>
                    <div className='text-sm pt-1'>
                      更新: {convertTimeStampToDateTime(vod.vod_time).year}-
                      {convertTimeStampToDateTime(vod.vod_time).month}-
                      {convertTimeStampToDateTime(vod.vod_time).day}
                    </div>
                    <div className='text-sm pt-1'>主演: {vod.vod_actor}</div>
                    <div
                      className='text-md pt-3 py-2'
                      style={{
                        color: 'rgb(33 150 243 / var(--tw-text-opacity))',
                      }}
                    >
                      简介
                    </div>
                    <div className='text-sm'>
                      <p>
                        平静的沿海小城三平市，缉毒大队在一次行动中意外缴获一批新型冰毒，其规模和纯度都极为罕见，三平公安立即展开调查。部队转业女警赵友男（姚安娜 饰）凭着敏锐的嗅觉和洞察力，将目标锁定在了做化工买卖的黄宗伟身上。诡计多端的黄宗伟（张颂文 饰）让初出茅庐的赵友男燃起了斗志，她死盯黄宗伟，不管对方藏在何处，不管假像如何高级，她都能挖到线索，发现真相，义无反顾奔赴抓捕。 以赵友男为首的公安队伍和以黄宗伟为首的制毒贩毒份，一个穷追不舍死咬不放，一个诡计多端擅于隐藏，就这样上演了一出“猫鼠大战”。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.vodMetaContainer}>
              <VodPopularList />
            </div>

            {/* <AdsBanner height='500px' /> */}
          </div>
        </div>
      )}
    </div>
  );
};
