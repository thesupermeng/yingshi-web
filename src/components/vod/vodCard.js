import { useState, useEffect } from 'react';
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon } from "@/asset/icons";
import { convertTimeStampToDateTime } from "@/util/date";
import { ShareHorizontal } from '@/components/shareHorizontal';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'
import styles from './style.module.css';
import { CloseX } from '@/asset/icons';

export const VodCard = ({
  imgSource,
  vodName,
  vodUpdateDate,
  vodYear,
  vodClass,
  vodRemark,
  vod,
  vodEpisodeInfo,
  vodEpisodeSelected,
  vodDirector,
  vodActor,
  vodBlurb
}) => {
  const { t } = useTranslation();

  const _vodUpdateDate = convertTimeStampToDateTime(vodUpdateDate);
  const [openIntroBottomSheet, setOpenIntroBottomSheet] = useState(false);
  const [episodeInfo, setEpisodeInfo] = useState(null);

  const selectIntro = () => {
    setOpenIntroBottomSheet(true);
  }
  
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
  if(vod != undefined){
    console.log(vod);
    console.log(vod.vod_director);
  }
  if(episodeInfo){
    console.log(episodeInfo);
  }
  return <div className="flex flex-row space-x-4">
    {/* Bottom Sheet Intro H5*/}
    <BottomSheet
      onDismiss={() => {
        setOpenIntroBottomSheet(false);
      }}
      open={openIntroBottomSheet}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span className="text-md text-white px-2" style={{ fontWeight: '300' }}>{t('简介')}</span>
        </div>
        <div style={{ paddingRight: '0.8rem' }}>
          <Image
            src={CloseX}
            alt="Icon"
          />
        </div>
      </div>
      {episodeInfo != null &&
        <div className={styles.vodMetaContainer}>
          <div className="space-y-4">
            <span className="">{t('分集剧情 : ')}{episodeInfo.title}</span>
              <>
                <span>导演 : {vod?.vod_director}</span>
                <span>演员 : {vod?.vod_actor}</span>
                <span>演员 : {vod?.type_name}</span>
              </>
            <p className={`text-white/75 text-sm`} style={{ color: '#9C9C9C' }}>{episodeInfo.gpt_content}</p>
          </div>
        </div>
      }
    </BottomSheet>
    <div className="relative hidden lg:w-1/3 lg:flex rounded-xl">
      <img className="rounded-xl" src={imgSource} />
      <span className="absolute bottom-2 left-0 text-xs bg-black/50 rounded-r py-0.5 pr-0.5">{vodRemark}</span>
    </div>

    <div className="flex flex-col lg:w-2/3">
      <div className="flex flex-row">
        <span className="text-lg pr-5">{vodName}</span>
        <div className="lg:hidden flex flex-row space-x-2 py-1" onClick={() => setOpenIntroBottomSheet(true)}>
          <span className="text-sm text-white/75" style={{ fontWeight: '300' }}>{t('简介')}</span>
          <Image
            src={ArrowRightIcon}
            alt="Icon"
          />
        </div>
      </div>
      <span className="text-sm text-white/75 py-1 pt-3" style={{ fontWeight: '300', color: '#9C9C9C' }}>{vodYear} {vodClass}</span>
      <span className="text-sm text-white/75 py-1" style={{ fontWeight: '300', color: '#9C9C9C' }}>{t('更新')}: {_vodUpdateDate.year}-{_vodUpdateDate.month}-{_vodUpdateDate.day}</span>
      <div className="lg:flex hidden flex-row space-x-2 py-1">
        <span className="text-sm text-white/75" style={{ fontWeight: '300', color: '#9C9C9C' }}>{t('简介')}</span>
        <Image
          src={ArrowRightIcon}
          alt="Icon"
        />
      </div>
      {/* H5 Share Horizontal */}
      <div className="lg:hidden flex">
        <ShareHorizontal
          className={'w-[90%]'}
        />
      </div>
    </div>
  </div>
}