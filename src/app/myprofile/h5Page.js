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
  ArrowRigthGrey,
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

const navs = [
  {
    title: '我的收藏',
    icon: FavouriteIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'mobile'
  },
  {
    title: '播放历史',
    icon: HistoryIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'mobile'
  },
  {
    title: '我要反馈',
    icon: FeedbackIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'mobile'
  },
  {
    title: '关于我们',
    icon: AboutusIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'mobile'
  },
]

export default function H5Page({params}) {
  const [openSignInUp, setOpenSignInUp] = useState(false);
  const [openLoginSuccess, setOpenLoginSuccess] = useState(false);

  const {isVip, userInfo} = useYingshiUser()

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
      <YingshiLoginBottomSheet
        visible={openSignInUp}
        onDismiss={() => setOpenSignInUp(false)}
      />
      {/* user profile */}
      <div style={{background: '#1D2023', borderRadius: '12px', marginBottom: '16px'}}>
        <div className="grid grid-cols-12 p-2">
          <div className="col-span-2 flex justify-center">
            <Image
              src={profileIcon}
              alt="profile"
              height={50}
            />
          </div>
          <div className="col-span-8 text-xs gap-2.5"
               style={{margin: 'auto', marginLeft: '0px'}}>
            <div className={'flex items-center'}>
              {/*<div className='text-bold text-lg' style={{ width: 'wrap-content' }}>贝贝</div>*/}
              <span className="text-bold text-lg font-semibold">
                  {userInfo ? userInfo.user_name : '游客您好'}
                </span>
              {isVip &&
                <Image
                  src={vipProfileIcon}
                  alt="profile"
                  width={22}
                  height={22}
                />
              }
            </div>
            {/*<p style={{ color: '#D1AC7D' }}>VIP会员有效日期至2023年9月19日</p>*/}
            {userInfo && isVip && <span
              className={'text-[#D1AC7D] text-[13px]'}>VIP会员有效日期至{formatDateCN(userInfo.vip_end_time)}</span>}
            {!userInfo && !isVip && <span className={'text-[14px]'}>登录可享更多服务</span>}
          </div>
          <div className="col-span-2 flex items-center justify-center">
            {userInfo &&
              <Image
                src={editIcon}
                alt="edit"
                onClick={() => {
                  logout()
                  dispatch(setYingshiUserInfo(null))
                }}
              />
            }
            {!userInfo &&
              <button className={'bg-[#0085E0] color-white w-20 h-8 rounded-md border-2 border-[#0085E033] text-sm'}
                      onClick={() => setOpenSignInUp(true)}>
                登录
              </button>

            }
          </div>
          <div className={'col-span-12 mt-3'}>
            <VipCard/>
          </div>
        </div>
      </div>

      {/*aha iframe */}
      <div style={{background: '#1D2023', borderRadius: '12px', marginBottom: '16px'}}>
        <iframe
          className={'h-[74px] w-full'}
          src={'https://iframe-m.ggsimida.com/wallet'}
        />
      </div>

      {navs.map((x, idx) => {
        return <NavCard key={idx} {...x} />
      })}

    </div>
  );
}

