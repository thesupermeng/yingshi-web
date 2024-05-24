import {useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {getTransactionDetail} from '@/services/yingshiPayment';
import PaymentStatusModal from '@/componentsH5/payment/paymentStatusModal';
import CryptoJS from 'crypto-js';
import {setPendingTransactionId, setPendingTransactionTry} from '@/store/yingshiScreen';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import { useDispatch, useSelector } from 'react-redux';


export default function WebPage() {
  const router = useRouter()
  const queryParams = useSearchParams();
  const transactionId = queryParams.get('transactionId')
  const dispatch = useDispatch();

  const [openPaymentStatus, setOpenPaymentStatus] = useState(false);
  const [transactionResponse, setTransactionResponse] = useState(null)
  const { userInfo } = useYingshiUser()
  let  callOnce = false;
  useEffect(() => {
    if (transactionId) {



      setOpenPaymentStatus(true)
      getTransactionDetail(transactionId).then(res => {
   
        setTransactionResponse(res)
      })
    }
  }, [transactionId])

    const [isShowPaymentPending, setShowPaymentPending] = usePaymentPendingOpen()

    // const handleTikTokPixel = (purchaseData) => {
    //   dispatch(setPendingTransactionTry(50));
    //   dispatch(setPendingTransactionObj(purchaseData));
    //   dispatch(setPendingTransactionId(transactionId));
    //   return;
    // };

  return (
    <>
      {transactionId &&
        transactionResponse &&
        <PaymentStatusModal
          open={openPaymentStatus}
          handler={() => {
            setOpenPaymentStatus(x => !x)
            router.push('/myprofile')
          }}
          transactionDetail={transactionResponse}
        />
      }
    </>
  )

}
