import React from "react";
import { useTranslation } from "react-i18next";
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
import { ArrowLeftIcon } from '@/asset/icons';
import Image from "next/image";
import { useRouter } from 'next/navigation';

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

  const getVodDetails = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.getVodDetails,
      {
        id: vodId,
        tid: tId
      },
      { method: 'GET' }
    );
  };

  const getSuggestedVodType = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.searchingList,
      {
        category: vod?.vod_class?.split(",").shift(),
        tid: vod?.type_id.toString() ?? "",
        limit: 12,
      },
      { method: 'GET' }
    );
  }

  useEffect(() => {
    if (episodeSelected == null) {
      getVodDetails().then((data) => {
        console.log(data);
        if (data === undefined || data.length <= 0 || data.List === undefined || data.List.length <= 0) return;
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
    })
  }, [vod])

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

  return (
    <div ref={domElementRef} className='lg:w-[85%] w-screen'>
      {vod != null && (
        <div className='flex flex-row space-x-4'>
          <div className='flex-1 space-y-4 no-scrollbar' style={{ width: '78%' }}>
            <div ref={playerDivRef} className='aspect-[16/9] absolute w-screen lg:relative lg:w-[100%]' style={{ zIndex: '10' }}>
              <div className="p-3 lg:hidden block" onClick={() => router.back()} style={{ background: 'black', textAlign: 'center', position: 'relative' }}>
                {vod.vod_name}
                <div className="pt-3" style={{ position: 'absolute', top: '0', marginTop: '0.4rem' }}>
                  <Image
                    src={ArrowLeftIcon}
                    alt="Icon"
                  />
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
            <div className="lg:hidden block" style={{ height: `${playerDivHeight}px` }}>

            </div>
            {/* Web Share Horizontal */}
            <div className="lg:flex hidden">
              <ShareHorizontal
                className={'w-[80%]'}
              />
            </div>
            <VodContent vodContent={vod.vod_content} vodEpisodeSelected={episodeSelected} vodEpisodeInfo={vod.vod_episode_info} />

            <div className='lg:hidden flex flex-col space-y-4' style={{ width: '100%' }}>
              <div className="">
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
            <div className="flex justify-center">
              <div className="lg:w-[100%] w-[90%]">
                <div style={{ marginTop: '30px', marginBottom: '10px' }}>
                  <span className="text-xl" style={{ fontWeight: '500' }}>{t('相关推荐')}</span>
                </div>
                <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5' style={{ marginTop: '0px', marginBottom: '5rem' }}>
                  {suggestedVods.length > 0 && suggestedVods?.slice(0, 12).map((vod, i) => {
                    return <VideoVerticalCard vod={vod} key={i} />;
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className='lg:flex hidden flex-col space-y-4' style={{ width: '22%' }}>
            <div className="">
              <div className={`space-y-4 ${styles.vodMetaContainer}`}>
                <VodCard
                  imgSource={vod.vod_pic}
                  vodName={vod.vod_name}
                  vodUpdateDate={vod.vod_time}
                  vodYear={vod.vod_year}
                  vodClass={vod.vod_class}
                  vodRemark={vod.vod_remarks}
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
