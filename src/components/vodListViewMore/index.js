'use client'

import { useRouter } from "next/navigation";

const VodListViewMore = ({ type, data }) => {
  const router = useRouter();

  const handleClick = (item) => {
    switch (type) {
      case 'category': {
        localStorage.setItem('videoTypeId', item.type_id);
        localStorage.setItem('videoClass', item.type_name);
        // router.push(`/film-library`);
        router.push(`vod/show/by/hits_day/class/${item.type_name}/id/${item.type_id}`);
        break;
      }
      case 'topic': {
       //  router.push('/topic/' + item.topic_id);
         router.push('/topic/detail/id/' + item.topic_id);
        break;
      }
      case 'xcategory': {
        router.push(
          `/xvod/${item.vod_source_name}/${item.type_name}`
        );
        break;
      }
    }
  };

  return (
    <span
      className='mr-1'
      style={{
        fontSize: '12px',
        fontWeight: '400',
        fontStyle: 'normal',
        fontFamily: 'PingFang SC',
      }}
      onClick={() => handleClick(data)}
    >
      更多
    </span>
  );
}

export default VodListViewMore;