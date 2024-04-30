import Image from 'next/image';
import {ArrowRightBlue, ArrowRigthGrey} from '@/asset/icons';
import React from 'react';
import {Button} from '@material-tailwind/react';
import Link from 'next/link';

export default function NavCard({icon, iconSelected, title, isSelected, onClick, href}) {
  return (
    <WithLink href={href}>
      <div className={'bg-[#1D2023] rounded-[12px]'}>
        <Button className={`${isSelected ? 'bg-[#0085E00D]' :'bg-[#1D2023]'} rounded-[10px] w-full h-12 flex items-center p-3 gap-3`} onClick={onClick}>
          <div className={'w-[24px] h-[24px] flex items-center justify-center'}>
            <Image src={isSelected ? iconSelected : icon} alt={'Icon'}/>
          </div>
          <span className={`font-semibold text-[15px] leading-[15px] ${isSelected ? 'text-[#0085E0]': 'text-[#9C9C9C]'} flex-1 text-left`}>{title}</span>
          <div className={'w-[30px] h-[30px] flex items-center justify-center'}>
            <Image src={isSelected ? ArrowRightBlue: ArrowRigthGrey} alt={'Arrow'} height={16}/>
          </div>
        </Button>
      </div>
    </WithLink>

    )
}

function WithLink({href, children}) {
  return href ?
    <Link href={href}>
      {children}
    </Link>
    :
    children
}
