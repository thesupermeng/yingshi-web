import {useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {getTransactionDetail} from '@/services/yingshiPayment';
import PaymentStatusModal from '@/componentsH5/payment/paymentStatusModal';
import CryptoJS from 'crypto-js';

import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';

export default function WebPage() {
  const router = useRouter()
  const queryParams = useSearchParams();
  const transactionId = queryParams.get('transactionId')


  const [openPaymentStatus, setOpenPaymentStatus] = useState(false);
  const [transactionResponse, setTransactionResponse] = useState(null)
  const { userInfo } = useYingshiUser()
  let  callOnce = false;
  useEffect(() => {
    if (transactionId) {
      setOpenPaymentStatus(true)
      getTransactionDetail(transactionId).then(res => {
        if (res?.data?.transaction_status_string === 'COMPLETED' || res?.data?.transaction_status_string === 'IN_PROGRESS') {
          const purchaseData = {
            email: userInfo?.user_email, // Replace with actual data
            phoneNumber: userInfo?.user_phone, // Replace with actual data
            uniqueID: userInfo?.user_id, // Replace with actual data
            productName: res?.data?.product_name, // Replace with actual data
            productPrice: res?.data?.product_price, // Replace with actual data
            currency: 'CNY' // Use CNY for Chinese Yuan
          };
          if(callOnce == true)
            {
              return;
            }
          callOnce = true;
          handleTikTokPixel(purchaseData);
        }
        setTransactionResponse(res)
      })
    }
  }, [transactionId])


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
