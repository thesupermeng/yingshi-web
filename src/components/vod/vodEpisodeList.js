import { useState } from 'react';
import Image from 'next/image';
import { ArrowDownFillIcon } from '@/asset/icons';

import styles from './style.module.css';
import { useTranslation } from 'react-i18next';


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

  const [showDropdown, setShowDropdown] = useState(false);

  const onEpisodeGroupDropBtnPress = () => {
    setShowDropdown(!showDropdown);
  }

  const onEpisodeGroupPress = (group) => {
    onSelectEpisodeGroup(group);
    setShowDropdown(false);
  }

  return <div className="flex flex-col space-y-4" style={style}>
    <div className='relative'>
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

    <ul className="flex flex-column" style={{ flexWrap: 'wrap', overflowX: 'auto' }}>
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