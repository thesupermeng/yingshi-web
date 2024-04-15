import Image from "next/image";
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next";
import { ArrowDownIcon } from "@/asset/icons";

import styles from './style.module.css';

export const VodContent = ({
  vodContent,
}) => {
  const { t } = useTranslation();

  const qqqref = useRef();
  const [isLineExceed, setLineExceed] = useState(false);
  const [isCollapse, setCollapse] = useState(true);

  useEffect(() => {
    setLineExceed(checkIsLineExceed(qqqref.current));
  }, []);

  const checkIsLineExceed = (e) => {
    return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
  }

  const onExpandPress = () => {
    setCollapse(!isCollapse);
  }

  return <div className="space-y-4">
    <span className="">{t('分集剧情')}</span>
    <p ref={qqqref} className={`${isCollapse ? 'line-clamp-2' : ''} text-white/75`}>{vodContent}</p>

    {isLineExceed &&
      <div className="flex flex-row space-x-2 items-center" onClick={onExpandPress}>
        <span className={styles.primaryText}>{t('expand')}</span>
        <ArrowDownIcon
          color={'#FAC33D'}
        />
      </div>
    }
  </div>
}