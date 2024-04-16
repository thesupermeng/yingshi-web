import Image from "next/image";
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next";
import { ArrowDownIcon } from "@/asset/icons";

import styles from './style.module.css';

export const VodContent = ({
  vodContent,
  vodEpisodeInfo,
  vodEpisodeSelected
}) => {
  const { t } = useTranslation();

  const qqqref = useRef();
  const [isLineExceed, setLineExceed] = useState(false);
  const [isCollapse, setCollapse] = useState(true);
  const [episodeInfo, setEpisodeInfo] = useState(null);

  useEffect(() => {
    setLineExceed(checkIsLineExceed(qqqref.current));
  }, []);

  useEffect(() => {
    if(vodEpisodeInfo != null && vodEpisodeSelected != null){
      const episodeId = vodEpisodeSelected.nid;
      const selectedItem = vodEpisodeInfo.filter((info) => info.episode == episodeId + 1);
      if(selectedItem.length > 0){
        setEpisodeInfo(selectedItem[0]);
      } else {
        setEpisodeInfo(null);
      }
    }
  }, [vodEpisodeInfo, vodEpisodeSelected]);

  const checkIsLineExceed = (e) => {
    if(e != null){
      return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
    }
    return true;
  }

  const onExpandPress = () => {
    setCollapse(!isCollapse);
  }
  console.log(vodEpisodeInfo);
  console.log(vodEpisodeSelected);
  return (
    <>
      {episodeInfo != null &&
        <div className={styles.vodMetaContainer}>
          <div className="space-y-4">
            <span className="">{t('分集剧情 : ')}{episodeInfo.title}</span>
            <p ref={qqqref} className={`${isCollapse ? 'line-clamp-2' : ''} text-white/75`}>{episodeInfo.gpt_content}</p>
            {isLineExceed &&
              <div className="flex flex-row space-x-2 items-center" onClick={onExpandPress}>
                <span className={styles.primaryText}>{t('expand')}</span>
                <ArrowDownIcon
                  color={'#FAC33D'}
                />
              </div>
            }
          </div>
        </div>
      }
    </>
  )
}