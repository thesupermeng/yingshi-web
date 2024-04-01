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
      <div id="episodeGroup-selected" className={`${styles.radioOptionCard} ${styles.unselectedOptionCard}`} onClick={onEpisodeGroupDropBtnPress}>
        <label for="episodeGroup-selected" className="flex flex-row space-x-1">
          <span className="text-lg">{episodeGroup.from}</span>
          <span className="text-lg">-</span>
          <span className="text-lg">{episodeGroup.to}</span>
          <span className="text-lg">{t('episode')}</span>
          <Image
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
                <span className="text-lg">{group.from}</span>
                <span className="text-lg">-</span>
                <span className="text-lg">{group.to}</span>
                <span className="text-lg">{t('episode')}</span>
              </label>
            </li>
          ))}
        </ul>
      }
    </div>

    <ul className="grid grid-flow-row-dense grid-cols-2 gap-4 overflow-y-scroll">
      {vodSource?.vod_play_list?.urls?.map((episode) => (
        <li key={`key-episode-${episode.nid}`} id={`episode-${episode.nid}`} className={`${styles.radioOptionCard} ${episodeSource.nid === episode.nid ? styles.selectedOptionCard : styles.unselectedOptionCard}`} onClick={() => onSelectEpisode(episode)}>
          <label for={`episode-${episode.nid}`}>
            <div className="text-lg">{episode.name}</div>
          </label>
        </li>
      ))}
    </ul>
  </div>
}