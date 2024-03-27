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
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState('');
  const [preventMutipleCall, setPreventMutipleCall] = useState(false);

  const getVodDetails = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.getVodDetails,
      {
        id: vodId,
      },
      { method: 'GET' }
    );
  };

  useEffect(() => {
    if (currentPlayingUrl == '') {
      getVodDetails().then((data) => {
        let res = data[0];
        setVod(res);

        if (res.vod_sources.length > 0) {
          let source = res.vod_sources[0];
          if (source.vod_play_list.urls.length > 0) {
            setCurrentPlayingUrl(source.vod_play_list.urls[0].url);
          }
        }
      });
    }
  }, []);

  return (
    <div ref={domElementRef} style={{ width: '100%' }}>
      {vod != null && (
        <div>
          <span>DAADA</span>
          <span>{vod.vod_name}</span>
          <div className='aspect-[430/196] w-[800px]'>
            <Artplayer
              option={{
                container: '.artplayer-app',
                url: currentPlayingUrl,
                fullscreen: true,
                autoplay: true,
                muted: false,
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
      )}
    </div>
  );
};
