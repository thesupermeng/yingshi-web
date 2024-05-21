'use client'
import { forwardRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Stopwatch } from '@/asset/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginEmail, loginRequestEmailOtp, loginRequestSmsOtp, loginSms } from '@/services/yingshiUser';
import { setAhaToken, setYingshiUserLoginParam, setYingshiUserToken } from '@/store/yingshiUser';
import { useLoginSuccessOpen } from '@/hook/yingshiScreenState/useLoginSuccessOpen';

const totalCountdownTime = 60 // seconds

export default function OTP() {
    const router = useRouter()

    //redux
    const dispatch = useDispatch()
    const getLoginParam = (s) => s.yingshiUser.loginParam
    const loginParam = useSelector(getLoginParam)


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
        if (inputRefs.current.length !== 0) {
            inputRefs.current[0].focus()
        }
    }, [])

    useEffect(() => {
        if (!loginParam) router.push('/')
    })


    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }


    const handleTikTokPixelEvent = (res) => {
        const userData = {
            uniqueID: res?.data?.user?.user_id,
            phoneNumber: res?.data?.user?.user_phone,
            email: res?.data?.user?.user_email,
        }
        const hashedEmail = userData.email ? CryptoJS.SHA256(userData.email).toString(CryptoJS.enc.Hex) : '';
        const hashedPhoneNumber = (userData.phoneNumber && userData.phoneNumber !== '0')
            ? CryptoJS.SHA256(userData.phoneNumber).toString(CryptoJS.enc.Hex)
            : '';
        const hashedExternalID = userData.uniqueID ? CryptoJS.SHA256(userData.uniqueID).toString(CryptoJS.enc.Hex) : '';

        const identifyPayload = {};
        if (hashedEmail) identifyPayload.email = hashedEmail;
        if (hashedPhoneNumber) identifyPayload.phone_number = hashedPhoneNumber;
        if (hashedExternalID) identifyPayload.external_id = hashedExternalID;

        // Identify the user
        if (Object.keys(identifyPayload).length > 0) {
            console.log('Identifying user with:', identifyPayload); // Debug log
            window.ttq.identify(identifyPayload);
        }

        // Track the CompleteRegistration event
        const trackPayload = {
            email: hashedEmail,
            phone_number: hashedPhoneNumber,
            external_id: hashedExternalID,
        };

        console.log('Tracking CompleteRegistration with:', trackPayload); // Debug log
        window.ttq.track('CompleteRegistration', trackPayload);

        // Log the status of the tracking
        try {
            window.ttq.track('CompleteRegistration', trackPayload);
            console.log('Tracking CompleteRegistration succeeded.');
        } catch (error) {
            console.error('Tracking CompleteRegistration failed:', error);
        }
    };


    const handleChange = (value, index) => {
        setErrorMessage('')
        let newArr = [...otpRef.current];
        newArr[index] = value.target.value;
        otpRef.current = newArr

        if (value && index < inputRefs.current.length - 1) {
            if (value.target.value !== '') {
                inputRefs.current[index + 1].focus()
            }
        }
        else if (value && index === inputRefs.current.length - 1) {
            if (value.target.value !== '') {
                if (loginParam.loginMode === 'sms') {
                    loginSms({ ...loginParam, otp: otpRef.current.join('') })
                        .then(res => {
                            // login = res.code = 0
                            // signup = res.code = 201

                            if (res.code === -1) {
                                setErrorMessage(res.message)
                                return
                            }
                            handleTikTokPixelEvent(res)
                            dispatch(setYingshiUserLoginParam({ ...loginParam, success: true }))
                            dispatch(setYingshiUserToken(res.data.access_token))
                            dispatch(setAhaToken(res.data.aha_token))
                            if (res.code === 0) {



                                //signup
                                // router.push('/myprofile')
                                router.back()
                                setOpenLoginSuccess(true)
                                setTimeout(() => {
                                    setOpenLoginSuccess(false)
                                }, 2000)


                            }
                            if (res.code === 201) {



                                //login
                                // router.push('/login/nickname') // remove nickname page from the signup flow
                                // router.push('/myprofile')
                                router.back()
                                setOpenLoginSuccess(true)
                                setTimeout(() => {
                                    setOpenLoginSuccess(false)
                                }, 2000)

                            }
                        })
                } else {
                    loginEmail({ ...loginParam, otp: otpRef.current.join('') })
                        .then(res => {
                            // login = res.code = 0
                            // signup = res.code = 201

                            if (res.code === -1) {
                                setErrorMessage(res.message)
                                return
                            }
                            handleTikTokPixelEvent(res)
                            dispatch(setYingshiUserLoginParam({ ...loginParam, success: true }))
                            dispatch(setYingshiUserToken(res.data.access_token))
                            dispatch(setAhaToken(res.data.aha_token))
                            if (res.code === 0) {
                                //signup
                                // router.push('/myprofile')
                                router.back()
                                setOpenLoginSuccess(true)
                                setTimeout(() => {
                                    setOpenLoginSuccess(false)
                                }, 2000)
                            }
                            if (res.code === 201) {
                                //login
                                // router.push('/login/nickname') // remove nickname page from the signup flow
                                // router.push('/myprofile')
                                router.back()
                                setOpenLoginSuccess(true)
                                setTimeout(() => {
                                    setOpenLoginSuccess(false)
                                }, 2000)
                            }

                        })
                }



            }
        }
    }
    return (
        // full width and full height
        <>
            {loginParam && loginParam.loginMode &&
                <div className={'w-screen flex flex-col align-center absolute'}>
                    {loginParam.loginMode === 'email' && <>
                        <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>输入邮箱验证码</p>
                        <p className={'text-center text-[14px]'}>验证码已发送至 <span
                            className={'text-[#0085E0]'}>{loginParam.email}</span></p>
                        <p className={'text-center text-[14px] mb-[26px]'}>如果没有收到邮件，请检查垃圾邮箱</p>
                    </>
                    }
                    {loginParam.loginMode === 'sms' && <>
                        <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>输入OTP验证码</p>
                        <p className={'text-center text-[14px] mb-[26px]'}>
                            验证码已发送至 <span className={'text-[#0085E0]'}>+{loginParam.phonecode} {loginParam.phoneNumber}</span>
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
        type={'tel'}
    />
}
)
