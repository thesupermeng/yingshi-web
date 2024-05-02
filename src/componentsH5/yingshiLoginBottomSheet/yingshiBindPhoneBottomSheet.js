import {BottomSheet} from 'react-spring-bottom-sheet';
import CountryInput from '@/componentsH5/yingshiLoginBottomSheet/countryInput';
import React, {useState} from 'react';
import {Button} from '@material-tailwind/react';
import Image from 'next/image';
import {WarningIcon} from '@/asset/icons';

export default function YingshiBindPhoneBottomSheet({visible, onDismiss}) {
  const [formData, setFormData] = useState({})
  const [isInputError, setIsInputError] = useState(false);
  const isInputEmpty = !formData.phoneNumber

  const isPhoneValid = (value) => {
    if (!/^[0-9]{7,12}$/.test(value.replace(RegExp(' ', 'g'), ''))) {
      return false;
    }

    return true;
  }

  const handleInput = (e, isError) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setIsInputError(isError)
  }

  const handleRegister = () => {
    console.log('register', formData)
  }

  return <BottomSheet
    onDismiss={onDismiss}
    open={visible}
    snapPoints={({ minHeight, maxHeight }) => minHeight}
  >
    <div className={'flex flex-col items-center pb-20 gap-[26px] px-[23px]'}>
      <div className={'flex flex-col items-center gap-[10px]'}>
        <p className={'text-xl text-center'}>绑定手机号</p>
        <p className={'text-sm text-center text-[#9C9C9C]'}>系统检测到您的账户尚未绑定手机号。为了确保您的账户安全，请输入手机号码完成账户绑定。</p>
      </div>

      <div className={'border border-[#F3AF3D] text-[#F3AF3D] bg-[#F3AF3D1A] p-2 rounded flex items-center'}>
        <Image src={WarningIcon} alt={'Warning icon'} width={18}/>
        <span className={'text-[14px] font-normal pl-1'}>请注意，只有绑定手机号后，您才能在体育钱包提现。</span>
      </div>

      <div className={'w-full'}>
        <p className={'text-white text-[15px] font-semibold mb-3'}>手机号码</p>
        <CountryInput
          name="phoneNumber"
          placeholder={'2 345 6789'}
          onChange={handleInput}
          errorMessage={'手机号码格式错误'}
          validator={isPhoneValid}
          isShowIcon={true}
        />
      </div>
      <Button className={'h-12 w-full rounded-[10px] disabled:bg-[#1D2023] enabled:bg-[#0085E0] disabled:text-[#9C9C9C] enabled:text-white text-[17px]'} onClick={handleRegister} disabled={isInputError || isInputEmpty}>绑定</Button>

    </div>
  </BottomSheet>
}
