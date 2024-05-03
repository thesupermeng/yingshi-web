import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import styles from './styles.module.css'
import {AlipayIcon, CreditCardPayIcon, VisaMasterAmex, WechatPayIcon} from '@/asset/icons';

export default function PaymentMethods({className, paymentOptions, onMethodSelect}) {
  const [selectedMethod, setSelectedMethod] = useState(0);

  useEffect(() => {
    onMethodSelect(paymentOptions[0])
    setSelectedMethod(0)
  }, [paymentOptions])

  return (
    <div className={`flex flex-col w-full gap-4 ${className}`}>
      <p className={'text-[#D3AC7B] text-[20px] font-semibold'}>支付方式</p>
      <div className={'flex flex-col gap-3 w-full'}>
        {paymentOptions.map((option, index) => {
          return (
            <Method
              key={index}
              icon={option.payment_type_icon}
              isSelected={selectedMethod === index}
              onClick={() => {
                setSelectedMethod(index)
                onMethodSelect(option)
              }}
            >
              {option.payment_type_name}
            </Method>
          )
        })
        }

        {/*<Method icon={CreditCardPayIcon} onClick={() => setSelectedMethod(2)}*/}
        {/*  isSelected={selectedMethod === 2}*/}
        {/*>*/}
        {/*  <div className={'flex'}>*/}
        {/*    行用卡支付 <Image src={VisaMasterAmex} alt={'Visa Master Amex icon'} className={'ml-2'}/>*/}
        {/*  </div>*/}
        {/*</Method>*/}
      </div>
    </div>
  );
}

function Method({children, icon, isSelected, onClick}) {
  return (
    <div className={`w-full flex items-center rounded-[8px] gap-[10px] px-4 py-3 ${isSelected? 'border border-[#D3AC7B]': ''} ${styles.payment_method_background}`}
      onClick={onClick}
    >
      <Image src={icon} alt={'payment icon'} width={46} height={32}/>
      <span className={'flex-1 text-white text-[16px] font-medium'}>{children}</span>
      {isSelected &&
        <div className={`rounded-full w-[16px] h-[16px] flex items-center justify-center ${styles.payment_method_select_outer}`}>
          <div className={`rounded-full w-[10px] h-[10px] ${styles.payment_method_select_inner}`}/>
        </div>
      }
    </div>
  );
}

