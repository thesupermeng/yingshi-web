'use client';
// import Gallery from '@/components/gallery';
// import { StreamerInfo } from '@/components/streamer/StreamerInfo';
// import { URL_USER } from '@/config/url';
// import { UserApi } from '@/util/UserApi';
// import { useTranslation } from 'next-i18next';
// import { LoadingPage } from '@/components/loading';
// import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
// import { isWeb } from '@/util/common';
// import { YingshiApi } from '@/util/YingshiApi';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import { debounce } from 'lodash';
// import { usePathname, useRouter } from 'next/navigation';
// import {Spinner} from './../../components/spinner'
import Image from 'next/image';
import React, {useCallback, useEffect, useState} from 'react';
import {
  profileIcon,
  vipProfileIcon,
  editIcon,
  VipBlackIcon,
  ArrowRightIcon,
  FavouriteIconGrey,
  AboutusIconGrey,
  FeedbackIconGrey,
  HistoryIconGrey,
  ArrowRigthGrey, LogoutGrey,
} from '@/asset/icons';
import {BottomSheet} from 'react-spring-bottom-sheet';

import 'react-spring-bottom-sheet/dist/style.css'
import {loginRequestEmailOtp, logout} from '@/services/yingshiUser';
import YingshiLoginBottomSheet from '@/componentsH5/yingshiLoginBottomSheet';
import {TickAnimation} from '@/asset/gif';
import {useDispatch, useSelector} from 'react-redux';
import {setYingshiUserInfo, setYingshiUserLoginParam} from '@/store/yingshiUser';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import {formatDateCN} from '@/util/date';
import NavCard from '@/components/myprofile/NavCard';
import VipCard from '@/components/myprofile/VipCard';
import ProfileCard from '@/components/myprofile/ProfileCard';
import LoginSuccess from '@/components/login/loginSuccess';
import LogoutModal from '@/components/login/logoutModal';
import {useRouter, useSearchParams} from 'next/navigation';
import PaymentStatusModal from '@/componentsH5/payment/paymentStatusModal';
import {getTransactionDetail} from '@/services/yingshiPayment';

export default function H5Page({params}) {
  const router = useRouter();

  const navs = [
    {
      title: '我的收藏',
      icon: FavouriteIconGrey,
      onClick: () => {},
      isSelected: false,
      platform: 'mobile',
      isRequireLogin: false

    },
    {
      title: '播放历史',
      icon: HistoryIconGrey,
      onClick: () => {},
      isSelected: false,
      platform: 'mobile',
      isRequireLogin: false

    },
    {
      title: '我要反馈',
      icon: FeedbackIconGrey,
      onClick: () => {},
      isSelected: false,
      platform: 'mobile',
      isRequireLogin: false

    },
    {
      title: '关于我们',
      icon: AboutusIconGrey,
      onClick: () => {},
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

  const [openSignInUp, setOpenSignInUp] = useState(false);
  const [openLoginSuccess, setOpenLoginSuccess] = useState(false);
  const [openLogoutConfirmation, setOpenLogoutConfirmation] = useState(false);

  const {isVip, userInfo, token} = useYingshiUser()

  const dispatch = useDispatch()
  const getLoginParam = (s) => s.yingshiUser.loginParam
  const loginParam = useSelector(getLoginParam)

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
    if (!userInfo) {
      setOpenSignInUp(true)
    } else {
      router.push('/payment')
    }
  }


  return (
    <div>

      {openLoginSuccess &&
        <div className={'absolute top-0 left-0 flex justify-center items-center w-full h-full'}
             onClick={() => setOpenSignInUp(false)}>
          <div
            className={'w-[270px] h-[195px] rounded-[14px] bg-[#222222CC] flex flex-col items-center justify-center'}>
            <Image src={TickAnimation} alt={'Login success'} width={95} height={95}/>
            <span className={'text-[17px]'}>登录成功</span>
          </div>
        </div>
      }
      <LogoutModal
        open={openLogoutConfirmation}
        handler={() => setOpenLogoutConfirmation(x => !x)}
        onCancel={() => setOpenLogoutConfirmation(false)}
        onConfirm={() => {
          logout()
          dispatch(setYingshiUserInfo(null))
          setOpenLogoutConfirmation(false)
        }}
      />
      <YingshiLoginBottomSheet
        visible={openSignInUp}
        onDismiss={() => setOpenSignInUp(false)}
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
          {!isVip && <div>
            <VipCard onClick={handleOnClickVip}/>
          </div>}
        </div>
      </div>

      {/*aha iframe */}
      {userInfo &&
        <div style={{background: '#1D2023', borderRadius: '12px', marginBottom: '16px'}}>
          <iframe
            className={'h-[74px] w-full'}
            src={`https://iframe-m.aha888.vip/user/wallet?authToken=${token}`}
            scrolling={'no'}
          />
        </div>
      }

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

    </div>
  );
}

