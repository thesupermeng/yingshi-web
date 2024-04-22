import { URL_YINGSHI_VOD } from "@/config/yingshiUrl";
import { YingshiApi } from "@/util/YingshiApi";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';

export const VodPopularList = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState([]);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setLoading(true);
    fetchTopicDetail().then((result) => {
      setTopic(result);
      setLoading(false);
    });
  }

  const fetchTopicDetail = async () => {
    return YingshiApi(URL_YINGSHI_VOD.playlistGetTopicDetail + '?id=1', {}, { method: 'GET' });
  }

  return <div className="p-4 space-y-4">
    <span className="text-lg">{topic?.topic_name ?? t('popularList')}</span>

    {topic?.vod_list?.map((vod, index) => (
      <div 
        onClick={(e) => {
          e.preventDefault();
          router.push(`/play/${vod.vod_id}`);
        }}
        key={`key-vodTopic-${index}`} className="flex flex-row space-x-4 items-center cursor-pointer">
        <span className={index === 0
          ? 'text-red-500'
          : index === 1
            ? 'text-orange-500'
            : index === 2
              ? 'text-yellow-500'
              : 'text-inherit'
        }>{index + 1}</span>
        <span className="text-sm flex-1">{vod.vod_name}</span>
        <span className="text-xs text-white/75 text-sm">{vod.type_name}</span>
      </div>
    ))}
  </div>
}