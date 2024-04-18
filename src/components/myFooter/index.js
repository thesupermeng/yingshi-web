'use client';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import {
  homeTab,
  homeTabActive,
  topicTab,
  topicTabActive,
} from '@/asset/icons';

import { usePathname, useRouter } from 'next/navigation';

const MyFooter = () => {

  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className='footer row'>
      <div className='col flex-col d-flex justify-center align-center items-center'>
        <div className='d-flex'>

          <Image
            alt='鲨鱼影视'
            src={router.pathname === '/' ? homeTab : homeTabActive}
            width={22}
            style={{ cursor: 'pointer' }}
          />

        </div>

        <div>首首</div>
      </div>

      <div className='col flex-col d-flex justify-center align-center items-center'>
        <div className='d-flex'>
          <Image
            alt='鲨鱼影视'
            src={pathname.startsWith('/topic') ? topicTabActive : topicTab}
            width={22}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div>播单</div>
      </div>
    </div>
  );
};
export default MyFooter;
