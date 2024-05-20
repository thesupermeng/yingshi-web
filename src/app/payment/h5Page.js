  'use client'

  import styles from './style.module.css'
  import PaymentHeader, { PaymentHeaderImage } from '@/componentsH5/payment/paymentHeader';
  import PaymentCountdown from '@/componentsH5/payment/paymentCountdown';
  import PaymentProductsList from '@/componentsH5/payment/paymentProductsList';
  import { Button } from '@material-tailwind/react';
  import PaymentPurchaseButton from '@/componentsH5/payment/paymentPurchaseButton';
  import PaymentDisclaimer from '@/componentsH5/payment/paymentDisclaimer';
  import PaymentMethods from '@/componentsH5/payment/paymentMethods';
  import React, { useEffect, useState } from 'react';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faAngleLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
  import { useRouter, useSearchParams } from 'next/navigation';
  import { getTransactionDetail, getYingshiProducts } from '@/services/yingshiPayment';
  import PaymentStatusModal from '@/componentsH5/payment/paymentStatusModal';
  import { VipBackgroundImage } from '@/asset/image';
  import Image from 'next/image';
  import CryptoJS from 'crypto-js';

  import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';



  export default function H5Page() {
    const router = useRouter()
    const [productSelected, setProductSelected] = useState(null)
    const [paymentMethodSelected, setPaymentMethodSelected] = useState(null)

    const [productList, setProductList] = useState([])
    const [openPaymentStatus, setOpenPaymentStatus] = useState(false);

    const queryParams = useSearchParams();
    const transactionId = queryParams.get('transactionId')
    const [transactionResponse, setTransactionResponse] = useState(null)

    const { userInfo } = useYingshiUser()


    useEffect(() => {
      if (transactionId) {
        setOpenPaymentStatus(true)
        getTransactionDetail(transactionId).then(res => {

          if (res?.data?.transaction_status_string === 'COMPLETED') {
            const purchaseData = {
              email: userInfo?.user_email, // Replace with actual data
              phoneNumber: userInfo?.user_phone, // Replace with actual data
              uniqueID: userInfo?.user_id, // Replace with actual data
              productName: res?.data?.product_name, // Replace with actual data
              productPrice: res?.data?.product_price, // Replace with actual data
              currency: 'CNY' // Use CNY for Chinese Yuan
            };

            handleTikTokPixel(purchaseData);
          }
          setTransactionResponse(res)
        })
      }
    }, [transactionId])



    useEffect(() => {
      getYingshiProducts().then((res) => {
        setProductList(res['4_fang_items'])
      })
    }, [])


    // useEffect(() => {
    //   const purchaseData = {
    //     email: userInfo?.user_email, // Replace with actual data
    //     phoneNumber: userInfo?.user_phone, // Replace with actual data
    //     uniqueID: userInfo?.user_id, // Replace with actual data
    //     productName: '12个月', // Replace with actual data
    //     productPrice: 199, // Replace with actual data
    //     currency: 'CNY' // Use CNY for Chinese Yuan
    //   };
    //   console.log('productSelected')
    //   console.log(productSelected)

    //  handleTikTokPixel(purchaseData);
    // }, [productSelected])


    const handleTikTokPixel = (purchaseData) => {
      if (typeof window.ttq === 'undefined') {
        console.error('TikTok Pixel is not loaded');
        return;
      }
    
      const hashedEmail = purchaseData.email ? CryptoJS.SHA256(purchaseData.email).toString(CryptoJS.enc.Hex) : '';
      const hashedPhoneNumber = (purchaseData.phoneNumber && purchaseData.phoneNumber !== '0')
        ? CryptoJS.SHA256(purchaseData.phoneNumber).toString(CryptoJS.enc.Hex)
        : '';
      const hashedExternalID = purchaseData.uniqueID ? CryptoJS.SHA256(purchaseData.uniqueID).toString(CryptoJS.enc.Hex) : '';
    
      const identifyPayload = {};
      if (hashedEmail) identifyPayload.email = hashedEmail;
      if (hashedPhoneNumber) identifyPayload.phone_number = hashedPhoneNumber;
      if (hashedExternalID) identifyPayload.external_id = hashedExternalID;
    
      // Identify the user
      if (Object.keys(identifyPayload).length > 0) {
        console.log('Identifying user with:', identifyPayload); // Debug log
        window.ttq.identify(identifyPayload);
      }
    
      // Ensure productPrice is a valid number
      const productPrice = parseFloat(purchaseData.productPrice);
      if (isNaN(productPrice) || productPrice < 0) {
        console.error('Invalid product price:', purchaseData.productPrice);
        return;
      }
    
      // Track the CompletePayment event
      console.log('Tracking CompletePayment with:', {
        value: productPrice,
        currency: purchaseData.currency,
        contents: [
          {
            content_id: purchaseData.productName
          }
        ]
      }); // Debug log
      window.ttq.track('CompletePayment', {
        value: productPrice,
        currency: purchaseData.currency,
        contents: [
          {
            content_id: purchaseData.productName
          }
        ]
      });
    };
    

    return (
      <div className={'relative w-full h-full'}>
        {/* background */}
        <div className={'w-full'}>
          <div className={'relative bg-[#14161A]'}>
            {/*<video*/}
            {/*  autoPlay*/}
            {/*  loop*/}
            {/*  muted*/}
            {/*  playsInline*/}
            {/*  controls={false}*/}
            {/*  className={'w-full h-full object-cover pb-1'}*/}
            {/*  poster={'./img/vip_background_fallback.jpg'}*/}
            {/*>*/}
            {/*  <source src={'./video/vip_background.mp4'} type={'video/mp4'}/>*/}
            {/*</video>*/}
            <Image src={VipBackgroundImage} alt={'vip background image'} />
            <div
              className={styles.gradient_overlay + ' absolute top-0 left-0 w-full h-full'}
            />
          </div>
        </div>
        {/* content */}
        <div className={'flex flex-col items-center absolute top-0 left-0 w-full px-[29px] pb-[192px]'}>
          <FontAwesomeIcon icon={faAngleLeft} style={{
            color: 'white',
            width: '30px',
            height: '30px',
            position: 'absolute',
            top: '20px',
            left: '20px'
          }} onClick={() => router.back()} />
          <PaymentHeader className={'pt-[80px]'} />
          {/*<PaymentCountdown className={'mt-[21px] self-start'}/>*/}
          <PaymentProductsList className={'mt-[12px]'} productList={productList.sort((a, b) => a.product_sorting - b.product_sorting)} onProductSelect={(product) => setProductSelected(product)} />
          <PaymentMethods className={'mt-[13px]'} paymentOptions={productSelected?.payment_options ?? []} onMethodSelect={(method) => setPaymentMethodSelected(method)} />
          <div className={'fixed bottom-0 pb-4 bg-black w-full px-[29px]'}>
            <PaymentDisclaimer className={'mt-[15px]'} />
            <PaymentPurchaseButton className={'mt-[15px]'} productInfo={productSelected} paymentInfo={paymentMethodSelected} />
          </div>
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
