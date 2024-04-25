import Image from 'next/image';
import {ArrowRigthGrey} from '@/asset/icons';
import React from 'react';

export default function NavCard({icon, title, isSelected, onClick}) {
  return (
    <div className={'bg-[#1D2023] rounded-[12px] mb-[16px]'}>
      <button className={'bg-[#1D2023] rounded-[10px] w-full h-12 flex items-center p-3 gap-3'} onClick={onClick}>
        <div className={'w-[24px] h-[24px] flex items-center justify-center'}>
          <Image src={icon} alt={'Icon'}/>
        </div>
        <span className={'font-semibold text-[15px] leading-[15px] text-[#9C9C9C] flex-1 text-left'}>{title}</span>
        <div className={'w-[30px] h-[30px] flex items-center justify-center'}>
          <Image src={ArrowRigthGrey} alt={'Arrow'} height={16} color={'#9C9C9C'}/>
        </div>
      </button>
    </div>

  )
}
