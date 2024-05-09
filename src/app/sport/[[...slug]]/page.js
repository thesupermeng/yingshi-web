'use client'
import React, {useEffect} from 'react';
import {getNewAhaToken} from '@/services/yingshiUser';
import {setAhaToken} from '@/store/yingshiUser';
import {useDispatch} from 'react-redux';
import {updateLocalstorage} from '@/util/YingshiApi';
import {LocalStorageKeys} from '@/config/common';

export default function Page ({params}) {

  const redirect = params.slug?.join('/') || 'sports'

  const dispatch = useDispatch()

  const iframeMessageListener = (event) => {
    if (event.data.message === 'iframe') {
      if (event.data.type === 'login') {
        getNewAhaToken()
          .then(res => {
            if (res.code === 0){
              dispatch(setAhaToken(res.data.token))
              updateLocalstorage(LocalStorageKeys.AhaToken, res)
            }
          })
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
