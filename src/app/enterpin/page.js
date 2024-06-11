'use client';
import { forwardRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Stopwatch } from '@/asset/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  loginEmail,
  loginRequestEmailOtp,
  loginRequestSmsOtp,
  loginSms,
} from '@/services/yingshiUser';
import {
  setAhaToken,
  setYingshiUserLoginParam,
  setYingshiUserToken,
} from '@/store/yingshiUser';
import { useLoginSuccessOpen } from '@/hook/yingshiScreenState/useLoginSuccessOpen';
import PinHeader from './../../components/pinHeader';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import { YingshiApi, YingshiApi2 } from '@/util/YingshiApi';
import { URL_YINGSHI_VOD } from '@/config/yingshiUrl';
import { setUserInfo } from '@/store/user';
import {
  setShowLogin,
  setShowLoginSuccess,
  setShowPinSuccess,
} from '@/store/yingshiScreen';
// import { setsEqual } from 'chart.js/dist/helpers/helpers.core';
const totalCountdownTime = 60; // seconds

function formatPhoneNumber(phone) {
  const phoneStr = phone.toString();
  let formattedPhone;

  if (phoneStr.startsWith('+')) {
    const countryCode = phoneStr.slice(1, 4);
    const part1 = phoneStr.slice(4, 7);
    const part2 = phoneStr.slice(7, 11);
    formattedPhone = `+${countryCode} ${part1} ${part2}`;
  } else {
    const countryCode = phoneStr.slice(0, 3);
    const part1 = phoneStr.slice(3, 6);
    const part2 = phoneStr.slice(6, 10);
    formattedPhone = `+${countryCode} ${part1} ${part2}`;
  }

  return formattedPhone;
}

export default function EnterPin() {
  const router = useRouter();

  const [firstPin, setFirstPin] = useState('');
  const [secondPin, setSecondPin] = useState('');
  const [userContact, setUserContact] = useState('');

  // const [otp, setOtp] = useState('')

  let otpValue = '';
  //redux
  const dispatch = useDispatch();
  // const getLoginParam = (s) => s.yingshiUser.loginParam
  // const loginParam = useSelector(getLoginParam)
  const { userInfo } = useYingshiUser();

  // refs
  const timerRef = useRef(null);
  const inputRefs = useRef([]);
  const otpRef = useRef(new Array(6).fill(''));

  // state
  const [countdownTimer, setCountdownTimer] = useState(totalCountdownTime);
  const [errorMessage, setErrorMessage] = useState('');
  const [_, setOpenLoginSuccess] = useLoginSuccessOpen();

  //computed
  const minutes = Math.floor(countdownTimer / 60);
  const seconds = countdownTimer % 60;

  const handleResendOTP = () => {
    setCountdownTimer(totalCountdownTime);

    YingshiApi(
      URL_YINGSHI_VOD.setAhaWithdrawalPin,
      {
        pin: firstPin,
        otp: otp,
      },
      { method: 'POST' }
    );
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdownTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (inputRefs.current.length !== 0) {
      inputRefs.current[0].focus();
    }
  }, []);

  // useEffect(() => {
  //     if (!loginParam) router.push('/')
  // })

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const forgotPin = () => {
    router.replace('/setpin');
  };
  //      loginEmail({...loginParam, otp: otpRef.current.join('')})

  //  YingshiApi(URL_YINGSHI_VOD.homeGetNav, {}, { method: 'GET' });

  const handleChange = (value, index) => {
    setErrorMessage('');
    let newArr = [...otpRef.current];
    newArr[index] = value.target.value;
    otpRef.current = newArr;

    console.log('otpRef');
    console.log(otpRef);

    if (value && index < inputRefs.current.length - 1) {
      if (value.target.value !== '') {
        inputRefs.current[index + 1].focus();
      }
      console.log('value');
      console.log(value);
    } else if (value && index === inputRefs.current.length - 1) {
      //to do chatGPT

      let temp = otpRef.current.join('');
      if (temp != userInfo.aha_withdrawal_pin) {
        console.log('错误的PIN码');
        console.log(temp);
        console.log(userInfo.aha_withdrawal_pin);
        setErrorMessage('错误的PIN码');
        return;
      }

      dispatch(setShowPinSuccess(true));

      setTimeout(() => {
        dispatch(setShowPinSuccess(false));
      }, 2100);

      // todo
      // router.replace(`/myprofile`);
    }
  };

  return (
    // full width and full height

    <>
      <div className='mobile'>
        <PinHeader topicName={'安全PIN码'} />

        {/* <div style={{ height: '52px' }}></div> */}
      </div>

      <div
        style={{ marginTop: '52px' }}
        className={'w-screen flex flex-col align-center '}
      >
        <p className={'text-center text-[22px] mb-[13px] mt-[40px]'}>
          输入安全PIN码
        </p>

        <p className={'text-center text-[14px] mb-[26px] text-secondary'}>
          请输入您的安全PIN码以继续提款
        </p>

        <div className='otp-container'>
          <div className='otp-inputs'>
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <OtpInput
                key={index}
                onKeyPress={(e) => handleBackspace(e, index)}
                onChange={(e) => handleChange(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                isError={!!errorMessage}
              />
            ))}
          </div>
        </div>
        {errorMessage && (
          <p className={'text-[#FF1010] text-[13px] px-[32px] pt-2'}>
            {errorMessage}
          </p>
        )}
      </div>

      <div className={'w-screen flex flex-col align-center '}>
        <span
          onClick={(e) => {
            forgotPin();
          }}
          style={{ alignSelf: 'end', paddingRight: '35px', paddingTop: '20px' }}
          className={'text-secondary text-[14px]'}
        >
          忘记安全PIN码?
        </span>
      </div>
    </>
  );
}

const OtpInput = forwardRef(function OtpInput(
  { onKeyPress, onChange, isError },
  ref
) {
  return (
    <input
      onKeyDown={onKeyPress}
      onChange={onChange}
      ref={ref}
      className={`otp-input ${isError ? 'error' : ''}`}
      maxLength={1}
      type={'password'}
      pattern='[0-9]*'
      inputmode='numeric'
    />
  );
});
