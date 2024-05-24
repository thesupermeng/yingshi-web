'use client';
import { backtoTopIcon } from '@/asset/icons';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionDetail, getYingshiProducts } from '@/services/yingshiPayment';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import {
  setIsScroll,
  setIsTop,
  setCurrentScrollPosition,
} from '@/store/scrollView';

const getIsTop = (state) => state.isTop;
const getIsScroll = (state) => state.isScroll;
import { setPendingTransactionId , setPendingTransactionTry} from '@/store/yingshiScreen';


export const ScrollView = ({ children }) => {

  const { userInfo } = useYingshiUser()
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);
  const [showScrollUpButton, setShowScrollUpButton] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const isAtTop = useSelector(getIsTop);
  const isScrolling = useSelector(getIsScroll);


  // 1111111 
  const getPendingTransactionId = (state) => state.yingshiScreen.pendingTransactionId;
  const getPendingTransactionTry = (state) => state.yingshiScreen.pendingTransactionTry;

  const pendingTransactionId = useSelector(getPendingTransactionId);
  const pendingTransactionTry = useSelector(getPendingTransactionTry);

  
  const getTransStatus = () =>{
console.log('getTransStatus')
     let transactionId = pendingTransactionId;
    getTransactionDetail(transactionId).then(res => {
      if (res?.data?.transaction_status_string === 'COMPLETED') {
        dispatch(setPendingTransactionTry(0));
        dispatch(setPendingTransactionId(''));
        
        handleTikTokPixel(res);
      }
    })

  }


  useEffect(() => {
    // Function to be executed every 30 seconds
    const fetchData = () => {
        // Replace this with your logic
        console.log('Fetching data...');
        console.log('isLoginSuccessOpen')
        console.log(pendingTransactionId)
        console.log('isLoginSuccessOpen')
        console.log(pendingTransactionTry)
  

        if(pendingTransactionTry > 0 && pendingTransactionId !='' )
          {
            dispatch(setPendingTransactionTry(pendingTransactionTry - 1));
            getTransStatus();
          }

        // Example: setData(newData);
    };

    // Set the interval
    const intervalId = setInterval(fetchData, 2000); //30000

    // Fetch data immediately on mount
    fetchData();

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
}, [pendingTransactionId , pendingTransactionTry ]); // Empty dependency array ensures this runs only on mount and unmount



const handleTikTokPixel = () => {

          const purchaseData = {
            email: userInfo?.user_email, // Replace with actual data
            phoneNumber: userInfo?.user_phone, // Replace with actual data
            uniqueID: userInfo?.user_id, // Replace with actual data
            productName: res?.data?.product_name, // Replace with actual data
            productPrice: res?.data?.product_price, // Replace with actual data
            currency: 'CNY' // Use CNY for Chinese Yuan
          };  
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



  const handleScroll = () => {
    // Clear the previous timer
    if (timerId != null) {
      clearTimeout(timerId);
      setTimerId(null);
    }

    // Set isScrolling to true
    if (!isScrolling.res) {
      dispatch(setIsScroll(true));
    }

    // Store the current scroll position
    const currentScrollPosition = scrollableDivRef.current.scrollTop;

    dispatch(setCurrentScrollPosition(currentScrollPosition));

    // Check if the scroll position has changed since the last event
    if (currentScrollPosition !== lastScrollPosition) {
      setLastScrollPosition(currentScrollPosition);
      // Start a new timer to check if scrolling has stopped after 200ms
      const id = setTimeout(() => {
        if (isScrolling.res) {
          dispatch(setIsScroll(false));
        }
      }, 200);
      setTimerId(id);
    }

    if (scrollableDivRef.current.scrollTop > 200) {
      if (!showScrollUpButton) {
        // prevent keep updating the state
        setShowScrollUpButton(true);
      }
    } else {
      if (showScrollUpButton) {
        setShowScrollUpButton(false);
      }
    }
  };

  useEffect(() => {
    if (isScrolling.res) {
      if (scrollableDivRef.current.scrollTop > 0) {
        if (isAtTop.res) {
          dispatch(setIsTop(false));
        }
      }
    } else {
      if (scrollableDivRef.current.scrollTop == 0) {
        if (!isAtTop.res) {
          dispatch(setIsTop(true));
        }
      }
    }
  }, [isScrolling]);

  const scrollToTop = () => {
    const scrollableDiv = scrollableDivRef.current;
    const scrollStep = -scrollableDiv.scrollTop / 20;
    const scrollInterval = setInterval(() => {
      if (scrollableDiv.scrollTop !== 0) {
        scrollableDiv.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  return (
    <div
      className='flex-1 overflow-y-scroll overflow-x-hidden overscroll-none flex flex-col md:pb-0 pb-[55px] no-scrollbar'
      style={{ alignItems: 'center' }}
      ref={scrollableDivRef}
      onScroll={handleScroll}
    >
      {/* Render the passed container */}
      {children}
      {showScrollUpButton && (
        <button
          className='absolute bottom-16 right-16 rounded-md z-20 bg-[#2c313ae6] desktop'
          onClick={scrollToTop}
        >
          <Image src={backtoTopIcon} alt='arrowUp' width={50} />
        </button>
      )}
    </div>
  );
};
