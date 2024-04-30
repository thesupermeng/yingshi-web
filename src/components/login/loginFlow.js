import LoginModal from '@/components/login/index';
import OtpModal from '@/components/login/otpModal';
import NicknameModal from '@/components/login/nicknameModal';
import LoginSuccess from '@/components/login/loginSuccess';
import {forwardRef, useImperativeHandle, useState} from 'react';
import {useRouter} from 'next/navigation';

const LoginFlow = forwardRef(function LoginFlow(props, ref) {
  const [openLogin, setOpenLogin] = useState(false);
  const [openOTP, setOpenOTP] = useState(false);
  const [openLoginSuccess, setOpenLoginSuccess] = useState(false);
  const [openNickname, setOpenNickname] = useState(false);
  const router = useRouter();

  const handleOpenLogin = () => {
    setOpenLogin(x => !x);
  }

  const handleOpenOTP = () => {
    setOpenOTP(x => !x);
  }

  const handleOpenLoginSuccess = () => {
    setOpenLoginSuccess(x => !x);
  }

  const handleOpenNickname = () => {
    setOpenNickname(x => !x);
  }

  useImperativeHandle(ref, () => ({
    start: ()=> setOpenLogin(true)
  }))

  return (
    <>
      <LoginModal
        open={openLogin}
        handler={handleOpenLogin}
        onRegsiter={() => {
          setOpenLogin(false)
          setOpenOTP(true)
        }}
      />
      <OtpModal
        open={openOTP}
        handler={handleOpenOTP}
        onLogin={() => {
          setOpenOTP(false)
          setOpenLoginSuccess(true)
          setTimeout(() => {
            setOpenLoginSuccess(false)
          }, 2000)
        }}
        onRegister={() => {
          setOpenOTP(false)
          setOpenNickname(true)
        }}
      />
      <NicknameModal
        open={openNickname}
        handler={handleOpenNickname}
        onSuccess={() => {
          setOpenNickname(false)
          setOpenLoginSuccess(true)
          setTimeout(() => {
            setOpenLoginSuccess(false)
            router.refresh()
          }, 2000)
        }}
      />
      <LoginSuccess
        open={openLoginSuccess}
        handler={handleOpenLoginSuccess}
        msg={'登录成功'}
      />
    </>
  )
}
)

export default LoginFlow;
