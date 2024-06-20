import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export const VodPopularList = ({ topic }) => {
  const { t } = useTranslation();

  return <div className="p-4 space-y-4">
    <span className="text-lg">{topic?.topic_name ?? t('popularList')}</span>

    {topic?.vod_list?.map((vod, index) => (
      <Link
        href={`/vod/play/id/${vod.vod_id}/sid/${vod.type_id}/nid/1`}
        key={`key-vodTopic-${index}`}
        className="flex flex-row space-x-4 items-center cursor-pointer"
      >
        <span className={index === 0
          ? 'text-red-500'
          : index === 1
            ? 'text-orange-500'
            : index === 2
              ? 'text-blue-500'
              : 'text-inherit'
        }>{index + 1}</span>
        <span className="text-sm flex-1">{vod.vod_name}</span>
        <span className="text-xs text-white/75">{vod.type_name}</span>
      </Link>
    ))}
  </div>
}