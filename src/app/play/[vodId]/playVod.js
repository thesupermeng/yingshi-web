import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';
import { YingshiApi } from '@/util/YingshiApi';
import { VideoJSPlayer } from '@/components/videoPlayer/VideoJSPlayer';
import { useTapDebounce } from '@/hook/useTapDebounce';
import VideoPlayerWrapper from '@/components/videoPlayer/VideoPlayerWrapper';
import Artplayer from './player.js';

import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';

export const PlayVod = ({ vodId }) => {

  const domElementRef = useRef(null);

  const [vod, setVod] = useState(null);
  const [sources, setSources] = useState(null);
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState("");
  const [isTapPlayer, onTapPlayer] = useTapDebounce();
  const [isActive, setIsActive] = useState(false);
  const vpRef = useRef(null);

  // useEffect(() => {
  //   if (domElementRef.current) {
  //     console.log('click');
  //     domElementRef.current.click();
  //     setIsActive(true);
  //   }
  // });

  const getVodDetails = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.getVodDetails,
      {
        id: vodId
      },
      { method: 'GET' }
    );
  };

  useEffect(() => {
    getVodDetails().then((data) => {
      let res = data[0];
      setVod(res);

      if(res.vod_sources.length > 0){
        let source = res.vod_sources[0];
        if(source.vod_play_list.urls.length > 0){
          setCurrentPlayingUrl(source.vod_play_list.urls[0].url);
        }
      }
    });

  }, [isActive]);
  
  return (
    <div ref={domElementRef} style={{ width: '100%' }}>
      {vod != null &&
        (
          <div>
            <span>DAADAAA</span>
            <span>{vod.vod_name}</span>
            <div className='aspect-[430/196] w-[800px]'>
              {/* <VideoPlayerWrapper
                onClick={onTapPlayer}
                src={currentPlayingUrl}
                id={vod.vod_id}
              >
              </VideoPlayerWrapper> */}
              {/* <VideoJSPlayer
                ref={vpRef}
                isActive={isActive}
                link={currentPlayingUrl}
                id={vod.vod_id}
              /> */}
              <Artplayer
                option={{
                    url: "https://m3u.haiwaikan.com/xm3u8/9bc87cadf9e5daa22f29e840c06f432abc770cf4658b2cb624ab12c2df86709c9921f11e97d0da21.m3u8",
                }}
                style={{
                    width: '600px',
                    height: '400px',
                    margin: '60px auto 0',
                }}
                getInstance={(art) => console.info(art)}
            />
            </div>
          </div>
        )
      }
    </div>
  )

}