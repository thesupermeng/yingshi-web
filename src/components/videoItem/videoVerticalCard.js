
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const VideoVerticalCard = ({ vod }) => {

  const router = useRouter();

  return (
    <>
      <div className='relative flex w-full aspect-[530/726] overflow-hidden group mx-4 my-3 rounded-lg'>
        <Image
          placeholder='blur'
          blurDataURL={vod.vod_pic}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/play/${vod.vod_id}`);
          }}
          alt='game'
          src={vod.vod_pic}
          fill
          sizes="100%"
          className='transition group-hover:scale-110 group-hover:opacity-50 group-hover:cursor-pointer'
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
