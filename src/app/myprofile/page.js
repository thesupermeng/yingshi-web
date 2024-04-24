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
import { BottomSheet } from 'react-spring-bottom-sheet';

import 'react-spring-bottom-sheet/dist/style.css'
import {loginRequestEmailOtp} from '@/services/yingshiUser';
import YingshiLoginBottomSheet from '@/componentsH5/yingshiLoginBottomSheet';
import {TickAnimation} from '@/asset/gif';
import {useDispatch, useSelector} from 'react-redux';
import {setYingshiUserLoginParam} from '@/store/yingshiUser';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import {formatDateCN} from '@/util/date';
import {Card} from '@material-tailwind/react';


// import styles from './style.module.css';

export default function Page({ params }) {
  // const [isLoading, setIsLoading] = useState(true);
  // const [topicList, setTopicList] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [stillCanLoad, setStillCanLoad] = useState(true);
  // let totalPage = 0
  // let loading = false;

  // const router = useRouter()
  const [openSignInUp, setOpenSignInUp] = useState(false);
  const [openLoginSuccess, setOpenLoginSuccess] = useState(false);

  const {isVip, userInfo} = useYingshiUser()

  const dispatch = useDispatch()
  const getLoginParam = (s) => s.yingshiUser.loginParam
  const loginParam = useSelector(getLoginParam)

  useEffect(() => {
    if (loginParam && loginParam.success){
      setOpenLoginSuccess(true)

      setTimeout(() => {
        setOpenLoginSuccess(false)
        dispatch(setYingshiUserLoginParam(null))
      }, 2000)
    }
  }, [loginParam])

  return (
    <div>
      <div className='desktop' style={{ paddingTop: '100px', minHeight: '80vh' }}>
        WEB
      </div>
      <div className="mobile w-screen p-4">
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
        <div style={{background: '#1D2023', borderRadius: '12px', marginBottom:'16px'}}>
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
              <div className={'flex h-[58px] bg-[#D1AC7D] rounded-lg p-1.5 items-center gap-2'}>
                <div className={'w-12 h-12 flex justify-center items-center'}>
                  <Image src={VipBlackIcon} alt={'VIP icon'}/>
                </div>
                <div className={'flex flex-col flex-1'}>
                  <span className={'text-[15px] text-[#1D2023] font-semibold'}>成为VIP</span>
                  <span className={'text-[13px] text-[#1D2023]'}>去广告 看完整视频</span>
                </div>
                <div className={'h-12 w-24 rounded-[10px] bg-[#1D2023] flex items-center justify-center'}>
                  <span className={'text-[#D1AC7D] text-[15px] font-semibold'}>立即解锁</span>
                </div>
              </div>
            </div>
          </div>
        </div>
         {/*aha iframe */}
        <div style={{background: '#1D2023', borderRadius: '12px', marginBottom:'16px'}}>
          <iframe
            className={'h-[74px] w-full'}
            src={'https://iframe-m.ggsimida.com/wallet'}
          />
        </div>

        {/* 我的收藏 */}
        <div style={{background: '#1D2023', borderRadius: '12px', marginBottom:'16px'}}>
          <PageCard title={'我的收藏'} icon={FavouriteIconGrey}/>
        </div>
        {/* 播放历史 */}
        <div style={{background: '#1D2023', borderRadius: '12px', marginBottom:'16px'}}>
          <PageCard title={'播放历史'} icon={HistoryIconGrey}/>
        </div>
        {/* 我要反馈 */}
        <div style={{background: '#1D2023', borderRadius: '12px', marginBottom:'16px'}}>
          <PageCard title={'我要反馈'} icon={FeedbackIconGrey}/>
        </div>
        {/* 关于我们 */}
        <div style={{background: '#1D2023', borderRadius: '12px', marginBottom:'16px'}}>
          <PageCard title={'关于我们'} icon={AboutusIconGrey}/>
        </div>
      </div>
    </div>
  );
}

function PageCard({icon, title}) {
  return (
    <button className={'bg-[#1D2023] rounded-[10px] w-full h-12 flex items-center p-3 gap-3'}>
      <div className={'w-[24px] h-[24px] flex items-center justify-center'}>
        <Image src={icon} alt={'Icon'}/>
      </div>
      <span className={'font-semibold text-[15px] leading-[15px] text-[#9C9C9C] flex-1 text-left'}>{title}</span>
      <div className={'w-[30px] h-[30px] flex items-center justify-center'}>
        <Image src={ArrowRigthGrey} alt={'Arrow'} height={16} color={'#9C9C9C'} />
      </div>

    </button>
  )
}
