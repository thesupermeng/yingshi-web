'use client'

import 'react-spring-bottom-sheet/dist/style.css'
import YingshiLoginBottomSheet from '@/componentsH5/yingshiLoginBottomSheet';
import {useLoginOpen} from '@/hook/yingshiScreenState/useLoginOpen';
import LoginSuccess from '@/components/login/loginSuccess';
import {useLoginSuccessOpen} from '@/hook/yingshiScreenState/useLoginSuccessOpen';

export default function ModalOverlays() {
  const [isOpenLogin, setIsOpenLogin] = useLoginOpen();
  const [isLoginSuccess, setIsLoginSuccess] = useLoginSuccessOpen()

  return (
    <>
      <YingshiLoginBottomSheet
        visible={isOpenLogin}
        onDismiss={() => setIsOpenLogin(false)}
      />
      <LoginSuccess
        open={isLoginSuccess}
        handler={() => setIsLoginSuccess(false)}
        msg={'登录成功'}
      />
    </>
  )

}
