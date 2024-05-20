'use client'

import 'react-spring-bottom-sheet/dist/style.css'
import YingshiLoginBottomSheet from '@/componentsH5/yingshiLoginBottomSheet';
import {useLoginOpen} from '@/hook/yingshiScreenState/useLoginOpen';
import LoginSuccess from '@/components/login/loginSuccess';
import {useLoginSuccessOpen} from '@/hook/yingshiScreenState/useLoginSuccessOpen';
import {useEffect, useLayoutEffect, useState} from 'react';
import LoginFlow from '@/components/login/loginFlow';
import PaymentModal from '@/components/payment/paymentModal';
import {usePaymentOpen} from '@/hook/yingshiScreenState/usePaymentOpen';
import PaymentPendingModal from '@/components/payment/paymentPendingModal';
import {usePaymentPendingOpen} from '@/hook/yingshiScreenState/usePaymentPendingOpen';

export default function ModalOverlays() {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const [isOpenLogin, setIsOpenLogin] = useLoginOpen();
  const [isLoginSuccess, setIsLoginSuccess] = useLoginSuccessOpen()
  const [isOpenPayment, setIsOpenPayment] = usePaymentOpen();
  const [isShowPaymentPending, setShowPaymentPending] = usePaymentPendingOpen()

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
      {!isMobile &&
        <>
          <PaymentModal
            open={isOpenPayment}
            handler={() => setIsOpenPayment(false)}
          />
          <PaymentPendingModal
            open={isShowPaymentPending}
            handler={() => setShowPaymentPending(false)}
          />
        </>
      }
      <LoginSuccess
        open={isLoginSuccess}
        handler={() => setIsLoginSuccess(false)}
        msg={'登录成功'}
      />
    </>
  )

}
