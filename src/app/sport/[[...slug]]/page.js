'use client'
import React, { useEffect } from 'react';
import { getNewAhaToken } from '@/services/yingshiUser';
import { setAhaToken } from '@/store/yingshiUser';
import { useDispatch } from 'react-redux';
import { updateLocalstorage } from '@/util/YingshiApi';
import { LocalStorageKeys } from '@/config/common';

export default function Page({ params }) {

  let redirect = params.slug?.join('/') || 'sports'
  let isRefreshing = false;
  const dispatch = useDispatch()

  if (localStorage.getItem('AuthToken') == null || localStorage.getItem('AuthToken' == "")) {
    redirect += "?authToken=aa";
  }

  const iframeMessageListener = async (event) => {
    // console.log('iframe message', event.data)
    if (event.data.message === 'iframe' && isRefreshing == false) {
      // console.log('iframe event ')
      if (event.data.type === 'login') {
        console.log('login type ')
        isRefreshing = true
        let res = await getNewAhaToken();
        if (res) {
          dispatch(setAhaToken(res))
          updateLocalstorage(LocalStorageKeys.AhaToken, res)
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        isRefreshing = false
      } else if (event.data.type === 'invalidToken') {

        console.log('invalid aha token')
        isRefreshing = true
        let res = await getNewAhaToken();
        if (res) {
          dispatch(setAhaToken(res))
          updateLocalstorage(LocalStorageKeys.AhaToken, res)
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        isRefreshing = false
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
    <>

      {!isRefreshing &&
        (
          <>
            <div className='desktop w-full flex flex-1 flex-col'>
              <iframe
                className={'flex-1'}
                src={`https://iframe-web.aha666.site/${redirect}`}
              />
            </div>
            <div className="mobile w-screen h-full">
              <iframe
                className={'w-full h-full'}
                src={`https://iframe-h5.aha666.site/${redirect}`}
              />
            </div>
          </>
        )
      }
    </>
  )
}
