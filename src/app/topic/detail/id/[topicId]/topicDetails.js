import styles from './../../../style.module.css';
import TopicHeader from '@/components/topicHeader';
import VodItemDesktop from '@/components/vodItemDesktop'
import VodItemMobile from '@/components/vodItemMobile'
import { YingshiApi } from '@/util/YingshiApi';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';

async function getTopicDetailsApi(topicId) {
  return YingshiApi(
    URL_YINGSHI_VOD.playlistGetTopicDetail + '?id=' + topicId,
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

export default async function TopicDetails({ topicId}) {
  const topicObj = await getTopicDetailsApi(topicId);

  return (
    <>
      {topicObj && (
        <>
          {/* desktop view */}
          <div className='desktop'>
            <div className={styles.containerHeader}>
              <div className='d-flex' style={{ width: '100%' }}>
                <div className='overlay' style={{ width: '100%' }}>
                  <div className='px-0 d-flex flex-column w-screen'>
                    <div className='topic-container-header container content-end'>
                      <div className='topic-header-text'>
                        {topicObj.topic_name}
                      </div>
                      <div className='topic-header-text-sub'>
                        {topicObj.topic_blurb}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='d-flex container pt-3' style={{ width: '100%' }}>
              <div className='topic-header-text-sub'>
                (共{topicObj.vod_list.length}部)
              </div>
            </div>

            <div className='d-flex container pt-3' style={{ width: '100%' }}>
              <div className='row'>
                {topicObj.vod_list.map((vod, index) => (
                  <VodItemDesktop vod={vod} key={index} />
                ))}
              </div>
            </div>
          </div>

          {/* mobile view */}
          <div className='mobile pb-6'>
            <TopicHeader topicName={topicObj.topic_name} />
            <div  className='px-2.5'>
              {/* mobile content */}
              <div className='topic-header-text-sub mt-3'>
                {topicObj.topic_blurb}
              </div>

              <div className='topic-header-text-sub mt-3'>
                (共{topicObj.vod_list.length}部)
              </div>
              {/* mobile vod list  */}
              <div className='row mt-2'>
                {topicObj.vod_list.map((vod, index) => (
                  <VodItemMobile vod={vod} key={index} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
