'use client';
import { backtoTopIcon } from '@/asset/icons';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsScroll, setIsTop } from '@/store/scrollView';

const getIsTop = (state) => state.isTop;
const getIsScroll = (state) => state.isScroll;

export const ScrollView = ({ children }) => {
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);
  const [showScrollUpButton, setShowScrollUpButton] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const isAtTop = useSelector(getIsTop);
  const isScrolling = useSelector(getIsScroll);

  const handleScroll = () => {
    // Clear the previous timer
    if (timerId != null) {
      clearTimeout(timerId);
      setTimerId(null);
    }

    // Set isScrolling to true
    if (!isScrolling.res) {
      dispatch(setIsScroll(true));
      console.log('get');
    }

    // Store the current scroll position
    const currentScrollPosition = scrollableDivRef.current.scrollTop;

    // Check if the scroll position has changed since the last event
    if (currentScrollPosition !== lastScrollPosition) {
      console.log('test1');
      setLastScrollPosition(currentScrollPosition);
      // Start a new timer to check if scrolling has stopped after 200ms
      const id = setTimeout(() => {
        console.log('test2');
        if (isScrolling.res) {
          dispatch(setIsScroll(false));
          console.log('delete');
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
