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
        <li key={`key-vodSource-${source.source_id}`} id={`vodSource-${source.source_id}`} className={`min-w-8 ${styles.radioOptionCard} ${vodSourceSelected.source_id === source.source_id ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onSelectSource(source)}>
          <label for={`vodSource-${source.source_id}`} className={`flex flex-row space-x-1`}>
            <Image
              src={PlaySourceIcon}
              alt="Icon"
            />
            <div className="text-lg">{source.source_name}</div>
          </label>
        </li>
      ))}
      {vodSources?.map((source) => (
        <li key={`key-vodSource-${source.source_id}`} id={`vodSource-${source.source_id}`} className={`${styles.radioOptionCard} ${vodSourceSelected.source_id === source.source_id ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onSelectSource(source)}>
          <label for={`vodSource-${source.source_id}`} className={`flex flex-row space-x-1`}>
            <Image
              src={PlaySourceIcon}
              alt="Icon"
            />
            <div className="text-lg">{source.source_name}</div>
          </label>
        </li>
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