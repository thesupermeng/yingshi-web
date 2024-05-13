import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlaySourceIcon,
} from "@/asset/icons";

import styles from './style.module.css';
import { useState, useRef } from 'react';

export const VodSourceList = ({
  vodSources,
  vodSourceSelected,
  onSelectSource,
}) => {
  const containerRef = useRef(null);

  const handleScroll = (scrollOffset) => {
    if (containerRef.current) {
      const newScrollLeft = containerRef.current.scrollLeft + scrollOffset;
      containerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex justify-between space-x-2">
      {vodSources?.length > 3 && (
        <div className="lg:flex hidden">
          <div
            id="control-left"
            name="control"
            className={styles.arrowCard}
            onClick={() => handleScroll(-100)} // Adjust scroll offset as needed
          >
            <Image src={ArrowLeftIcon} alt="Icon" />
          </div>
        </div>
      )}

      <ul
        ref={containerRef} // Use ref to access the container
        className="flex flex-1 overflow-x-scroll space-x-2 hide-scrollbar"
      >
        {vodSources?.map((source) => (
          <li
            key={`key-vodSource-${source.source_id}`}
            id={`vodSource-${source.source_id}`}
            className={`${styles.radioOptionCard} ${
              vodSourceSelected.source_id === source.source_id
                ? styles.selectedOptionCard
                : styles.unselectedOptionCard
            }`}
            onClick={() => onSelectSource(source)}
          >
            <div
              htmlFor={`vodSource-${source.source_id}`}
              className="flex flex-row space-x-1 items-center"
            >
              <div className="w-6 h-6 flex justify-center items-center">
                <Image style={{ paddingRight: '2px' }} src={PlaySourceIcon} alt="Icon" />
              </div>
              <span className="whitespace-nowrap text-sm">{source.source_name}</span>
            </div>
          </li>
        ))}
      </ul>

      {vodSources?.length > 3 && (
        <div className="lg:flex hidden">
          <div
            id="control-right"
            name="control"
            className={styles.arrowCard}
            onClick={() => handleScroll(100)} // Adjust scroll offset as needed
          >
            <Image src={ArrowRightIcon} alt="Icon" />
          </div>
        </div>
      )}
    </div>
  );
};
