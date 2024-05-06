'use client'

import styles from './style.module.css'
import PaymentHeader from '@/componentsH5/payment/paymentHeader';
import PaymentCountdown from '@/componentsH5/payment/paymentCountdown';
import PaymentProductsList from '@/componentsH5/payment/paymentProductsList';
import {Button} from '@material-tailwind/react';
import PaymentPurchaseButton from '@/componentsH5/payment/paymentPurchaseButton';
import PaymentDisclaimer from '@/componentsH5/payment/paymentDisclaimer';
import PaymentMethods from '@/componentsH5/payment/paymentMethods';
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {useRouter, useSearchParams} from 'next/navigation';
import {getTransactionDetail, getYingshiProducts} from '@/services/yingshiPayment';
import PaymentStatusModal from '@/componentsH5/payment/paymentStatusModal';

export default function H5Page() {
  const router = useRouter()
  const [productSelected, setProductSelected] = useState(null)
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(null)

  const [productList, setProductList] = useState([])
  const [openPaymentStatus, setOpenPaymentStatus] = useState(false);

  const queryParams = useSearchParams();
  const transactionId = queryParams.get('transactionId')
  const [transactionResponse, setTransactionResponse] = useState(null)

  useEffect(() => {
    if (transactionId){
      setOpenPaymentStatus(true)
      getTransactionDetail(transactionId).then(res => {
        setTransactionResponse(res)
      })
    }
  }, [transactionId])

  useEffect(() => {
    getYingshiProducts().then((res) => {
      setProductList(res['4_fang_items'])
    })
  }, [])

  return (
    <div className={'relative w-full'}>
      {/* background */}
      <div className={'w-full'}>
        <div className={'relative bg-[#14161A]'}>
          <video
            src={'./video/vip_background.mp4'}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className={'w-full h-full object-cover pb-1'}
          />
          <div
            className={styles.gradient_overlay + ' absolute top-0 left-0 w-full h-full'}
          />
        </div>
      </div>
      {/* content */}
      <div className={'flex flex-col items-center absolute top-0 left-0 w-full px-[29px] pb-[55px]'}>
        <FontAwesomeIcon icon={faTimes} style={{
          color:'white',
          width: '30px',
          height: '30px',
          position: 'absolute',
          top: '20px',
          left: '20px'
        }} onClick={()=> router.back()}/>
        <PaymentHeader className={'pt-[100px]'}/>
        <PaymentCountdown className={'mt-[21px] self-start'}/>
        <PaymentProductsList className={'mt-[20px]'} productList={productList} onProductSelect={(product) => setProductSelected(product)}/>
        <PaymentMethods className={'mt-[26px]'} paymentOptions={productSelected?.payment_options ?? []} onMethodSelect={(method) => setPaymentMethodSelected(method)}/>
        <PaymentDisclaimer className={'mt-[30px]'}/>
        <PaymentPurchaseButton className={'mt-[15px]'} productInfo={productSelected} paymentInfo={paymentMethodSelected}/>
      </div>

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
    </div>
  )
}
