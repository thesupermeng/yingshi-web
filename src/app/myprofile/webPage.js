import VipCard from '@/components/myprofile/VipCard';
import {
  FeedbackIconGrey,
  HistoryIconGrey,
  LogoutGrey,
  PersonIconGrey,
  profileIcon,
  vipProfileIcon,
} from '@/asset/icons';
import NavCard from '@/components/myprofile/NavCard';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import ProfileCard from '@/components/myprofile/ProfileCard';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import LoginModal from '@/components/login';
import {Button, Popover, PopoverContent, PopoverHandler} from '@material-tailwind/react';
import OtpModal from '@/components/login/otpModal';
import {useRouter} from 'next/navigation';


const navs = [
  {
    title: '个人中心',
    icon: PersonIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'web'
  },
  {
    title: '播放历史',
    icon: HistoryIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'web'
  },
  {
    title: '我要反馈',
    icon: FeedbackIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'web'
  },
  {
    title: '登出',
    icon: LogoutGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'web'
  },
]

export default function WebPage () {

  const [selected, setSelected] = useState(0)
  const {isVip, userInfo, token} = useYingshiUser()
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [token])

  return (
    <div className={'grid grid-cols-4 px-[110px]'}>
      <div className={'w-full flex flex-col gap-[15px] min-w-[300px]'}>
        <div className={'h-[80px] rounded-[12px] bg-[#1A1F24] flex items-center px-[21px] py-[12px]'}>
          <ProfileCard
            userInfo={userInfo}
            isVip={isVip}
            isH5={false}
          />
        </div>
        <VipCard/>
        {navs.map((nav, index) => {
          return <NavCard key={index} {...nav} onClick={() => setSelected(nav.title)}/>
        })
        }
      </div>
      <div className={'col-span-3 w-full flex flex-col gap-[15px] items-center'}>
        {selected}
      </div>
    </div>
  )
}
