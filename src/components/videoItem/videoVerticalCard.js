import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const VideoVerticalCard = ({ vod }) => {
  const router = useRouter();
  console.log(vod);
  return (
    <div className='flex flex-col items-center'>
      <div className='relative flex w-full aspect-[530/726] group mx-4 my-3 rounded-lg'>
        <div>
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
            className='rounded-lg transition group-hover:scale-150 
            group-hover:cursor-pointer group-hover:rounded-none group-hover:z-10'
            style={{
              objectFit: 'cover',
            }}
          />
          <div
            className='flex m-1 p-1 rounded-md absolute right-1 bottom-1'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <span className='text-sm'>{vod.vod_remarks}</span>
          </div>
        </div>
      </div>
      <span className='text-center text-sm mx-1'>{vod.vod_name}</span>
    </div>
  );
};
