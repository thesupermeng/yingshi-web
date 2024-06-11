'use client'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { getNewAhaToken } from '@/services/yingshiUser';
import { setAhaToken } from '@/store/yingshiUser';
import { useDispatch } from 'react-redux';
import { updateLocalstorage } from '@/util/YingshiApi';
import { LocalStorageKeys } from '@/config/common';
import { useRouter } from 'next/navigation';
import { setProfileModal, setShowToast } from '@/store/common';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import { useLoginOpen } from '@/hook/yingshiScreenState/useLoginOpen';
import MyFooter3 from '@/components/myFooter3';
import { setIsSessionExpired} from '@/store/yingshiScreen';


export default function Page({ params }) {
  const router = useRouter();
  let redirect = params.slug?.join('/') || 'sports'
  let isRefreshing = false;
  const dispatch = useDispatch()
  const { isVip, userInfo, ahaToken, refreshUserInfo } = useYingshiUser()

  const [openSignInUp, setOpenSignInUp] = useLoginOpen()
  
  const [iframeUrl, setIframeUrl] = useState('');
  const [hideFooter, setHideFooter] = useState(false);

  if (localStorage.getItem('AuthToken') == null || localStorage.getItem('AuthToken' == "") || (userInfo == null)) {
    redirect += "?authToken=aa";
  }
  else
  {
    redirect += "?authToken=" + localStorage.getItem('AuthToken');
  }

  redirect +="&channelCode=100018"

  useLayoutEffect(() => {
    console.log('redirect')
    console.log(redirect)
    setIframeUrl(redirect);
  }, [])

  
  useLayoutEffect(() => {

    if(userInfo)
      {
        console.log('userInfo')
        console.log(userInfo)
        console.log('redirect')
        console.log(redirect)
        setIframeUrl('');
        setIframeUrl(redirect);
      }
  
  }, [userInfo])

  const onRefreshToken = async () => {
    isRefreshing = true
    let res = await getNewAhaToken();
    if (res) {
      dispatch(setAhaToken(res))
      updateLocalstorage(LocalStorageKeys.AhaToken, res)
      isRefreshing = false
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }


  const iframeMessageListener = async (event) => {
   // dispatch(setShowToast(event.data.type));

   if (event.data.type === 'urlChange') {
    
    const newUrl = event.data.newUrl;
    setHideFooter(newUrl.endsWith('/sports/sport'));
    console.log('newUrl')
    console.log(newUrl)
    console.log('sethide ')
    console.log(newUrl.endsWith('/sports/sport'))
    
  }

   if (event.data.type === 'openBottomSheet') {
    setHideFooter(false)
  }
   if (event.data.type === 'closeBottomSheet') {
    setHideFooter(true)
  }


     console.log('iframe message', event.data)
    if (event.data.message === 'iframe' && isRefreshing == false) {
      // console.log('iframe event ')
      if (event.data.type === 'login') {
        console.log('login type ')
       // if (!userInfo) {
          setOpenSignInUp(true)
       // }
        // else
        // {
        //  await refreshUserInfo()
        //  onRefreshToken()
        // }
      } 
      else if (event.data.type === 'invalidToken' && userInfo) {
         console.log('invalid aha token')
        // router.push(`/sport`)
        dispatch(setIsSessionExpired(true))
        router.replace(`/myprofile`)
      }
      else if (event.data.type === 'onTopUp') {
        console.log('onTopUp')
        console.log(event.data.data.data)
        router.push(event.data.data.data.topup_data)
      }
      else if (event.data.type === 'enterPin') {
        console.log('enterPin')
       // router.push('/enterpin')
      }
      else if (event.data.type === 'forgotSecurityPin') {
        console.log('forgotSecurityPin')
        router.push('/setpin')
      }
      else if (event.data.type === 'return') {
        router.push(event.data.url)
      }
     
    }
  }

  useEffect(() => {
    window.addEventListener('message', iframeMessageListener)

    return () => {
      window.removeEventListener('message', iframeMessageListener)
    }
  }, [])

console.log('hiiiiii')
  return (
    <>

{iframeUrl != ''  &&
      <>
        <div className='desktop w-full flex flex-1 flex-col'>
          <iframe
            className={'flex-1'}
            src={`https://iframe-web.aha666.site/${iframeUrl}`}
          />
        </div>
        <div className="mobile w-screen h-full">
          <iframe
            className={'w-full h-full'}
            src={`https://iframe-h5.aha666.site/${iframeUrl}`}
          />
        </div>
      </>
      }
     {hideFooter && (
        <div
          className='fixed bottom-0 w-full bg-[#161616eb] pt-2 pb-[60px]' 
          style={{ backdropFilter: 'blur(3px)' }}
        >
          <MyFooter3 />
        </div>
      )}
    </>
  )
}
