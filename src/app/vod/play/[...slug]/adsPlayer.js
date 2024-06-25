import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faArrowRight,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import { useLoginOpen } from '@/hook/yingshiScreenState/useLoginOpen';
import { useRouter } from 'next/navigation';

export const AdsPlayer = ({ adsInfo, handleAdsPlayerEndPlay }) => {
  const router = useRouter();
  const { userInfo } = useYingshiUser();
  const [isLoginOpen, setIsLoginOpen] = useLoginOpen();

  const adsPlayerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [remaining, setRemaining] = useState(15);

  const intervalIdRef = useRef(null); // Ref for storing interval ID

  const playVideo = () => {
    adsPlayerRef.current.play();
  };

  const pauseVideo = () => {
    adsPlayerRef.current.pause();
  };

  const handleStartCountDown = () => {
    setIsPlaying(true);

    const updateRemainingTime = () => {
      setRemaining((prevRemaining) => {
        const newRemainingTime = prevRemaining - 1;
        if (newRemainingTime <= 0) {
          clearInterval(intervalIdRef.current);
          handleAdsPlayerEndPlay();
        }
        return newRemainingTime;
      });
    };

    intervalIdRef.current = setInterval(updateRemainingTime, 1000); // Store interval ID in ref

    return intervalIdRef.current; // Return interval ID (optional)
  };

  const handleOnStopCount = () => {
    // clearInterval(intervalIdRef.current);
    // setIsPlaying(false);
    const isMobile = window.innerWidth < 768;
    if (!userInfo) {
      setIsLoginOpen(true);
    } else {
      router.push('/payment');
    }
  };

  const handleHrefLink = () => {
    if (isPlaying) {
      //  pauseVideo();
      window.open(adsInfo.ads_url, '_blank');
    }
  };

  const handleOnSkipAd = () => {
    const isMobile = window.innerWidth < 768;

    if (!userInfo) {
      setIsLoginOpen(true);
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

  return adsInfo !== null ? (
    <div className='flex relative justify-center items-center'>
      <video
        className={`${isPlaying ? 'cursor-pointer' : ''}`}
        ref={adsPlayerRef}
        autoPlay
        playsInline
        onProgress={() => {
          setRemaining(parseInt(adsPlayerRef.current.duration));
        }}
        onEnded={handleAdsPlayerEndPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={() => {
          handleHrefLink();
        }}
      >
        <source
          src={
            //'https://oss.yingshi.tv/videos/vod/vi/aha-qiantiepian-15sec.mp4'
            adsInfo.ads_pic
          }
          type='video/mp4'
        />
      </video>
      <div
        className={`absolute bg-[#00000099] py-1 px-2 rounded-full items-center top-2 right-2 ${remaining !== null ? 'flex' : 'hidden'
          }`}
      >
        <span className='text-sm nowrap'>{remaining}秒&nbsp;|&nbsp;</span>
        <span
          onClick={() => {
            handleOnSkipAd();
          }}
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
        className={`rounded-full bg-[#ffffffcc] w-14 h-14 flex justify-center items-center absolute cursor-pointer ${isPlaying ? 'hidden' : 'flex'
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
  ) : (
    <div className='flex w-full h-full relative justify-center items-center'>
      <div
        className={`absolute bg-[#00000099] py-1 px-2 rounded-full items-center top-2 right-2 ${remaining !== null ? 'flex' : 'hidden'
          }`}
      >
        <span className='text-sm nowrap'>{remaining}秒&nbsp;|&nbsp;</span>
        <span
          onClick={() => {
            handleOnStopCount();
          }}
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
        className={`rounded-full bg-[#ffffffcc] w-14 h-14 flex justify-center items-center absolute cursor-pointer ${isPlaying ? 'hidden' : 'flex'
          }`}
        onClick={() => {
          handleStartCountDown();
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
