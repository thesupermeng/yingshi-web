import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const VideoVerticalCard = ({ vod }) => {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center'>
      <div className='relative flex w-full aspect-[530/726] group mx-4 my-3 rounded-lg'>
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
          className='rounded-lg transition group-hover:scale-125 
            group-hover:cursor-pointer group-hover:rounded-none group-hover:z-10'
          style={{
            objectFit: 'cover',
          }}
        />
        {/* <div className='flex absolute w-full bottom-1 px-1'>
          <div className='w-full bg-[#0ff00099] rounded-md p-0.5'>
            <span line className='text-xs truncate'>
              {vod.vod_remarks}
            </span>
          </div>
        </div> */}
        <div
            className='flex  p-1 rounded-md absolute right-1 bottom-1'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <span line className='text-xs truncate'>{vod.vod_remarks}</span>
          </div>
      </div>
      <span className='text-center text-sm mx-1'>{vod.vod_name}</span>
    </div>
  );
};
