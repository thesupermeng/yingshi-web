import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
// import { useHistory } from 'react-router-dom';

import { usePathname, useRouter } from 'next/navigation';
const TopicHeader = ({ topicName }) => {
  // const history = useHistory();
  const router = useRouter();

  return (
    <div
      className='flex items-center justify-center cursor-pointer py-3.5 sticky'
      style={{ backgroundColor:'rgb(16, 18, 21) !important'}}
      onClick={(e) => {
        e.preventDefault();
       // history.goBack();
        router.back();
      }}
    >
      <span
        className='flex'
        style={{
          position: 'absolute',
          left: '12px',
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </span>
      <span className='flex'>{topicName}</span>
    </div>
  );
};

export default TopicHeader;
