import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ArrowDownFillIcon } from '@/asset/icons';

import styles from './style.module.css';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'
import { ArrowRightIcon } from "@/asset/icons";

export const VodEpisodeList = ({
  episodeGroups,
  episodeGroup,
  vodSource,
  episodeSource,
  onSelectEpisodeGroup,
  onSelectEpisode,
  style,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const onEpisodeGroupDropBtnPress = () => {
    setShowDropdown(!showDropdown);
  }

  const onEpisodeGroupPress = (group) => {
    onSelectEpisodeGroup(group);
    setShowDropdown(false);
  }

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        opacity={0}
        style={{ backgroundColor: "yellow" }}
        onPress={() => navigation.popToTop()}
        {...props}
      />
    ),
    [],
  )

  return <div className="flex flex-col space-y-4" style={style}>
    
    {/* PC */}
    <div className='lg:flex hidden relative'>
      <div id="episodeGroup-selected" style={{ width: 'fit-content' }} className={`${styles.radioOptionCard} ${styles.unselectedOptionCard}`} onClick={onEpisodeGroupDropBtnPress}>
        <label for="episodeGroup-selected" className="flex flex-row space-x-1">
          <span className="text-md">{episodeGroup.from}</span>
          <span className="text-md">-</span>
          <span className="text-md">{episodeGroup.to}</span>
          <span className="text-md">{t('集')}</span>
          <Image
            style={{ paddingLeft: '4px' }}
            src={ArrowDownFillIcon}
            alt="Icon"
          />
        </label>
      </div>

      {showDropdown &&
        <ul className={`flex flex-col w-full overflow-y-scroll max-h-48 ${styles.dropdownContainer}`}>
          {episodeGroups.map((group, index) => (
            <li key={`key-episodeGroup-${index}`} id={`episodeGroup-${index}`} className={`${styles.radioOptionCard} ${episodeGroup === group ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onEpisodeGroupPress(group)}>
              <label for={`episodeGroup-${index}`} className="flex flex-row space-x-1">
                <span className="text-md">{group.from}</span>
                <span className="text-md">-</span>
                <span className="text-md">{group.to}</span>
                <span className="text-md">{t('集')}</span>
              </label>
            </li>
          ))}
        </ul>
      }
    </div>
    <ul className="lg:flex hidden flex-column " style={{ flexWrap: 'wrap', overflowX: 'auto' }}>
      {vodSource?.vod_play_list?.urls?.slice(episodeGroup.from - 1, episodeGroup.to).map((episode) => {
        return (
          <li style={{ padding: '10px', margin: '4px', minWidth: '70px', justifyContent: 'center' }} key={`key-episode-${episode.nid}`} id={`episode-${episode.nid}`} className={`${styles.radioOptionCard} ${episodeSource.nid === episode.nid ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onSelectEpisode(episode)}>
            <label for={`episode-${episode.nid}`}>
              <div className="text-sm">{episode.name}</div>
            </label>
          </li>
        )
      })}
    </ul>

    {/* Mobile H5 */}
    <div className='lg:hidden flex relative' style={{ justifyContent: 'space-between' }}>
      <div>
        <span>选集</span>
      </div>

      <div id="episodeGroup-selected" onClick={() => setOpen(true)} style={{ color: '#9C9C9C' }}>
        <label for="episodeGroup-selected" className="flex flex-row space-x-1">
          <span className="text-md">{episodeGroup.from}</span>
          <span className="text-md">-</span>
          <span className="text-md">{episodeGroup.to}</span>
          <span className="text-md">{t('集')}</span>
          <span style={{ margin: 'auto', paddingLeft: '0.5rem' }}>
            <Image
              src={ArrowRightIcon}
              alt="Icon"
            />
          </span>
        </label>
      </div>
      <BottomSheet style={{ background: 'black' }}
      open={open}
      onDismiss={() => {
        setOpen(false);
      }}
      backdropComponent={renderBackdrop}
      >
        <ul className="flex flex-column overflow-auto">
          {episodeGroups.map((group, index) => (
            <li key={`key-episodeGroup-${index}`} id={`episodeGroup-${index}`} className={`${styles.radioOptionCard} ${episodeGroup === group ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onEpisodeGroupPress(group)}>
              <label for={`episodeGroup-${index}`} className="flex flex-row space-x-1">
                <span className="text-md">{group.from}</span>
                <span className="text-md">-</span>
                <span className="text-md">{group.to}</span>
                <span className="text-md">{t('集')}</span>
              </label>
            </li>
          ))}
        </ul>
        <div style={{ height: '300px', margin: '20px' }}>
          <ul className="flex flex-column " style={{ flexWrap: 'wrap', overflowX: 'auto', height: '100%', justifyContent: 'center' }}>
            {vodSource?.vod_play_list?.urls?.slice(episodeGroup.from - 1, episodeGroup.to).map((episode) => {
              return (
                <li style={{ padding: '10px', margin: '4px', minWidth: '70px', justifyContent: 'center' }} key={`key-episode-${episode.nid}`} id={`episode-${episode.nid}`} className={`${styles.radioOptionCard} ${episodeSource.nid === episode.nid ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onSelectEpisode(episode)}>
                  <label for={`episode-${episode.nid}`}>
                    <div className="text-sm">{episode.name}</div>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      </BottomSheet>
    </div>
    <ul className="lg:hidden flex flex-column overflow-auto">
      {vodSource?.vod_play_list?.urls?.slice(episodeGroup.from - 1, episodeGroup.to).map((episode) => {
        return (
          <li style={{ padding: '10px', margin: '4px', minWidth: '70px', justifyContent: 'center' }} key={`key-episode-${episode.nid}`} id={`episode-${episode.nid}`} className={`${styles.radioOptionCard} ${episodeSource.nid === episode.nid ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onSelectEpisode(episode)}>
            <label for={`episode-${episode.nid}`}>
              <div className="text-sm">{episode.name}</div>
            </label>
          </li>
        )
      })}
    </ul>
  </div>
}