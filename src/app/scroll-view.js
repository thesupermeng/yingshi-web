'use client';
import { backtoTopIcon } from '@/asset/icons';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsScroll, setIsTop } from '@/store/scrollView';

export const ScrollView = ({ children }) => {
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);
  const [showScrollUpButton, setShowScrollUpButton] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const handleScroll = () => {
    if (scrollableDivRef.current.scrollTop > 0) {
      dispatch(setIsTop(false));
    } else {
      dispatch(setIsTop(true));
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

  useEffect(() => {
    let scrollTimer;

    const handleScrolling = () => {
      // Clear the previous timer
      clearTimeout(scrollTimer);
      // Set isScrolling to true
      dispatch(setIsScroll(true));
      // Store the current scroll position
      const currentScrollPosition = scrollableDivRef.current.scrollTop;
      // Check if the scroll position has changed since the last event
      if (currentScrollPosition !== lastScrollPosition) {
        setLastScrollPosition(currentScrollPosition);
        // Start a new timer to check if scrolling has stopped after 200ms
        scrollTimer = setTimeout(() => {
          dispatch(setIsScroll(false));
        }, 200);
      }
    };

    // Attach scroll event listener to the div
    scrollableDivRef.current.addEventListener('scroll', handleScrolling);

    // Clean up event listener on component unmount
    return () => {
      scrollableDivRef.current.removeEventListener('scroll', handleScrolling);
    };
  }, [lastScrollPosition]);

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
