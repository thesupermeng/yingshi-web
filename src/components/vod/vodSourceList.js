import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon, PlaySourceIcon } from '@/asset/icons';

import styles from './style.module.css';
import { useState, useRef, useEffect } from 'react';

export const VodSourceList = ({
  vodSources,
  vodSourceSelected,
  onSelectSource,
}) => {
  const containerRef = useRef(null);
  const selectedItemRef = useRef(null);

  const [disableLeftButton, setDisableLeftButton] = useState(true);
  const [disableRightButton, setDisableRightButton] = useState(true);

  const handleScroll = (scrollOffset) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth - 1;

      const newScrollLeft =
        containerRef.current.scrollLeft + scrollOffset < 0
          ? 0
          : containerRef.current.scrollLeft + scrollOffset > maxScrollLeft
          ? maxScrollLeft
          : containerRef.current.scrollLeft + scrollOffset;

      // console.log(newScrollLeft);
      if (newScrollLeft <= 0) {
        setDisableLeftButton(true);
        setDisableRightButton(false);
      } else if (newScrollLeft >= maxScrollLeft) {
        setDisableRightButton(true);
        setDisableLeftButton(false);
      } else {
        setDisableLeftButton(false);
        setDisableRightButton(false);
      }
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    const onWheel = () => {
      if (container) {
        // console.log('Current Scroll Position:', container.scrollLeft);

        const maxScrollLeft = container.scrollWidth - container.clientWidth - 1;
        // console.log(maxScrollLeft, container.scrollLeft);
        if (container.scrollLeft <= 0) {
          setDisableLeftButton(true);
          setDisableRightButton(false);
        } else if (container.scrollLeft >= maxScrollLeft) {
          setDisableRightButton(true);
          setDisableLeftButton(false);
        } else {
          setDisableLeftButton(false);
          setDisableRightButton(false);
        }
      }
    };

    container.addEventListener('wheel', onWheel);

    // Initial check on mount
    onWheel();

    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        // behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, []);

  return (
    <div className='w-full flex flex-row'>
      {vodSources?.length > 1 && (
        <div className='lg:flex hidden'>
          <div
            id='control-left'
            name='control'
            className={styles.arrowCard}
            onClick={() => handleScroll(-100)} // Adjust scroll offset as needed
          >
            <Image
              src={ArrowLeftIcon}
              alt='Icon'
              className={`${disableLeftButton ? 'transparent' : ''}`}
            />
          </div>
        </div>
      )}
      <div
        ref={containerRef} // Use ref to access the container
        className='flex flex-1 gap-2 overflow-x-scroll hide-scrollbar overscroll-none'
      >
        {vodSources?.map((source) => (
          <div
            key={`key-vodSource-${source.source_id}`}
            id={`vodSource-${source.source_id}`}
            ref={
              source.source_id === vodSourceSelected.source_id
                ? selectedItemRef
                : null
            }
            className={`hover-effect cursor-pointer ${styles.radioOptionCard} ${
              vodSourceSelected.source_id === source.source_id
                ? styles.selectedOptionCard
                : styles.unselectedOptionCard
            }`}
            onClick={() => onSelectSource(source)}
          >
            <div
              htmlFor={`vodSource-${source.source_id}`}
              className='flex flex-row gap-1 items-center'
            >
              <div className='w-6 h-6 flex justify-center items-center'>
                <Image
                  style={{ paddingRight: '2px' }}
                  src={PlaySourceIcon}
                  alt='Icon'
                />
              </div>
              <span className='whitespace-nowrap text-sm'>
                {source.source_name}
              </span>
            </div>
          </div>
        ))}
      </div>
      {vodSources?.length > 1 && (
        <div className='lg:flex hidden'>
          <div
            id='control-right'
            name='control'
            className={styles.arrowCard}
            onClick={() => handleScroll(100)} // Adjust scroll offset as needed
          >
            <Image
              src={ArrowRightIcon}
              alt='Icon'
              className={`${disableRightButton ? 'transparent' : ''}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
