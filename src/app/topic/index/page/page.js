'use client'
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import { Topic } from '@/app/topic/index/page/topic';
import { useEffect, useState } from 'react';
import { LoadingPage } from '@/components/loading';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [topicList, setTopicList] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    getTopicListApi().then((result) => {
      setTopicList(result);
      setIsLoading(false);
    })
  }, []);
  // const topicList = await getTopicListApi();

  return (
    <>
      {isLoading
        ? <div>
          <LoadingPage full={false} />
        </div>
        : <Topic topics={topicList} />
      }
    </>
  );
}

async function getTopicListApi() {
  return YingshiApi(
    URL_YINGSHI_VOD.playlistGetTopic + '?limit=18&page=1',
    {},
    {
      method: 'GET',
      noToken: true,
      extraOptions: {
        next: {
          cache: 'force-cache',
          revalidate: 3600
        }
      }
    }
  );
}
