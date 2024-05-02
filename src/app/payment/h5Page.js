import styles from './style.module.css'
import PaymentHeader from '@/componentsH5/payment/paymentHeader';

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
      </div>
    </div>
  )
}
