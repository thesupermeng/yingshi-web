import {Button} from '@material-tailwind/react';
import styles from './styles.module.css'

export default function PaymentPurchaseButton ({productInfo, className}) {

  const handleOnPurchase = () => {
    console.log('Purchase clicked')
  }

  return (
    <Button className={`${styles.payment_button} ${className}`} onClick={handleOnPurchase}>
      <span className={'text-[#1D2023] text-[19px] font-semibold'}>
        立即解锁 - 总额¥9
      </span>
    </Button>
  )
}
