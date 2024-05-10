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
import { FullPageContent } from '@/componentsH5/FullPageContent';
import { LottieAnimation } from '../../../../../../src/components/lottie';
import { IrrLoading } from '@/asset/lottie';
import FullScreenModal from '@/components/FullScreenModal';
import { AdsPlayer } from './adsPlayer.js';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser.js';
import {useLoginOpen} from '@/hook/yingshiScreenState/useLoginOpen';

export const PlayVod = ({ vodId, tId, nId }) => {
  const router = useRouter();

  const { t } = useTranslation();
  const shareContentRef = useRef(null);

  const domElementRef = useRef(null);
  const playerDivRef = useRef(null);
  const playerRef = useRef(null);
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
  const [toggleShowShareBoxStatus, setToggleShowShareBoxStatus] =
    useState(false);
  const [vodShareContent, setVodShareContent] = useState('');
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [ads, setAds] = useState(null);
  const [showAds, setShowAds] = useState(true);
  const { isVip , userInfo} = useYingshiUser();
  const [_, setIsLoginShow] = useLoginOpen();

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

  const getAds = async () => {
    // return YingshiApi(
    //   URL_YINGSHI_VOD.getAdsVideoSlot,
    //   {
    //     slot_id: slotId,
    //   },
    //   { method: 'GET' }
    // );
    let ads = {
      video: 'https://oss.yingshi.tv/videos/vod/vi/aha-qiantiepian-15sec.mp4',
      totalDuration: 15,
    };
    return ads;
  };

  useEffect(() => {
    let content = '';

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

      content += '《' + vod.vod_name + '》高清播放';
      content += '</br>' + window.location.href;
      content += '</br>鲨鱼TV-海量高清视频在线观看';

      setVodShareContent(content);
    }
  }, [vod]);

  useEffect(() => {
    if (episodeSelected == null) {
      if (isVip) {
        setShowAds(false);
      } else {
        getAds().then((res) => {
          setAds(res);
        });
      }

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

        const vodIdTemp = JSON.parse(localStorage.getItem('vodIdTemp'));
        console.log(vodIdTemp);
        if (vodIdTemp === null) {
          localStorage.setItem('vodIdTemp', vodId);
        } else {
          if (vodIdTemp !== parseInt(vodId)) {
            localStorage.removeItem('vodSourceSelected');
            localStorage.removeItem('vodIdTemp');
          }
        }

        if (res.vod_sources.length > 0) {
          const sourceType = JSON.parse(
            localStorage.getItem('vodSourceSelected')
          );
          console.log(sourceType);
          let index = 0;
          if (sourceType !== null)
            index = res.vod_sources.findIndex(
              (x) => x.source_id === sourceType.source_id
            );

          let source = res.vod_sources[index == -1 ? 0 : index];
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
            if (nId && nId > 0 && nId < 9999) {
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
    console.log(episodeSelected);
    if (episodeSelected !== null) {
      if (playerRef.current) {
        playerRef.current.pause();
      }
      if (isVip) {
        setShowAds(false);
      } else {
        getAds().then((res) => {
          setAds(res);
        });
      }

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
    if (source.source_id !== vodSourceSelected.source_id) {
      setVodSourceSelected(source);
      localStorage.setItem('vodSourceSelected', JSON.stringify(source));
      window.location.reload();
    }
    // router.push(`/play/${vod.type_id}/${episodeSelected.nid + 1}/${vod.vod_id}`);
    // router.replace(`/play/${vod.type_id}/${episodeSelected.nid + 1}/${vod.vod_id}`)

    // if (source.vod_play_list.urls?.length > 0) {
    //   setEpisodeSelected(source.vod_play_list.urls[0]);
    // }
  };

  const onSelectEpisodeGroup = (group) => {
    setEpisodeGroupSelected(group);
  };

  const onSelectEpisode = (episode) => {
    router.push(`/play/${vod.type_id}/${episode.nid + 1}/${vod.vod_id}`);
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

    router.push(
      `/play/${vod.type_id}/${
        vodSourceSelected?.vod_play_list?.urls[indexFound + 1].nid + 1
      }/${vod.vod_id}`
    );
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

  const toggleShowShareBox = (e) => {
    console.log(e?.target?.id);
    if (typeof e == 'undefined') {
      setToggleShowShareBoxStatus(true);
      return;
    }

    if (e?.target?.id === 'parentBg' || e?.target?.id === 'parentBgMobile') {
      setToggleShowShareBoxStatus(false);
      return;
    }
  };

  const copyContentToClipboard = () => {
    let content = vodShareContent.replaceAll('</br>', ' ');
    navigator.clipboard.writeText(content);
    setShowToastMessage(true);
    setToggleShowShareBoxStatus(false);
    const timeout = setTimeout(() => setShowToastMessage(false), 2000);
  };

  const handleAdsPlayerEndPlay = () => {
    setShowAds(false);
  };

  const handleVipSkipAd = () => {
    if (!userInfo) {
      // not logged in, jump login btm sheet
      setIsLoginShow(true);
    } else {
      if (!isVip) {
        // not vip, jump to payment
        router.push('/payment');
      }
    }
  }

  return (
    <div
      ref={domElementRef}
      className='container'
      style={{ padding: '0px', position: 'relative' }}
    >
      <div
        className={`${
          showToastMessage ? 'flex' : 'hidden'
        } items-center justify-center`}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        <div
          className={`fixed top-0 z-[9999] flex items-center justify-center w-full h-full pointer-events-none text-white transition-opacity duration-300 opacity-100`}
        >
          <div
            className='text-white px-6 py-3 rounded-[12px] text-sm flex gap-3'
            style={{ background: '#1D2023CC' }}
          >
            已复制链接
          </div>
        </div>
      </div>
      <div className='desktop'>
        <div
          className={`${
            toggleShowShareBoxStatus ? 'block' : 'hidden'
          } fixed z-50 top-0 bottom-0 left-0 right-0 bg-black opacity-60`}
        ></div>
        <div
          className={`${
            toggleShowShareBoxStatus ? 'block' : 'hidden'
          } h-screen fixed z-50 top-0 bottom-0 left-0 right-0 bg-transparent backdrop-blur-sm`}
        >
          <div
            className='items-center justify-center'
            style={{ display: 'flex', width: '100%', height: '100%' }}
            id='parentBg'
            onClick={toggleShowShareBox}
          >
            <div
              // className={`${toggleShowShareBoxStatus ? 'flex' : 'hidden'} h-screen desktop`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <div
                className=''
                style={{
                  width: '400px',
                  height: '30%',
                  zIndex: '999',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  background: '#1D2023',
                  padding: '1rem 1rem 0rem 1rem',
                  borderRadius: '12px',
                }}
              >
                <span className='text-md' style={{ fontWeight: '500' }}>
                  分享视频
                </span>
                <div
                  style={{
                    width: '100%',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                  }}
                >
                  <span className='text-sm'>
                    复制下方链接，去粘贴给好友吧：
                  </span>
                </div>
                <div
                  className=''
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(137, 149, 181, 0.08)',
                    padding: '1rem',
                  }}
                >
                  <div
                    className='text-sm'
                    ref={shareContentRef}
                    dangerouslySetInnerHTML={{ __html: vodShareContent }}
                  ></div>
                </div>
                <div
                  style={{
                    padding: '0.3rem 1.2rem',
                    background: '#0085E0',
                    borderRadius: '12px',
                    margin: '0.5rem',
                  }}
                  onClick={copyContentToClipboard}
                >
                  <span className='text-sm cursor-pointer'>一键复制</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mobile'>
        <div
          className={`${
            toggleShowShareBoxStatus ? 'flex' : 'hidden'
          } fixed z-10 top-0 bottom-0 left-0 right-0 bg-black opacity-60`}
        ></div>
        <div
          className={`${
            toggleShowShareBoxStatus ? 'flex' : 'hidden'
          } w-screen h-screen z-50`}
          style={{
            flexDirection: 'column',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          id='parentBgMobile'
          onClick={toggleShowShareBox}
        >
          <div
            id='mobileShareContent'
            className=''
            style={{
              width: '90%',
              height: '30%',
              zIndex: '1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              background: '#1D2023',
              padding: '1rem 1rem 0rem 1rem',
              borderRadius: '12px',
            }}
            onClick={toggleShowShareBox}
          >
            <span className='text-md' style={{ fontWeight: '500' }}>
              分享视频
            </span>
            <div
              style={{
                width: '100%',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
              }}
            >
              <span className='text-sm'>复制下方链接，去粘贴给好友吧：</span>
            </div>
            <div
              className=''
              style={{
                width: '100%',
                height: '100%',
                background: 'rgba(137, 149, 181, 0.08)',
                padding: '1rem',
              }}
            >
              <div
                className='text-sm'
                ref={shareContentRef}
                dangerouslySetInnerHTML={{ __html: vodShareContent }}
              ></div>
            </div>
            <div
              style={{
                padding: '0.5rem 1.2rem',
                background: '#0085E0',
                borderRadius: '12px',
                margin: '0.5rem',
              }}
              onClick={copyContentToClipboard}
            >
              <span className='text-sm'>一键复制</span>
            </div>
          </div>
        </div>
      </div>

      {vod == null ? (
        <FullPageContent>
          <div className='flex flex-1 w-full h-full items-center justify-center'>
            <LottieAnimation
              src={IrrLoading}
              tw={`w-[${80}px] h-[${80}px]`}
              isLoop={true}
            />
          </div>
        </FullPageContent>
      ) : (
        <div className='flex flex-row space-x-4'>
          <div
            className='flex-1 space-y-4 no-scrollbar'
            style={{ width: '78%' }}
          >
            <div
              ref={playerDivRef}
              className='aspect-[16/9] absolute w-full lg:relative lg:w-[100%] sticky md:static top-0'
              style={{ zIndex: '1' }}
            >
              <div
                className='p-3 mobile'
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
              {showAds ? (
                <AdsPlayer
                  className='aspect-[16/9]'
                  adsInfo={ads}
                  handleAdsPlayerEndPlay={handleAdsPlayerEndPlay}
                  handleVipSkipAd={handleVipSkipAd}
                />
              ) : (
                <Artplayer
                  // key={episodeSelected?.url}
                  className='aspect-[16/9]'
                  option={{
                    container: '.artplayer-app',
                    url: episodeSelected?.url ?? '',
                    fullscreen: true,
                    autoplay: /^((?!chrome|android).)*safari/i.test(
                      navigator.userAgent
                    )
                      ? false
                      : true,
                    muted: false,
                  }}
                  adsInfo={ads}
                  getInstance={(art) => console.info(art)}
                  onVideoEnd={onVideoEnd}
                  episodeSelected={episodeSelected}
                  vodSourceSelected={vodSourceSelected}
                />
              )}
            </div>
            {/* <div
              className='lg:hidden block'
              style={{ height: `${playerDivHeight}px` }}
            ></div> */}
            {/* Web Share Horizontal */}
            <div className='lg:flex hidden'>
              <ShareHorizontal
                className={'w-[80%]'}
                setShowShareBox={() => {
                  setToggleShowShareBoxStatus(true);
                }}
              />
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
                    setShowShareBox={toggleShowShareBox}
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
                    setShowShareBox={toggleShowShareBox}
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
                      <p>{vod.vod_content}</p>
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
