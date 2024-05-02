import React from 'react';

export default function PaymentDisclaimer({className}) {

  const handleClickPrivacy = () => {
    console.log('Privacy clicked')
  }

  const handleClickService = () => {
    console.log('Service clicked')
  }

  const handleClickAutoRenew = () => {
    console.log('Renewal clicked')
  }

  const handleClickEmail = () => {
    console.log('Email clicked')
  }

  return (
    <div className={`text-[12px] text-[#9C9C9C] text-center ${className}`}>
      <p>
        <span onClick={handleClickPrivacy}>隐私协议</span>&nbsp;|&nbsp;
        <span onClick={handleClickService}>用户服务协议</span>&nbsp;|&nbsp;
        <span onClick={handleClickAutoRenew}>自动续费协议</span>
      </p>
      <p>
        如遇支付问题，请联系
        <span onClick={handleClickEmail}><u>contact.movie9@gmail.com</u></span>
      </p>
    </div>

  );
}
