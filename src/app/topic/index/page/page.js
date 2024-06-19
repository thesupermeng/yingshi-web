import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { YingshiApi } from '@/util/YingshiApi';
import {Topic} from '@/app/topic/index/page/topic';

export default async function Page({ params }) {
  const topicList = await getTopicListApi();

  return(
    <Topic topics={topicList} />
  );
}

async function getTopicListApi() {
  return YingshiApi(
      URL_YINGSHI_VOD.playlistGetTopic + '?limit=18&page=1',
      {},
      {
        method: 'GET',
        noToken: true
      }
  );
}
