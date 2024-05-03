import {Button} from '@material-tailwind/react';
import styles from './styles.module.css'
import {useState} from 'react';
import {postPayOrder} from '@/services/yingshiPayment';

export default function PaymentPurchaseButton({productInfo, paymentInfo, className}) {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)


  const handleOnPurchase = () => {
    setIsPaymentProcessing(true)
    postPayOrder({ productId: productInfo.product_id, zfType: paymentInfo.payment_type_code })
      .then(res => {
        if (res.code === 0) {
          console.log('going to ',res.data.paymentData.url)
          window.open(res.data.paymentData.url, '_blank')
        }
      })
      .finally(() => {
        setIsPaymentProcessing(false)
      })

  }

  return (
    <>
      {productInfo &&
        <Button loading={isPaymentProcessing} className={`justify-center ${styles.payment_button} ${className}`} onClick={handleOnPurchase}>
        <span className={'text-[#1D2023] text-[19px] font-semibold'}>
          立即解锁 - 总额 {productInfo.currency.currency_symbol}{productInfo.product_price}
        </span>
        </Button>
      }
    </>
  )
}
