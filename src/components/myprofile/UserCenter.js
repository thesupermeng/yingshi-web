import Image from 'next/image';
import {editIcon, profileIcon} from '@/asset/icons';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import EditNicknameModal from '@/components/myprofile/editNicknameModal';
import {useState} from 'react';
import LoginSuccess from '@/components/login/loginSuccess';

export default function UserCenter() {
  const { userInfo, refreshUserInfo } = useYingshiUser()
  const [openEditNickname, setOpenEditNickname] = useState(false)
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false)

  const handleOpenEditNickname = () => {
    setOpenEditNickname(x => !x)
  }

  const handleOpenSuccessAlert = () => {
    setOpenSuccessAlert(x => !x)
  }

  return (
    <div className={'flex flex-col gap-[36px] w-full'}>
      <span className={'text-[28px] font-semibold text-center text-white'}>个人中心</span>
      <div>
        <span className={'text-white text-[16px] font-semibold'}>个人信息</span>
        <div className={'flex bg-[#1D2023] rounded-[10px] px-[20px] py-[17px] items-center gap-[12px] mt-[14px]'}>
          <Image src={profileIcon} alt={'profile icon'} width={56}/>
          <span className={'text-white text-[15px] font-semibold flex-1'}>{userInfo?.user_name}</span>
          <Image src={editIcon} alt={'edit'} width={30} onClick={handleOpenEditNickname} className={'cursor-pointer'}/>
        </div>
      </div>
      <div>
        <span className={'text-white text-[16px] font-semibold'}>账号与安全</span>
        {userInfo?.user_email &&
          <div className={'flex bg-[#1D2023] rounded-[10px] px-[20px] py-[25px] items-center gap-[20px] mt-[14px]'}>
            <span className={'text-[#9C9C9C] text-[15px] font-semibold'}>电邮地址</span>
            <span className={'text-white text-[15px] font-semibold flex-1'}>{userInfo.user_email}</span>
          </div>
        }
        {!!(userInfo?.user_phone) &&
          <div className={'flex bg-[#1D2023] rounded-[10px] px-[20px] py-[25px] items-center gap-[20px] mt-[14px]'}>
            <span className={'text-[#9C9C9C] text-[15px] font-semibold'}>手机号码</span>
            <span className={'text-white text-[15px] font-semibold flex-1'}>+{userInfo.country.country_phonecode} {userInfo.user_phone}</span>
          </div>
        }
      </div>
    <EditNicknameModal
      open={openEditNickname}
      handler={handleOpenEditNickname}
      onSuccess={() => {
        setOpenEditNickname(false)
        setOpenSuccessAlert(true)
        refreshUserInfo()
        setTimeout(() => {
          setOpenSuccessAlert(false)
        }, 2000)
      }}
    />
      <LoginSuccess
        open={openSuccessAlert}
        handler={handleOpenSuccessAlert}
        msg={'昵称修改成功'}
      />
    </div>
  )
}
