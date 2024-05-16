import {Dialog, DialogBody} from '@material-tailwind/react';
import PaymentHeader from '@/componentsH5/payment/paymentHeader';
import PaymentCountdown from '@/componentsH5/payment/paymentCountdown';
import {useEffect, useState} from 'react';
import {getYingshiProducts} from '@/services/yingshiPayment';
import PaymentProductsList from '@/componentsH5/payment/paymentProductsList';
import PaymentMethods from '@/componentsH5/payment/paymentMethods';
import PaymentDisclaimer from '@/componentsH5/payment/paymentDisclaimer';
import PaymentPurchaseButton from '@/componentsH5/payment/paymentPurchaseButton';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import PaymentDetailModal from '@/components/payment/paymentDetailModal';

export default function PaymentModal({open, handler}) {
  const {token} = useYingshiUser()
  const [productSelected, setProductSelected] = useState(null)
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(null)
  const [productList, setProductList] = useState([])
  const [showPaymentDetail, setShowPaymentDetail] = useState(false)

  const handleShowPaymentDetail = () => {
    setShowPaymentDetail(x => !x)
  }

  useEffect(() => {
    if (token){
      getYingshiProducts().then((res) => {
        if (res) setProductList(res['4_fang_items'])
      })
    }
  }, [token])

  return (
    <>
      <Dialog open={open} handler={handler} className={'relative bg-[#121212] rounded-[28px] p-0 outline-none'}
              size={'sm'}
              dismiss={{
                outsidePress: false
              }}
      >
        <DialogBody className={'p-[38px] w-full h-full flex flex-col'}>
          <FontAwesomeIcon icon={faTimesCircle}
            className={'absolute top-4 right-4 cursor-pointer w-[35px] h-[35px] text-[#FFFFFF33] hover-effect'}
            onClick={handler}
          />
          <PaymentHeader/>
          {/*<PaymentCountdown className={'mt-[28px]'}/>*/}
          <span className={'hover-effect text-[#9C9C9C] text-[14px] mt-[5px] self-end'} onClick={handleShowPaymentDetail}>VIP明细</span>
          <PaymentProductsList className={'mt-[5px]'} productList={productList} onProductSelect={(product) => setProductSelected(product)}/>
          <PaymentMethods className={'mt-[26px]'} paymentOptions={productSelected?.payment_options ?? []} onMethodSelect={(method) => setPaymentMethodSelected(method)}/>
          <PaymentDisclaimer className={'mt-[30px]'}/>
          <PaymentPurchaseButton className={'mt-[15px]'} productInfo={productSelected} paymentInfo={paymentMethodSelected}/>
        </DialogBody>
      </Dialog>

      <PaymentDetailModal open={showPaymentDetail} handler={handleShowPaymentDetail}/>
    </>
)
}
