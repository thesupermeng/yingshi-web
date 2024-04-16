import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlaySourceIcon,
} from "@/asset/icons";

import styles from './style.module.css';

export const VodSourceList = ({
  vodSources,
  vodSourceSelected,
  onSelectSource,
}) => {
  return <div className="flex justify-between space-x-2">
    <div id="control-left" name="control" className={styles.arrowCard}>
      <Image
        src={ArrowLeftIcon}
        alt="Icon"
      />
    </div>

    <ul className="flex flex-1 overflow-x-scroll space-x-2">
    {vodSources?.map((source) => (
        <>
          <li key={`key-vodSource-${source.source_id}`} id={`vodSource-${source.source_id}`} className={`${styles.radioOptionCard} ${vodSourceSelected.source_id === source.source_id ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onSelectSource(source)}>
            <div for={`vodSource-${source.source_id}`} className={`flex flex-row space-x-1 items-center`}>
              <div className="w-6 h-6 flex justify-center items-center">
                <Image
                  style={{ paddingRight: '2px' }}
                  src={PlaySourceIcon}
                  alt="Icon"
                />
              </div>
              <span className="whitespace-nowrap text-sm">{source.source_name}</span>
            </div>
          </li>
        </>
      ))}
    </ul>

    <div id="control-left" name="control" className={styles.arrowCard}>
      <Image
        src={ArrowRightIcon}
        alt="Icon"
      />
    </div>
  </div>
}