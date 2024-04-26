'use client';
import { backtoTopIcon } from '@/asset/icons';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsScroll } from '@/store/scrollView';

export const ScrollView = ({ children }) => {
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);
  const [showScrollUpButton, setShowScrollUpButton] = useState(false);


  const handleScroll = () => {
    if (scrollableDivRef.current.scrollTop > 200) {
      if (!showScrollUpButton) { // prevent keep updating the state
        dispatch(setIsScroll(true));
        setShowScrollUpButton(true);
      }
    } else {
      if (showScrollUpButton) {
        dispatch(setIsScroll(false));
        setShowScrollUpButton(false);
      }
    }
  };

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
      className='flex-1 overflow-y-scroll overflow-x-hidden overscroll-none flex flex-col md:pb-0 pb-[55px]'
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
