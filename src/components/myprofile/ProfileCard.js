import Image from 'next/image';
import {editIcon, MemberUser, profileIcon, vipProfileIcon, VipUser} from '@/asset/icons';
import {formatDateCN} from '@/util/date';
import {logout} from '@/services/yingshiUser';
import {setYingshiUserInfo} from '@/store/yingshiUser';
import React from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/navigation';

export default function ProfileCard({userInfo, isVip, isH5, onSignin}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const iconProfile = userInfo?.group_id == 2 ? MemberUser : userInfo?.group_id == 3? VipUser : profileIcon

  return (
    <div className={'flex gap-[15px] items-center'}>
      <div className="flex justify-center">
        <Image
          src={iconProfile}
          alt="profile"
          height={48}
        />
      </div>
      <div className="flex-1 text-xs gap-2.5"
           style={{margin: 'auto', marginLeft: '0px'}}>
        <div className={'flex items-center'}>
          {/*<div className='text-bold text-lg' style={{ width: 'wrap-content' }}>贝贝</div>*/}
          <span className="text-bold text-lg font-semibold">
                  {userInfo ? userInfo.user_name : '游客您好'}
                </span>
          {isVip &&
            <Image
              src={vipProfileIcon}
              alt="profile"
              width={22}
              height={22}
            />
          }
        </div>
        {/*<p style={{ color: '#D1AC7D' }}>VIP会员有效日期至2023年9月19日</p>*/}
        {userInfo && isVip && <span
          className={'text-[#D1AC7D] text-[13px]'}>VIP会员有效日期至{formatDateCN(userInfo.vip_end_time)}</span>}
        {!userInfo && !isVip && <span className={'text-[14px]'}>登录可享更多服务</span>}
      </div>
      {isH5 &&
        <div className="flex items-center justify-center">
          {userInfo &&
            <Image
              src={editIcon}
              alt="edit"
              onClick={() => {
                router.push('/myprofile/userCenter')
              }}
            />
          }
          {!userInfo &&
            <button className={'bg-[#0085E0] color-white w-20 h-8 rounded-md border-2 border-[#0085E033] text-sm'}
                    onClick={onSignin}>
              登录
            </button>

          }
        </div>
      }
    </div>
  )
}
