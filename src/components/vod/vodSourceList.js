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

  const handleScroll = (scrollOffset) => {
    if (containerRef.current) {
      const newScrollLeft = containerRef.current.scrollLeft + scrollOffset;
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (selectedItemRef.current) {

      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
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
            <Image src={ArrowLeftIcon} alt='Icon' />
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
            <Image src={ArrowRightIcon} alt='Icon' />
          </div>
        </div>
      )}
    </div>
  );
};
