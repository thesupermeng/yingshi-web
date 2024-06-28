import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { YingshiApi  , getIPAddress} from '@/util/YingshiApi';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import styles from './style.module.css';

export const ExtraDesc = ({ vod = '', episodeSelected = '' , isMobile = false }) => {
  if (!vod && !episodeSelected && vod?.type_id != 1) {
    // vod?.type_id !=1 only 短剧有 extra desc
    return null;
  }

  // Extra Info state and fetch
  const [extraInfo, setExtraInfo] = useState('');
  // Toggle
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsShowMore, setNeedsShowMore] = useState(false);
  const [needsShowMore2, setNeedsShowMore2] = useState(false);
  const contentRef = useRef(null);
  const contentRef2 = useRef(null);
  useEffect(() => {
    if (extraInfo == '') {
      return;
    }
    // Check if the content exceeds 3 lines
    const lineHeight = parseInt(
      window.getComputedStyle(contentRef.current).lineHeight
    );
    const maxHeight = lineHeight * 3; // Maximum height for 3 lines
    if (contentRef.current.scrollHeight > maxHeight) {
      setNeedsShowMore(true);
    }

        // Check if the content exceeds 3 lines ---- mobile
        const lineHeight2 = parseInt(
          window.getComputedStyle(contentRef2.current).lineHeight
        );
        const maxHeight2 = lineHeight * 3; // Maximum height for 3 lines
        if (contentRef2.current.scrollHeight > maxHeight2) {
          setNeedsShowMore2(true);
        }
  }, [extraInfo]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
    if (res && res !== undefined && res.gpt_content) {
      setExtraInfo(res.gpt_content);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
      {extraInfo != '' && (
        <>
        <div
          className={`allow-select row px-4 py-4 desktop`}
          style={{
            backgroundColor: '#1e2023',
            borderRadius: '12px',
            marginRight: '2px',
          }}
        >
          <div className={`col-12 pb-3`}>
            <span className={'text-white'} style={{ fontSize: '18px' }}>
              分类剧情: 第{episodeSelected?.name}集
            </span>
          </div>

          <div className='col-12' style={{ fontSize: '14px' }}>
            <span
              ref={contentRef}
              className={`text-secondary  ${styles.collapsible}${
                isExpanded ? 'expanded' : ''
              }`}
            >
              {extraInfo}
            </span>
            {needsShowMore && (
              <div
                className={`${styles['show-more-button']} text-theme`}
                onClick={toggleExpand}
              >
                {isExpanded ? '收起' : '展开'}
                {/* <span className={`${styles['arrow-down']}`}>{isExpanded ? '↑' : '↓'}</span> */}
                <FontAwesomeIcon
                  icon={isExpanded ? faChevronUp : faChevronDown}
                  className={`${styles['arrow-down']}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* mobile  */}
        <div
          className={`allow-select row mobile pb-4`}
          style={{
            backgroundColor: '#1e2023',
            borderRadius: '12px',
            marginRight: '2px',
          }}
        >
          <div className={`col-12 pb-2 pt-2`}>
            <span className={'text-white'} style={{ fontSize: '14px' }}>
              分类剧情: 第{episodeSelected?.name}集
            </span>
          </div>

          <div className='col-12' style={{ fontSize: '12px' }}>
            <span
              ref={contentRef2}
              className={`text-secondary  ${styles.collapsible2}${
                isExpanded ? 'expanded' : ''
              }`}
            >
              {extraInfo}
            </span>
            {needsShowMore2 && (
              <div
                className={`${styles['show-more-button2']} text-theme`}
                onClick={toggleExpand}
              >
                {isExpanded ? '收起' : '展开'}
                {/* <span className={`${styles['arrow-down']}`}>{isExpanded ? '↑' : '↓'}</span> */}
                <FontAwesomeIcon
                  icon={isExpanded ? faChevronUp : faChevronDown}
                  className={`${styles['arrow-down2']}`}
                />
              </div>
            )}
          </div>
        </div>

</>
      )}
    </>
  );
};
