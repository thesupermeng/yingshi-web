import React from 'react';

export default function PaymentDisclaimer({className}) {
  return (
    <div className={`text-[12px] text-[#9C9C9C] text-center ${className}`}>
      <p>
        <span>隐私协议</span>&nbsp;|&nbsp;
        <span>用户服务协议</span>&nbsp;|&nbsp;
        <span>自动续费协议</span>
      </p>
      <p>
        如遇支付问题，请联系
        <span><u>contact.movie9@gmail.com</u></span>
      </p>
    </div>

  );
}
