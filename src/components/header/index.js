'use client';
import useUser from '@/hook/user/useUser';
import { useSelector, useDispatch } from 'react-redux';
import {
  hideRightBarContent,
  setProfileModal,
  showRightBarContent,
} from '@/store/common';
import Image from 'next/image';
import { ProfileModalType } from '../profileModal';
import { RightSidebarContantTypes } from '../rightSideMenu';
import HeaderBetSlip from './headerBetSlip';
import Profile from './profile';
import Wallet from './wallet';
import { useTranslation } from 'next-i18next';
import { EastRichRedBlackLogo, EastRichWhiteRedText } from '@/asset/icons';

const Header = () => {
  const dispatch = useDispatch();
  const { rightBarContent } = useSelector((s) => s.common);
  const { isLogin } = useUser();
  const { t } = useTranslation();

  const onClick = () => {
    dispatch(hideRightBarContent('All'));
    dispatch(showRightBarContent(RightSidebarContantTypes.BetCart));
  };

  return (
    <>
      <div className='flex-1 px-5 py-4'>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Image
            src={EastRichWhiteRedText}
            alt='Taya'
            className={`flex-initial h-[3.65rem] w-[9rem]`}
          />
          <div className='flex items-center flex-initial gap-5'>
            {isLogin && <Wallet />}

            {isLogin ? (
              <Profile />
            ) : (
              <>
                <button
                  className='py-3 rounded-full px-[1.375rem] hover:bg-white/5'
                  onClick={() => {
                    dispatch(setProfileModal(ProfileModalType.LoginModal));
                  }}
                >
                  {t('login')}
                </button>
                <button
                  className='py-2.5 px-[1.375rem] bg-tayaRed rounded-[6.25rem]'
                  onClick={() => {
                    dispatch(setProfileModal(ProfileModalType.SignUpModal));
                  }}
                >
                  <p>Sign Up</p>
                </button>
              </>
            )}

            {!rightBarContent?.[RightSidebarContantTypes.BetCart] && (
              <HeaderBetSlip onClick={onClick} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
