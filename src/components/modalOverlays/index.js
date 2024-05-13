'use client'

import 'react-spring-bottom-sheet/dist/style.css'
import YingshiLoginBottomSheet from '@/componentsH5/yingshiLoginBottomSheet';
import {useLoginOpen} from '@/hook/yingshiScreenState/useLoginOpen';
import PaymentModal from '@/components/payment/paymentModal';
import {usePaymentOpen} from '@/hook/yingshiScreenState/usePaymentOpen';

export default function ModalOverlays() {
  const [isOpenLogin, setIsOpenLogin] = useLoginOpen();
  const [isOpenPayment, setIsOpenPayment] = usePaymentOpen();

  return (
    <>
      {/* login */}
      <YingshiLoginBottomSheet
        visible={isOpenLogin}
        onDismiss={() => setIsOpenLogin(false)}
      />

      {/* VIP payment */}
      <PaymentModal
        open={isOpenPayment}
        handler={() => setIsOpenPayment(false)}
      />
    </>
  )

}
