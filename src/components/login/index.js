import {Button, Checkbox, Dialog, DialogBody} from '@material-tailwind/react';
import React, {useEffect, useState} from 'react';
import CountryInput from '@/components/login/countryInput';
import TextInput from '@/components/login/input';
import {GoogleIcon} from '@/asset/icons';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';
import {loginRequestEmailOtp, loginRequestSmsOtp} from '@/services/yingshiUser';
import {setYingshiUserLoginParam} from '@/store/yingshiUser';

export default function LoginModal({open, handler, onRegsiter}) {
  const router = useRouter()
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const [loginMode, setLoginMode] = useState('sms')
  const [isInputError, setIsInputError] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const isInputEmpty = !formData.phoneNumber && !formData.email


  useEffect(() => {
    setFormData({})
  }, [loginMode])

  const handleRegister = () => {

    // const loginParam = loginMode === 'sms' ?
    //     {
    //         loginMode,
    //         ...formData,
    //     }
    //     :
    //     {
    //         loginMode,
    //         ...formData
    //     }
    const loginParam = {...formData, loginMode}

    if (loginMode === 'sms') {
      loginRequestSmsOtp(loginParam)
    } else {
      loginRequestEmailOtp(loginParam)
    }
    console.log(loginParam)
    dispatch(setYingshiUserLoginParam(loginParam))
    // router.push('/login/otp')
    onRegsiter()
  }

  const handleClickEmail = () => {
    setLoginMode('email')
  }

  const handleClickPhone = () => {
    setLoginMode('sms')
  }

  const handleInput = (e, isError) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setIsInputError(isError)
  }

  const isEmailValid = (value) => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(value)) {
      return false;
    }

    return true;
  }

  const isPhoneValid = (value) => {
    if (!/^[0-9]{7,12}$/.test(value.replace(RegExp(' ', 'g'), ''))) {
      return false;
    }

    return true;
  }

  return (
    <Dialog open={open} handler={handler} className={'w-[500px] bg-[#121212] rounded-[28px] p-[30px]'}>
      <DialogBody className={'p-0 w-full h-full'}>
        <div className={'flex flex-col gap-[19px]'}>
          <p className={'text-[16px] text-center font-semibold text-white'}>注册/登录</p>
          <p className={'text-[16px] text-center font-medium text-[#9C9C9C]'}>登录后可管理您的账号，多端同步观看历史和收藏夹。</p>
        </div>
        {/* login mode tab */}
        <div className={'flex'}>
          <Tabs title={'手机号码'} onClick={handleClickPhone} isSelected={loginMode === 'sms'}/>
          <Tabs title={'电邮地址'} onClick={handleClickEmail} isSelected={loginMode === 'email'}/>
        </div>
        {/* title and input */}
        <div className={'flex flex-col gap-[15px]'}>
          {loginMode === 'email' &&
            <>
              <span className={'text-[15px] text-[#9C9C9C]'}>请输入电邮地址</span>
              <TextInput
                name="email"
                placeholder={'输入邮箱账号'}
                onChange={handleInput}
                errorMessage={'电邮地址格式错误'}
                validator={isEmailValid}
                isShowIcon={true}
              />
            </>
          }
          {loginMode === 'sms' &&
            <>
              <span className={'text-[15px] text-[#9C9C9C]'}>请输入手机号码</span>
              <CountryInput
                name="phoneNumber"
                placeholder={'2 345 6789'}
                onChange={handleInput}
                errorMessage={'手机号码格式错误'}
                validator={isPhoneValid}
                isShowIcon={true}
              />
            </>
          }
          {/* button */}
          <Button className={'w-full rounded-[10px] h-[48px] bg-shayuBlue text-[17px] font-semibold'} onClick={handleRegister} disabled={isInputError || isInputEmpty || !isAgreementChecked}>登录</Button>
          {/* 或者 */}
          <div className={'flex items-center gap-1'}>
            <div className={'flex-1 bg-[#3E3E3E] h-px'}/>
            <span className={'text-[#3E3E3E] text-[12px] font-medium'}>或者</span>
            <div className={'flex-1 bg-[#3E3E3E] h-px'}/>
          </div>
          {/* agreement */}
          <div className={'flex items-center justify-center'}>
            {/*<div*/}
            {/*  className={`w-3 h-3 rounded-lg border border-[#9c9c9c] m-1 ${isAgreementChecked ? 'bg-[#0085E0]' : ''}`}*/}
            {/*  onClick={() => setIsAgreementChecked(x => !x)}/>*/}
            <Checkbox
              defaultChecked={isAgreementChecked}
              ripple={false}
              className={'w-4 h-4 rounded-full'}
              color={'blue'}
              onChange={(e) => setIsAgreementChecked(e.target.checked)}
            />
            <span className={'text-[13px] text-[#9C9C9C]'}>我已阅读并同意
                                <span className={'text-[#0085E0]'}>用户协议</span>
                                和
                                <span className={'text-[#0085E0]'}>隐私协议</span>
                            </span>
          </div>
          <div className={'flex flex-col gap-[12px]'} >
              <Button className={'w-full h-12 flex items-center bg-[#1D2023] rounded-lg px-[20px] normal-case'}>
                  <Image src={GoogleIcon} alt={'Google Icon'} width={24} height={24} />
                  <span className={'font-semibold text-[15px] text-white flex-1'}>继续使用 Google</span>
              </Button>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  )
}

function Tabs({title, isSelected, onClick}) {
  const color = isSelected ? '#0085E0' : 'transparent'
  const textStyle = isSelected ? 'text-white font-semibold' : 'text-[#FFFFFF80] '

  return (<div className={'p-2.5 flex flex-col items-center justify-center'} onClick={onClick}>
    <span className={textStyle}>{title}</span>
    <div className={`rounded h-[3px] w-[22px] bg-[${color}]`}></div>
  </div>)
}
