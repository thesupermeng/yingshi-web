import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import {
  whatsapp as WhatsappIcon,
  MessengerIcon,
  TelegramIcon,
  LineIcon,
  WechatIcon,
  CameraIcon,
  WeiboIcon,
  QqIcon,
  Facebook2Icon,
  CopyLink2Icon,
} from '@/asset/icons';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { YingshiApi } from '@/util/YingshiApi';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import styles from './style.module.css';




export const ExtraDesc = ({ vod = '', episodeSelected = '' }) => {

  if (!vod && !episodeSelected) {
    return;
  }

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  const [extraInfo, setExtraInfo] = useState('');

  const getExtraInfo = async () => {
    return YingshiApi(
      URL_YINGSHI_VOD.getExtraInfo,
      {
        id: vod.vod_id,
        ep_no: episodeSelected?.name,
      },
      { method: 'GET' }
    );
  };

  const initData = async () => {
    let res = await getExtraInfo();

    if (res && res !== undefined) {
      setExtraInfo(res.gpt_content);
      console.log('setExtraInfo');
      console.log(res.gpt_content);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const { t } = useTranslation();
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <div className={`allow-select row px-5 py-4`} style={{backgroundColor :'#1e2023' , borderRadius:'12px' , marginRight:'10px'}}>
      <div className={`col-12 pb-3`}>
        <span className={'text-white'}  style={{fontSize :'24px' }}>
          分类剧情: 第{episodeSelected?.name}集
        </span>
      </div>

          <div className="col-12">
      <span className={`text-secondary text-lg ${styles.collapsible} ${isExpanded ? 'expanded' : ''}`}>
        {extraInfo}
      </span>
      {extraInfo.split('\n').length > 3 && (
        <div className={`${styles.show-more-button}`} onClick={toggleExpand}>
          {isExpanded ? 'Show Less' : 'Show More'}
          <span className={`${styles.arrow-down}`}>{isExpanded ? '↑' : '↓'}</span>
        </div>
      )}
    </div>
    </div>

  );
};
