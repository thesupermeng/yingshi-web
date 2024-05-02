import {Button} from '@material-tailwind/react';
import styles from './paymentPurchaseButton.module.css'

export default function PaymentPurchaseButton ({className}) {
  return (
    <Button className={`${styles.payment_button} ${className}`} >
      <span className={'text-[#1D2023] text-[19px] font-semibold'}>
        立即解锁 - 总额¥9
      </span>
    </Button>
  )
}
