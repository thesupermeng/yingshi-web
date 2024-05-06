import { useEffect, useLayoutEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

export default function Player({ option, getInstance, onVideoEnd, episodeSelected, vodSourceSelected, ...rest }) {
  const artContainerRef = useRef();
  const artRef = useRef();

  const playM3U8 = (video, url, art) => {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;
      art.on('destroy', () => hls.destroy());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else {
      art.notice.show = 'Unsupported playback format: m3u8';
    }
  };

  useLayoutEffect(() => {
    let showNextFlag;
    try {
      showNextFlag = episodeSelected.name == vodSourceSelected.vod_play_list.urls[vodSourceSelected.vod_play_list.url_count - 1].name;
    }
    catch (e) {
      showNextFlag = false
    }

    artRef.current = new Artplayer({
      ...option,
      container: artContainerRef.current,
      type: 'm3u8',
      customType: {
        m3u8: playM3U8,
      },
      fullscreenWeb: true,
      pip: true,
      setting: true,
      playbackRate: true,
      autoPlayback: true,
      aspectRatio: true,
      theme: '#0085E0',

      lang: 'zh-cn',
      controls: [
        {
          disable: showNextFlag,
          name: 'nextButton', // 设置按钮的名称，用于在控制栏中标识
          index: 20,
          tooltip: '下集',
          position: 'left', // 设置按钮在控制栏中的位置，这里假设放在右侧
          html: '<img src="/img/playNext.png" width="36px">', // 设置按钮的 HTML 内容
          click: onVideoEnd,
          //   click:  function () {
          //     // top.location.href = MacPlayer.PlayLinkNext;
          //     onVideoEnd()
          // },
        },
      ],
    });

    if (getInstance && typeof getInstance === 'function') {
      getInstance(artRef.current);
    }

    return () => {
      if (artRef.current && artRef.current.destroy) {
        artRef.current.destroy();
      }
    }
  }, [])

  useEffect(() => {
    artRef.current.switchUrl(option.url)
    artRef.current.on('video:ended', onVideoEnd);

    return () => {
      if (artRef.current) {
        artRef.current.off('video:ended', onVideoEnd);
      }
    }
  }, [option.url]);

  return <div ref={artContainerRef} {...rest}></div>;
}
