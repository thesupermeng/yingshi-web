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
          if (res.data.paymentData.url) {
            window.location.href = res.data.paymentData.url
          } else if (res.data.paymentData.html) {
            // Open a new tab/window
            const newTab = window.open('', '_self');
            // Write the HTML content into the new tab
            newTab.document.write(res.data.paymentData.html.replaceAll('\\', ''));
            newTab.document.close();
          }
        }
      })
      // .finally(() => {
      //   setIsPaymentProcessing(false)
      // })

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
