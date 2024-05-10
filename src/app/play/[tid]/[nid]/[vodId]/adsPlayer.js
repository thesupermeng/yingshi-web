import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faArrowRight,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';

export const AdsPlayer = ({ adsInfo, handleAdsPlayerEndPlay, handleVipSkipAd }) => {
  const adsPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remaining, setRemaining] = useState(15);

  const playVideo = () => {
    adsPlayerRef.current.play();
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
      <video
        ref={adsPlayerRef}
        autoPlay
        playsInline

        onEnded={handleAdsPlayerEndPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={adsInfo.video} type='video/mp4' />
      </video>
      <div
        className={`absolute bg-[#00000099] py-1 px-2 rounded-full items-center top-2 right-2 ${
          remaining !== null ? 'flex' : 'hidden'
        }`}
      >
        <span className='text-sm nowrap'>{remaining}s后关闭广告|</span>
        <span onClick={handleVipSkipAd} className='text-[#0085E0] text-sm nowrap'>
          VIP跳广告
        </span>
        <FontAwesomeIcon
          style={{
            fontSize: '15px',
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
