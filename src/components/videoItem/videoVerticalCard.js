import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const VideoVerticalCard = ({ vod }) => {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center'>
      <div className='relative flex w-full aspect-[530/726] group mx-4 my-3 rounded-lg'>

        <div className='desktop '> <Image
          placeholder='blur'
          blurDataURL={vod.vod_pic}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/play/${vod.vod_id}`);
          }}
          alt='game'
          src={vod.vod_pic}
          fill
          sizes='100%'
          className='rounded-lg transition group-hover:scale-125 
            group-hover:cursor-pointer group-hover:rounded-none group-hover:z-10 desktop-scale'
          style={{
            objectFit: 'cover',
          }}
        /></div>

        <div className='mobile'>
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
            sizes='100%'
            className='rounded-lg transition hover-effect '
            style={{
              objectFit: 'cover',
            }}
          /></div>

        {vod.vod_remarks !== undefined ? (
          <div className='flex absolute w-full bottom-1 px-1.5 justify-end'>
            <div className='bg-[#00000099] rounded-md p-1 max-w-full'>
              <p className='text-xs truncate'>
                {vod.vod_remarks}
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <span className='text-center text-sm mx-1'>{vod.vod_name}</span>
    </div>
  );
};
