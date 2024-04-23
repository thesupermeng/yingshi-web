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
} from '@/asset/icons';
import { BottomSheet } from 'react-spring-bottom-sheet';

import 'react-spring-bottom-sheet/dist/style.css'
import {loginRequestEmailOtp} from '@/services/yingshiUser';
import YingshiLoginBottomSheet from '@/componentsH5/yingshiLoginBottomSheet';


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
  const [signIn, setSignIn] = useState(false);

  // router.push(`/`);

  return (
    <div>
      <div className='desktop' style={{ paddingTop: '100px', minHeight: '80vh' }}>
        WEB
      </div>
      <div className='mobile w-screen p-4'>
        <YingshiLoginBottomSheet
          visible={openSignInUp}
          onDismiss={() => setOpenSignInUp(false)}
        />
        <div style={{ background: '#1D2023', borderRadius: '12px' }} onClick={() => {
          if(!signIn){
            setOpenSignInUp(true);
          }
        }}>
          <div className='grid grid-cols-12 px-2'>
            <div className='col-span-2 flex justify-center'>
              <Image
                src={profileIcon}
                alt='profile'
              />
            </div>
            <div className='col-span-8 text-xs' style={{ margin: 'auto', marginLeft: '0px', padding: '0.8rem 1rem 0.8rem 0rem' }}>
              <div style={{ display: 'flex' }}>
                <div className='text-bold text-lg' style={{ width: 'wrap-content' }}>贝贝</div>
                <Image
                  src={vipProfileIcon}
                  alt='profile'
                />
              </div>
              <p style={{ color: '#D1AC7D' }}>VIP会员有效日期至2023年9月19日</p>
            </div>
            <div className='col-span-2'>
              <Image
                src={editIcon}
                alt='edit'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
