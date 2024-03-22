
import { useEffect, useState } from 'react';
import Image from 'next/image';

export const VideoVerticalCard = ({ vod }) => {

  useEffect(() => {
    console.log("VOD");
    console.log(vod);
  }, [])

  return (
    <>
      <div className='relative flex w-full aspect-[530/726] overflow-hidden group mx-4 my-3 rounded-lg'>
        <Image
          placeholder='blur'
          blurDataURL={vod.vod_pic}
          onClick={(e) => {
            e.preventDefault();
          }}
          alt='game'
          src={vod.vod_pic}
          fill
          className='transition group-hover:scale-110 group-hover:opacity-50'
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      <div className='absolute right-3 top-3'>
        {/* <GameFav id={id} /> */}
      </div>
    </>
  )
}
