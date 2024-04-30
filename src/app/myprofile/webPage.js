import VipCard from '@/components/myprofile/VipCard';
import {
  FeedbackIconBlue,
  FeedbackIconGrey, HistoryIconBlue,
  HistoryIconGrey, LogoutBlue,
  LogoutGrey, PersonIconBlue,
  PersonIconGrey,
} from '@/asset/icons';
import NavCard from '@/components/myprofile/NavCard';
import React, {useEffect, useState} from 'react';
import ProfileCard from '@/components/myprofile/ProfileCard';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import {usePathname, useRouter} from 'next/navigation';
import {logout} from '@/services/yingshiUser';
import {useDispatch} from 'react-redux';
import {setYingshiUserInfo, setYingshiUserToken} from '@/store/yingshiUser';
import LogoutModal from '@/components/login/logoutModal';
import {LocalStorageKeys} from '@/config/common';

export default function WebPage ({subMenus}) {

  const dispatch = useDispatch();
  const {isVip, userInfo, token} = useYingshiUser()
  const router = useRouter();
  const pathname = usePathname();
  const [openLogout, setOpenLogout] = useState(false)

  const handleLogout = () => {
    setOpenLogout(x => !x)
  }

  const navs = [
    {
      title: '个人中心',
      icon: PersonIconGrey,
      iconSelected: PersonIconBlue,
      onClick: () => {},
      platform: 'web',
      href:'/myprofile/userCenter'
    },
    {
      title: '播放历史',
      icon: HistoryIconGrey,
      iconSelected: HistoryIconBlue,
      onClick: () => {},
      platform: 'web',
      href:'/myprofile/watchHistory'
    },
    {
      title: '我要反馈',
      icon: FeedbackIconGrey,
      iconSelected: FeedbackIconBlue,
      onClick: () => {},
      platform: 'web',
      href:'/myprofile/feedback'
    },
    {
      title: '登出',
      icon: LogoutGrey,
      iconSelected: LogoutBlue,
      onClick: () => {
        setOpenLogout(true)
      },
      platform: 'web',
      // href:'/myprofile/logout'
    },
  ]

  useEffect(() => {
    const localStorageToken = localStorage.getItem(LocalStorageKeys.AuthToken)

    if (!token && !localStorageToken) {
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
          return <NavCard key={index} {...nav} isSelected={pathname === nav.href}/>
        })
        }
      </div>
      <div className={'col-span-3 w-full flex flex-col gap-[15px] items-center px-[60px]'}>
        {subMenus}
      </div>
      <LogoutModal
        open={openLogout}
        handler={handleLogout}
        onConfirm={() => {
          logout()
          dispatch(setYingshiUserToken(null))
          dispatch(setYingshiUserInfo(null))
          router.push('/')
        }}
        onCancel={()=> setOpenLogout(false)}
      />
    </div>
  )
}
