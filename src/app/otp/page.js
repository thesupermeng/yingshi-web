'use client'
import {forwardRef, useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {Stopwatch} from '@/asset/icons';

export default function OTP () {

    const timerRef = useRef(null);

    const [countdownTimer, setCountdownTimer] = useState(60);
    const minutes = Math.floor(countdownTimer / 60);
    const seconds = countdownTimer % 60;
    const inputRefs = useRef([])
    const [otp, setOtp] = useState(new Array(6).fill(''));

    const handleResendOTP = () => {
        // TODO implement resend otp
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


    const handleBackspace = (e, index) => {
        if(e.key === 'Backspace' && !e.target.value && index > 0){
            inputRefs.current[index - 1].focus()
        }
    }


    const handleChange = (value, index) => {
        let newArr = [...otp];
        newArr[index] = value;
        setOtp(newArr);

        if(value && index < inputRefs.current.length-1){
            if (value.target.value !== ''){
                inputRefs.current[index + 1].focus()
            }
        }
        else if (value && index === inputRefs.current.length-1){
            if (value.target.value !== ''){
                // TODO: implement submit login
                console.log('implement submit login')
            }
        }
    }

    return (
        // full width and full height
        <>
            <div className={'h-screen w-screen flex flex-col align-center absolute bg-red'}>
                <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>输入邮箱验证码</p>
                <p className={'text-center text-[14px]'}>验证码已发送至 abc123@gmail.com</p>
                <p className={'text-center text-[14px] mb-[26px]'}>如果没有收到邮件，请检查垃圾邮箱</p>
                <div className={'flex justify-between px-[32px]'}>
                    {[1,2,3,4,5,6].map((item, index) => (
                        <OtpInput
                            key={index}
                            onKeyPress={(e) => handleBackspace(e, index)}
                            onChange={(e) => handleChange(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)
                            }
                        />
                    ))}
                </div>
                <div className={'flex my-12 justify-center'}>
                    {countdownTimer === 0 &&
                        <button className={'text-[17px] font-semibold text-[#0085E0]'} onClick={handleResendOTP}>重新发送验证码</button>
                    }
                    {countdownTimer !== 0 &&
                        <div className={'flex gap-[3px] justify-center items-center'}>
                            <Image src={Stopwatch} width={26} height={26} alt={'timer icon'}/>
                            <span
                                className={'text-[#9C9C9C] font-semibold w-[50px]'}>
                            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                        </span>
                        </div>
                    }
                </div>

            </div>
        </>

    )
}

const OtpInput = forwardRef(function OtpInput({onKeyPress, onChange}, ref) {
        return <input
            onKeyUp={onKeyPress}
            onChange={onChange}
            ref={ref}
            className={'w-[53px] h-[53px] rounded-[10px] bg-[#1D2023] text-[30px] border border-transparent focus:border-[#0085E0] text-center outline-none'}
            maxLength={1}
        />
    }
)
