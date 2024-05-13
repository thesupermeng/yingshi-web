import {Dialog, DialogBody} from '@material-tailwind/react';
import PaymentHeader from '@/componentsH5/payment/paymentHeader';
import PaymentCountdown from '@/componentsH5/payment/paymentCountdown';
import {useEffect, useState} from 'react';
import {getYingshiProducts} from '@/services/yingshiPayment';
import PaymentProductsList from '@/componentsH5/payment/paymentProductsList';
import PaymentMethods from '@/componentsH5/payment/paymentMethods';
import PaymentDisclaimer from '@/componentsH5/payment/paymentDisclaimer';
import PaymentPurchaseButton from '@/componentsH5/payment/paymentPurchaseButton';

export default function PaymentModal({open, handler}) {
  const [productSelected, setProductSelected] = useState(null)
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(null)

  const [productList, setProductList] = useState([])

  useEffect(() => {
    getYingshiProducts().then((res) => {
      setProductList(res['4_fang_items'])
    })
  }, [])

  return (
    <Dialog open={open} handler={handler} className={'bg-[#121212] rounded-[28px] p-[38px] outline-none'}
            size={'sm'}>
      <DialogBody className={'p-0 w-full h-full'}>
        <PaymentHeader/>
        <PaymentCountdown className={'mt-[28px]'}/>
        <PaymentProductsList className={'mt-[20px]'} productList={productList} onProductSelect={(product) => setProductSelected(product)}/>
        <PaymentMethods className={'mt-[26px]'} paymentOptions={productSelected?.payment_options ?? []} onMethodSelect={(method) => setPaymentMethodSelected(method)}/>
        <PaymentDisclaimer className={'mt-[30px]'}/>
        <PaymentPurchaseButton className={'mt-[15px]'} productInfo={productSelected} paymentInfo={paymentMethodSelected}/>
      </DialogBody>
    </Dialog>)
}
