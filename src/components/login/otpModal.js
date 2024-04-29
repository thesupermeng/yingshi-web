import {Button, Dialog, DialogBody} from '@material-tailwind/react';
import {forwardRef, useEffect, useRef, useState} from 'react';
import {loginEmail, loginSms} from '@/services/yingshiUser';
import {setYingshiUserLoginParam} from '@/store/yingshiUser';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';

const totalCountdownTime = 60 // seconds


export default function OtpModal ({open, handler, onLogin, onRegister}) {
  const [countdownTimer, setCountdownTimer] = useState(totalCountdownTime);
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()

  //redux
  const dispatch = useDispatch()
  const getLoginParam = (s) => s.yingshiUser.loginParam
  const loginParam = useSelector(getLoginParam)


  // refs
  const timerRef = useRef(null);
  const inputRefs = useRef([])
  const otpRef = useRef(new Array(6).fill(''))

  useEffect(() => {
    // if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setCountdownTimer(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
    }

  }, [])

  useEffect(() => {
    if (inputRefs.current.length !== 0 ){
      inputRefs.current[0].focus()
    }
  }, [])

  const handleBackspace = (e, index) => {
    if(e.key === 'Backspace' && !e.target.value && index > 0){
      inputRefs.current[index - 1].focus()
    }
  }

  const handleChange = (value, index) => {
    setErrorMessage('')
    let newArr = [...otpRef.current];
    newArr[index] = value.target.value;
    otpRef.current = newArr

    if(value && index < inputRefs.current.length-1){
      if (value.target.value !== ''){
        inputRefs.current[index + 1].focus()
      }
    }
    else if (value && index === inputRefs.current.length-1){
      if (value.target.value !== ''){
        if (loginParam.loginMode === 'sms') {
          loginSms({...loginParam, otp: otpRef.current.join('')})
            .then(res => {
              // login = res.code = 0
              // signup = res.code = 201

              if (res.code === -1){
                setErrorMessage(res.message)
                return
              }

              dispatch(setYingshiUserLoginParam({success: true}))
              if (res.code === 0) {
                onLogin()
              }
              if (res.code === 201) {
                onRegister()
              }
              inputRefs.current[inputRefs.current.length - 1].blur()
            })
        } else {
          loginEmail({...loginParam, otp: otpRef.current.join('')})
            .then(res => {
              // login = res.code = 0
              // signup = res.code = 201

              if (res.code === -1){
                setErrorMessage(res.message)
                return
              }

              dispatch(setYingshiUserLoginParam({success: true}))
              if (res.code === 0) {
                onLogin()
              }
              if (res.code === 201) {
                onRegister()
              }
              inputRefs.current[inputRefs.current.length - 1].blur()
            })
        }

      }
    }
  }

  return (
    <>
      {loginParam && loginParam.loginMode &&
        <Dialog open={open} handler={handler} className={'w-[500px] bg-[#121212] rounded-[28px] px-[85px] py-[25px] overflow-scroll'} size={'xs'}>
          <DialogBody className={'p-0 w-full h-full'}>
            <div className={'flex flex-col items-center]'}>
              <p className={'text-white font-semibold text-[20px] text-center mb-[54px]'}>输入验证码</p>

              <div className={'flex flex-col items-center'}>
                <p className={'text-white text-center font-medium font-[18px]'}>请输入 6 位数字，验证码已发送至</p>
                <p className={'text-shayuBlue text-center font-medium font-[18px]'}>{loginParam.loginMode === 'sms' ? `+${loginParam.phonecode} ${loginParam.phoneNumber}` : loginParam.email}</p>
              </div>

              <div className={'flex justify-between mt-[13px]'}>
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                  <OtpInput
                    key={index}
                    onKeyPress={(e) => handleBackspace(e, index)}
                    onChange={(e) => handleChange(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)
                    }
                    isError={!!errorMessage}
                  />
                ))}
              </div>
              {errorMessage && <p className={'text-[#FF1010] text-[13px] mb-[13px]'}>{errorMessage}</p>}
              {!errorMessage && <p className={'text-transparent text-[13px] mb-[13px]'}>placeholder</p>}

              <Button className={'bg-shayuBlue text-[15px] font-semibold normal-case'} disabled={countdownTimer > 0}>从新发送验证码 {countdownTimer > 0 && `${countdownTimer}s`}</Button>
            </div>
          </DialogBody>
        </Dialog>
      }
    </>

  )
}

const OtpInput = forwardRef(function OtpInput({onKeyPress, onChange, isError}, ref) {
    const colorClasses = isError ? `border border-[#FF1010] bg-[#FF10101A]` : `border border-transparent focus:border-[#0085E0]`

    return <input
      onKeyDown={onKeyPress}
      onChange={onChange}
      ref={ref}
      className={`w-[48px] h-[48px] rounded-[6px] bg-[#1D2023] text-[15px] text-center text-white font-bold outline-none ${colorClasses}`}
      maxLength={1}
      type={'tel'}
    />
  }
)
