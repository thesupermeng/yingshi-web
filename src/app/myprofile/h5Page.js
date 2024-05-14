'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {AboutusIconGrey, FavouriteIconGrey, FeedbackIconGrey, HistoryIconGrey, LogoutGrey} from '@/asset/icons';

import {getNewAhaToken, logout} from '@/services/yingshiUser';
import {TickAnimation} from '@/asset/gif';
import {useDispatch, useSelector} from 'react-redux';
import {setAhaToken, setYingshiUserInfo, setYingshiUserLoginParam, setYingshiUserToken} from '@/store/yingshiUser';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import NavCard from '@/components/myprofile/NavCard';
import VipCard from '@/components/myprofile/VipCard';
import ProfileCard from '@/components/myprofile/ProfileCard';
import LogoutModal from '@/components/login/logoutModal';
import {useRouter} from 'next/navigation';
import {updateLocalstorage} from '@/util/YingshiApi';
import {LocalStorageKeys} from '@/config/common';
import {useLoginOpen} from '@/hook/yingshiScreenState/useLoginOpen';
import {Button, Dialog, DialogBody} from '@material-tailwind/react';

export default function H5Page({params}) {
  const router = useRouter();

  const navs = [
    // {
    //   title: '我的收藏',
    //   icon: FavouriteIconGrey,
    //   onClick: () => {},
    //   isSelected: false,
    //   platform: 'mobile',
    //   isRequireLogin: false
    //
    // },
    {
      title: '播放历史',
      icon: HistoryIconGrey,
      onClick: () => {},
      isSelected: false,
      platform: 'mobile',
      isRequireLogin: false,
      href: '/myprofile/watchHistory'
    },
    {
      title: '我要反馈',
      icon: FeedbackIconGrey,
      onClick: () => {},
      isSelected: false,
      platform: 'mobile',
      isRequireLogin: false,
      href: '/myprofile/feedback'

    },
    {
      title: '关于我们',
      icon: AboutusIconGrey,
      onClick: () => {
        setOpenAboutus(true)
      },
      isSelected: false,
      platform: 'mobile',
      isRequireLogin: false
    },
    {
      title: '登出',
      icon: LogoutGrey,
      onClick: () => {
        setOpenLogoutConfirmation(true)
      },
      isSelected: false,
      platform: 'mobile',
      isRequireLogin: true
    },
  ]


  const [openSignInUp, setOpenSignInUp] = useLoginOpen()
  const [openLoginSuccess, setOpenLoginSuccess] = useState(false);
  const [openLogoutConfirmation, setOpenLogoutConfirmation] = useState(false);

  const {isVip, userInfo, ahaToken} = useYingshiUser()

  const dispatch = useDispatch()
  const getLoginParam = (s) => s.yingshiUser.loginParam
  const loginParam = useSelector(getLoginParam)


  // temp
  const [openAboutus , setOpenAboutus] = useState(false)

  const aboutusHandler = () => {
    setOpenAboutus(x => !x)
  }

  const handleClickEmail = () => {
    window.location = 'mailto:shayuyingshi@gmail.com'
  }

  // temp end

  useEffect(() => {
    if (loginParam && loginParam.success) {
      setOpenLoginSuccess(true)

      setTimeout(() => {
        setOpenLoginSuccess(false)
        dispatch(setYingshiUserLoginParam(null))
      }, 2000)
    }
  }, [loginParam])

  const handleOnClickVip = () => {
    console.log('testing', userInfo)
    if (!userInfo) {
      setOpenSignInUp(true)
    } else {
      router.push('/payment')
    }
  }

  const iframeMessageListener = (event) => {
    // console.log('iframe message', event.data)
    if (event.data.message === 'iframe') {
      if (event.data.type === 'login') {
        getNewAhaToken()
          .then(res => {
            if (res){
              dispatch(setAhaToken(res))
              updateLocalstorage(LocalStorageKeys.AhaToken, res)
            }
          })
      } else {
        router.push(`/sport/${event.data.url}`)
      }

    }
  }

  useEffect(() => {
    window.addEventListener('message', iframeMessageListener)

    return () => {
      window.removeEventListener('message', iframeMessageListener)
    }
  }, [])

  return (
    <div>
      {/*{openLoginSuccess &&*/}
      {/*  <div className={'absolute top-0 left-0 flex justify-center items-center w-full h-full'}*/}
      {/*       onClick={() => setOpenSignInUp(false)}>*/}
      {/*    <div*/}
      {/*      className={'w-[270px] h-[195px] rounded-[14px] bg-[#222222CC] flex flex-col items-center justify-center'}>*/}
      {/*      <Image src={TickAnimation} alt={'Login success'} width={95} height={95}/>*/}
      {/*      <span className={'text-[17px]'}>登录成功</span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*}*/}
      <LogoutModal
        open={openLogoutConfirmation}
        handler={() => setOpenLogoutConfirmation(x => !x)}
        onCancel={() => setOpenLogoutConfirmation(false)}
        onConfirm={() => {
          logout()
          dispatch(setYingshiUserInfo(null))
          dispatch(setYingshiUserToken(null))
          dispatch(setAhaToken(null))
          setOpenLogoutConfirmation(false)
        }}
      />
      {/* user profile */}
      <div style={{background: '#1D2023', borderRadius: '12px', marginBottom: '16px'}}>
        <div className="flex flex-col p-[12px] gap-[12px]">
          <div>
            <ProfileCard
              userInfo={userInfo}
              isVip={isVip}
              isH5={true}
              onSignin={() => setOpenSignInUp(true)}
            />
          </div>
          <VipCard onClick={handleOnClickVip}/>
        </div>
      </div>

      {/*aha iframe */}
      {/* {userInfo &&
        <div style={{background: '#1D2023', borderRadius: '12px', marginBottom: '16px'}}>
          <iframe
            className={'h-[74px] w-full rounded-[12px]'}
            src={`https://iframe-h5.aha666.site/user/wallet?authToken=${ahaToken}`}
            scrolling={'no'}
          />
        </div>
      } */}

      <div className={'flex flex-col gap-[16px] pb-[100px]'}>
        {navs
          .filter(x => {
            if (userInfo) { // is logged in
              return true // show all
            } else {
              return x.isRequireLogin === false // show only those that don't require login
            }
          })
          .map((x, idx) => {
            return <NavCard key={idx} {...x} />
          })}
      </div>

      {/* temporary only  */}
      <Dialog open={openAboutus} handler={aboutusHandler} className={'bg-[#121212] rounded-[28px] p-[30px] outline-none'} size={'xs'}>
        <DialogBody className={'p-0 w-full h-full flex flex-col items-center'}>
          <p className={'text-center text-white text-[17px] font-medium mb-[12px]'}>鲨鱼影视</p>
          <p className={'text-[14px] text-white'}>
            如果本站提供内容侵犯了您的版权，请来函说明，本网站将立即删除，保护版权所有者的权益。
          </p>
          <div className={'w-full'}>
            <span className={'text-white text-[14px]'}>联系邮箱：</span>
            <span className={'text-shayuBlue text-[14px]'} onClick={handleClickEmail}>shayuyingshi@gmail.com</span>
          </div>
          <Button className={'text-shayuBlue text-[16px] mt-[12px] outline-none'} color={'blue'} tabIndex={-1} variant={'outlined'} size={'sm'} onClick={() => setOpenAboutus(false)}>确定</Button>
        </DialogBody>
      </Dialog>
      {/* temporary only end  */}

    </div>
  );
}

