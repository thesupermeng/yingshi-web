import Image from 'next/image';
import {VipBlackIcon} from '@/asset/icons';
import React from 'react';
import {Button} from '@material-tailwind/react';

export default function VipCard({onClick}) {
  return (
    <div className={'w-full'}>
      <div className={'flex h-[58px] bg-[#D1AC7D] rounded-lg p-1.5 items-center gap-2'}>
        <div className={'w-12 h-12 flex justify-center items-center'}>
          <Image src={VipBlackIcon} alt={'VIP icon'}/>
        </div>
        <div className={'flex flex-col flex-1'}>
          <span className={'text-[15px] text-[#1D2023] font-semibold'}>成为VIP</span>
          <span className={'text-[13px] text-[#1D2023]'}>去广告 看完整视频</span>
        </div>
        <Button className={'h-12 w-26 rounded-[10px] bg-[#1D2023] flex items-center justify-center'} onClick={onClick}>
          <span className={'text-[#D1AC7D] text-[15px] font-semibold'}>立即解锁</span>
        </Button>
      </div>
    </div>
  )
}
