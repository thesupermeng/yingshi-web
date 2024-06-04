'use client'
import { forwardRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Stopwatch } from '@/asset/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginEmail, loginRequestEmailOtp, loginRequestSmsOtp, loginSms } from '@/services/yingshiUser';
import { setAhaToken, setYingshiUserLoginParam, setYingshiUserToken } from '@/store/yingshiUser';
import { useLoginSuccessOpen } from '@/hook/yingshiScreenState/useLoginSuccessOpen';
import TopicHeader from './../../components/topicHeader';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
const totalCountdownTime = 60 // seconds

export default function OTP() {
    const router = useRouter()


    const [firstPin, setFirstPin] = useState('')
    let secondPin = '';


    //redux
    const dispatch = useDispatch()
    // const getLoginParam = (s) => s.yingshiUser.loginParam
    // const loginParam = useSelector(getLoginParam)
    const { userInfo } = useYingshiUser()


    const [resetMode, setResetMode] = useState(null) // setpin | resetpin

    useEffect(() => {

        if (userInfo.aha_withdrawal_pin == 0) {
            setResetMode('setpin')
        }
        else {
            setResetMode('resetpin')
        }
    }, [])




    // refs
    const timerRef = useRef(null);
    const inputRefs = useRef([])
    const otpRef = useRef(new Array(6).fill(''))

    // state
    const [countdownTimer, setCountdownTimer] = useState(totalCountdownTime);
    const [errorMessage, setErrorMessage] = useState('')
    const [_, setOpenLoginSuccess] = useLoginSuccessOpen()

    //computed
    const minutes = Math.floor(countdownTimer / 60);
    const seconds = countdownTimer % 60;

    const handleResendOTP = () => {
        setCountdownTimer(totalCountdownTime)
        if (loginParam.loginMode === 'sms') {
            loginRequestSmsOtp(loginParam)
        } else {
            loginRequestEmailOtp(loginParam)

        }
    }



    const resetCountDownHandler = () => {
        setCountdownTimer(totalCountdownTime)
    }

    useEffect(() => {

        timerRef.current = setInterval(() => {
            setCountdownTimer(prev => Math.max(0, prev - 1))
        }, 1000)

        return () => {
            clearInterval(timerRef.current)
        }

    }, [])



    useEffect(() => {
        if (inputRefs.current.length !== 0) {
            inputRefs.current[0].focus()
        }
    }, [])

    // useEffect(() => {
    //     if (!loginParam) router.push('/')
    // })


    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }


    const handleChange = (value, index) => {
        setErrorMessage('')
        let newArr = [...otpRef.current];
        newArr[index] = value.target.value;
        otpRef.current = newArr

        console.log("otpRef")
        console.log(otpRef)

        if (value && index < inputRefs.current.length - 1) {
            if (value.target.value !== '') {
                inputRefs.current[index + 1].focus()
            }
            console.log("value")
            console.log(value)
        }
        else if (value && index === inputRefs.current.length - 1) {
            //to do chatGPT 
            // reset otpRef 

            if (value.target.value !== '' ||secondPin == '' ) {
                if (firstPin == '') {
             
                    let temp = otpRef.current.join('');
                    setFirstPin(temp)
                    otpRef.current = new Array(6).fill('');
                    inputRefs.current.forEach(input => {
                        input.value = '';
                    });
                    inputRefs.current[0].focus();
                    return
                }

                console.log("second pin ")
                secondPin = otpRef.current.join('');
                console.log("firstPin")
                console.log(firstPin)
                console.log("secondPin")
                console.log(secondPin)
                //      loginEmail({...loginParam, otp: otpRef.current.join('')})


            }
        }
    }
    return (
        // full width and full height


        <>


            <div className='mobile'>
                <TopicHeader topicName={'安全PIN码'} />

                <div style={{ height: '52px' }}></div>

            </div>


            {(resetMode == 'setpin' || resetMode == 'resetpin') &&
                <div className={'w-screen flex flex-col align-center '}>
                    {resetMode == 'setpin' && <>
                        {firstPin == '' &&
                            <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>设置安全PIN码</p>
                        }
                        {firstPin != '' &&
                            <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>确认安全PIN码</p>
                        }
                        <p className={'text-center text-[14px] mb-[26px] text-secondary'}>请输入6位数字的安全PIN码, 以保障您的交易安全</p>
                    </>
                    }
                    {resetMode == 'resetpin' && <>
                        <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>修改安全PIN码</p>
                        <p className={'text-center text-[14px] mb-[26px] text-secondary'}>请输入6位数字的安全PIN码, 以保障您的交易安全</p>
                    </>
                    }
                    <div className={'flex justify-between px-[32px]'}>
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
                    {errorMessage && <p className={'text-[#FF1010] text-[13px] px-[32px]'}>{errorMessage}</p>}
                    <div className={'flex my-12 justify-center'}>
                        {countdownTimer === 0 &&
                            <button className={'text-[17px] font-semibold text-[#0085E0]'}
                                onClick={handleResendOTP}>重新发送验证码</button>
                        }
                        {countdownTimer !== 0 &&
                            <div className={'flex gap-[3px] justify-center items-center'}>
                                <Image src={Stopwatch} width={26} height={26} alt={'timer icon'} />
                                <span
                                    className={'text-[#9C9C9C] font-semibold w-[50px]'}>
                                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                                </span>
                            </div>
                        }
                    </div>

                </div>
            }



            {/* otp here  */}
            {resetMode == 'otp' &&
                <div className={'w-screen flex flex-col align-center '}>
                    {resetMode === 'setpin' && <>
                        <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>输入邮箱验证码</p>
                        <p className={'text-center text-[14px]'}>验证码已发送至 <span
                            className={'text-[#0085E0]'}> email 1111 </span></p>
                        <p className={'text-center text-[14px] mb-[26px]'}>如果没有收到邮件，请检查垃圾邮箱</p>
                    </>
                    }
                    {resetMode === 'resetpin' && <>
                        <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>输入OTP验证码</p>
                        <p className={'text-center text-[14px] mb-[26px]'}>
                            验证码已发送至 <span className={'text-[#0085E0]'}>+phone 11111</span>
                        </p>
                    </>
                    }
                    <div className={'flex justify-between px-[32px]'}>
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
                    {errorMessage && <p className={'text-[#FF1010] text-[13px] px-[32px]'}>{errorMessage}</p>}
                    <div className={'flex my-12 justify-center'}>
                        {countdownTimer === 0 &&
                            <button className={'text-[17px] font-semibold text-[#0085E0]'}
                                onClick={handleResendOTP}>重新发送验证码</button>
                        }
                        {countdownTimer !== 0 &&
                            <div className={'flex gap-[3px] justify-center items-center'}>
                                <Image src={Stopwatch} width={26} height={26} alt={'timer icon'} />
                                <span
                                    className={'text-[#9C9C9C] font-semibold w-[50px]'}>
                                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                                </span>
                            </div>
                        }
                    </div>

                </div>
            }
        </>

    )
}

const OtpInput = forwardRef(function OtpInput({ onKeyPress, onChange, isError }, ref) {
    const colorClasses = isError ? `border border-[#FF1010] bg-[#FF10101A]` : `border border-transparent focus:border-[#0085E0]`

    return <input
        onKeyDown={onKeyPress}
        onChange={onChange}
        ref={ref}
        className={`w-[53px] h-[53px] aspect-square min-w-[35px] rounded-[10px] bg-[#1D2023] text-[30px] text-center outline-none ${colorClasses}`}
        maxLength={1}
        type={'password'}
    />
}
)


const OtpInputNum = forwardRef(function OtpInput({ onKeyPress, onChange, isError }, ref) {
    const colorClasses = isError ? `border border-[#FF1010] bg-[#FF10101A]` : `border border-transparent focus:border-[#0085E0]`

    return <input
        onKeyDown={onKeyPress}
        onChange={onChange}
        ref={ref}
        className={`w-[53px] h-[53px] aspect-square min-w-[35px] rounded-[10px] bg-[#1D2023] text-[30px] text-center outline-none ${colorClasses}`}
        maxLength={1}
        type={'te4l'}
    />
}
)