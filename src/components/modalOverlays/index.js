'use client'

import 'react-spring-bottom-sheet/dist/style.css'
import YingshiLoginBottomSheet from '@/componentsH5/yingshiLoginBottomSheet';
import {useLoginOpen} from '@/hook/yingshiScreenState/useLoginOpen';
import LoginSuccess from '@/components/login/loginSuccess';
import {useLoginSuccessOpen} from '@/hook/yingshiScreenState/useLoginSuccessOpen';
import {useEffect, useLayoutEffect, useState} from 'react';
import LoginFlow from '@/components/login/loginFlow';

export default function ModalOverlays() {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const [isOpenLogin, setIsOpenLogin] = useLoginOpen();
  const [isLoginSuccess, setIsLoginSuccess] = useLoginSuccessOpen()

  return (
    <>
      {isMobile &&
        <YingshiLoginBottomSheet
        visible={isOpenLogin}
        onDismiss={() => setIsOpenLogin(false)}
      />
      }
      {!isMobile &&
        <LoginFlow/>
      }
      <LoginSuccess
        open={isLoginSuccess}
        handler={() => setIsLoginSuccess(false)}
        msg={'登录成功'}
      />
    </>
  )

}
