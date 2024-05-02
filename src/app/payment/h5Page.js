import styles from './style.module.css'
import PaymentHeader from '@/componentsH5/payment/paymentHeader';
import PaymentCountdown from '@/componentsH5/payment/paymentCountdown';
import PaymentProductsList from '@/componentsH5/payment/paymentProductsList';
import {Button} from '@material-tailwind/react';
import PaymentPurchaseButton from '@/componentsH5/payment/paymentPurchaseButton';
import PaymentDisclaimer from '@/componentsH5/payment/paymentDisclaimer';

export default function H5Page() {
  return (
    <div className={'relative h-full w-full'}>
      {/* background */}
      <div className={'grid grid-rows-2 w-full h-full'}>
        <div className={'relative bg-[#14161A]'}>
          <video
            src={'./video/vip_background.mp4'}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className={'w-full h-full object-cover pb-1'}
          />
          <div
            className={styles.gradient_overlay + ' absolute top-0 left-0 w-full h-full'}
          />
        </div>
        <div className={'bg-[#14161A]'}></div>
      </div>
      {/* content */}
      <div className={'flex flex-col items-center absolute top-0 left-0 w-full h-full px-[29px]'}>
        <PaymentHeader/>
        <PaymentCountdown className={'mt-[21px]'}/>
        <PaymentProductsList className={'mt-[20px]'}/>
        <PaymentDisclaimer className={'mt-[30px]'}/>
        <PaymentPurchaseButton className={'mt-[15px]'}/>
      </div>
    </div>
  )
}
