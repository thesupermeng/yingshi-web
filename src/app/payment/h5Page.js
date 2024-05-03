'use client'

import styles from './style.module.css'
import PaymentHeader from '@/componentsH5/payment/paymentHeader';
import PaymentCountdown from '@/componentsH5/payment/paymentCountdown';
import PaymentProductsList from '@/componentsH5/payment/paymentProductsList';
import {Button} from '@material-tailwind/react';
import PaymentPurchaseButton from '@/componentsH5/payment/paymentPurchaseButton';
import PaymentDisclaimer from '@/componentsH5/payment/paymentDisclaimer';
import PaymentMethods from '@/componentsH5/payment/paymentMethods';
import {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from 'next/navigation';

const fakeProductList = [
  {
    'product_id': 14,
    'product_name': '1个月',
    'product_ref_name': 'yingshi vip (1 months)',
    'product_desc': '¥39/1个月',
    'product_promo_price': 0,
    'product_price': 39,
    'product_fake_price': 39,
    'product_android_product_id_sub': 'yingshi_4_fang',
    'product_android_product_id_sub_jcfa': 'yingshi_4_fang',
    'product_ios_product_id': 'yingshi_4_fang',
    'product_ios_apple_id': 'yingshi_4_fang',
    'product_value': 30,
    'payment_options': [
      {
        'payment_type_code': 'ALIPAY_H5',
        'payment_type_name': '支付宝',
        'payment_type_icon': 'https://test.yingshi.tv/static/images/payment/alipay-icon-lg.png',
        'payment_price': 0,
        'currency': ''
      },
      {
        'payment_type_code': 'ALIPAY_H5',
        'payment_type_name': '支付宝',
        'payment_type_icon': 'https://test.yingshi.tv/static/images/payment/alipay-icon-lg.png',
        'payment_price': 0,
        'currency': ''
      },
      {
        'payment_type_code': 'ALIPAY_H5',
        'payment_type_name': '支付宝',
        'payment_type_icon': 'https://test.yingshi.tv/static/images/payment/alipay-icon-lg.png',
        'payment_price': 0,
        'currency': ''
      },
      {
        'payment_type_code': 'ALIPAY_H5',
        'payment_type_name': '支付宝',
        'payment_type_icon': 'https://test.yingshi.tv/static/images/payment/alipay-icon-lg.png',
        'payment_price': 0,
        'currency': ''
      },
      ,
      {
        'payment_type_code': 'ALIPAY_H5',
        'payment_type_name': '支付宝',
        'payment_type_icon': 'https://test.yingshi.tv/static/images/payment/alipay-icon-lg.png',
        'payment_price': 0,
        'currency': ''
      }
    ],
    'product_status': '1',
    'currency': {
      'currency_id': 2,
      'currency_name': 'RMB',
      'currency_code': 'CNY',
      'currency_symbol': '¥'
    },
    'currency_id': 0,
    'product_purchase_type': 0,
    'product_sorting': 1
  },
  {
    'product_id': 6,
    'product_name': '3个月',
    'product_ref_name': 'yingshi vip (3 months)',
    'product_desc': '¥99/3个月',
    'product_promo_price': 0,
    'product_price': 99,
    'product_fake_price': 109,
    'product_android_product_id_sub': 'yingshi_4_fang',
    'product_android_product_id_sub_jcfa': 'yingshi_4_fang',
    'product_ios_product_id': 'yingshi_4_fang',
    'product_ios_apple_id': 'yingshi_4_fang',
    'product_value': 90,
    'payment_options': [
      {
        'payment_type_code': 'ALIPAY_H5',
        'payment_type_name': '支付宝',
        'payment_type_icon': 'https://test.yingshi.tv/static/images/payment/alipay-icon-lg.png',
        'payment_price': 0,
        'currency': ''
      }
    ],
    'product_status': '1',
    'currency': {
      'currency_id': 2,
      'currency_name': 'RMB',
      'currency_code': 'CNY',
      'currency_symbol': '¥'
    },
    'currency_id': 0,
    'product_purchase_type': 0,
    'product_sorting': 2
  },
  {
    'product_id': 15,
    'product_name': '6个月',
    'product_ref_name': 'yingshi vip (6 months)',
    'product_desc': '¥169/6个月',
    'product_promo_price': 0,
    'product_price': 169,
    'product_fake_price': 229,
    'product_android_product_id_sub': 'yingshi_4_fang',
    'product_android_product_id_sub_jcfa': 'yingshi_4_fang',
    'product_ios_product_id': 'yingshi_4_fang',
    'product_ios_apple_id': 'yingshi_4_fang',
    'product_value': 180,
    'payment_options': [
      {
        'payment_type_code': 'ALIPAY_H5',
        'payment_type_name': '支付宝',
        'payment_type_icon': 'https://test.yingshi.tv/static/images/payment/alipay-icon-lg.png',
        'payment_price': 0,
        'currency': ''
      }
    ],
    'product_status': '1',
    'currency': {
      'currency_id': 2,
      'currency_name': 'RMB',
      'currency_code': 'CNY',
      'currency_symbol': '¥'
    },
    'currency_id': 0,
    'product_purchase_type': 0,
    'product_sorting': 3
  },
  {
    'product_id': 7,
    'product_name': '12个月',
    'product_ref_name': 'yingshi vip (12 months)',
    'product_desc': '¥199/12个月',
    'product_promo_price': 0,
    'product_price': 199,
    'product_fake_price': 399,
    'product_android_product_id_sub': 'yingshi_4_fang',
    'product_android_product_id_sub_jcfa': 'yingshi_4_fang',
    'product_ios_product_id': 'yingshi_4_fang',
    'product_ios_apple_id': 'yingshi_4_fang',
    'product_value': 365,
    'payment_options': [
      {
        'payment_type_code': 'ALIPAY_H5',
        'payment_type_name': '支付宝',
        'payment_type_icon': 'https://test.yingshi.tv/static/images/payment/alipay-icon-lg.png',
        'payment_price': 0,
        'currency': ''
      }
    ],
    'product_status': '1',
    'currency': {
      'currency_id': 2,
      'currency_name': 'RMB',
      'currency_code': 'CNY',
      'currency_symbol': '¥'
    },
    'currency_id': 0,
    'product_purchase_type': 0,
    'product_sorting': 4
  }
]


export default function H5Page() {
  const router = useRouter()
  const [productSelected, setProductSelected] = useState(null)
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(null)

  return (
    <div className={'relative w-full'}>
      {/* background */}
      <div className={'w-full'}>
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
      </div>
      {/* content */}
      <div className={'flex flex-col items-center absolute top-0 left-0 w-full px-[29px] pb-[55px]'}>
        <FontAwesomeIcon icon={faTimes} style={{
          color:'white',
          width: '30px',
          height: '30px',
          position: 'absolute',
          top: '20px',
          left: '20px'
        }} onClick={()=> router.back()}/>
        <PaymentHeader/>
        <PaymentCountdown className={'mt-[21px] self-start'}/>
        <PaymentProductsList className={'mt-[20px]'} productList={fakeProductList} onProductSelect={(product) => setProductSelected(product)}/>
        <PaymentMethods className={'mt-[26px]'} paymentOptions={productSelected?.payment_options ?? []} onMethodSelect={(method) => setPaymentMethodSelected(method)}/>
        <PaymentDisclaimer className={'mt-[30px]'}/>
        <PaymentPurchaseButton className={'mt-[15px]'} productInfo={productSelected} paymentInfo={paymentMethodSelected}/>
      </div>
    </div>
  )
}
