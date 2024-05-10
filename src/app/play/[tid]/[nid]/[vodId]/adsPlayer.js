import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faArrowRight,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import LoginFlow from '@/components/login/loginFlow';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import { useLoginOpen } from '@/hook/yingshiScreenState/useLoginOpen';
import { useRouter } from 'next/navigation';

export const AdsPlayer = ({
  adsInfo,
  handleAdsPlayerEndPlay,
  handleVipSkipAd,
}) => {
  const adsPlayerRef = useRef(null);
  const loginFlowRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [remaining, setRemaining] = useState(15);

  const playVideo = () => {
    adsPlayerRef.current.play();
  };

  const pauseVideo = () => {
    adsPlayerRef.current.pause();
  };

  const handleHrefLink = () => {
    if (isPlaying) {
      pauseVideo();
      window.open('https://aha888.vip/home?channel=100007', '_blank');
    }
  };

  const handleOnSkipAd = () => {
    const isMobile = window.innerWidth < 768;

    if (!userInfo) {
      if (isMobile) {
        setIsLoginOpen(true);
      } else {
        loginFlowRef.current.start();
      }
    } else {
      router.push('/payment');
    }

    pauseVideo();
  };

  useEffect(() => {
    const updateRemainingTime = () => {
      if (adsPlayerRef.current) {
        const remainingTime =
          adsPlayerRef.current.duration - adsPlayerRef.current.currentTime;
        setRemaining(parseInt(remainingTime));
      }
    };

    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className='flex relative justify-center items-center'>
      <LoginFlow ref={loginFlowRef} />
      <video
        className={`${isPlaying ? 'cursor-pointer' : ''}`}
        ref={adsPlayerRef}
        autoPlay
        playsInline
        onEnded={handleAdsPlayerEndPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={() => {
          handleHrefLink();
        }}
      >
        <source
          src={
            adsInfo?.ads_pic === undefined
              ? 'https://oss.yingshi.tv/videos/vod/vi/aha-qiantiepian-15sec.mp4'
              : adsInfo?.ads_pic
          }
          type='video/mp4'
        />
      </video>
      <div
        className={`absolute bg-[#00000099] py-1 px-2 rounded-full items-center top-2 right-2 ${
          remaining !== null ? 'flex' : 'hidden'
        }`}
      >
        <span className='text-sm nowrap'>{remaining}s&nbsp;|&nbsp;</span>
        <span
          onClick={handleVipSkipAd}
          className='text-[#0085E0] text-sm nowrap cursor-pointer'
        >
          VIP跳广告
        </span>
        <FontAwesomeIcon
          style={{
            fontSize: '12px',
            paddingLeft: '5px',
            color: '#0085E0',
          }}
          icon={faAngleRight}
        />
      </div>
      <div
        className={`rounded-full bg-[#00000099] w-14 h-14 flex justify-center items-center absolute cursor-pointer ${
          isPlaying ? 'hidden' : 'flex'
        }`}
        onClick={() => {
          playVideo();
        }}
      >
        <FontAwesomeIcon
          style={{
            fontSize: '25px',
          }}
          icon={faPlay}
        />
      </div>
    </div>
  );
};
