import Image from 'next/image';
import {PaymentTitle, vipLightIcon} from '@/asset/icons';
import styles from './paymentHeader.module.css'

const benefits = [
  {
    icon: vipLightIcon,
    title: 'VIP尊贵标识',
  },
  {
    icon: vipLightIcon,
    title: '纯净广告',
  },
  {
    icon: vipLightIcon,
    title: '解锁全部影视内容',
  },
  {
    icon: vipLightIcon,
    title: '畅享离线下载',
  },
]

export default function PaymentHeader () {
  return (
    <div className={`flex flex-col w-full items-center pt-[100px]`}>
      <Image src={PaymentTitle} alt={'Title'} width={282} className={'mb-[32px]'}/>
      <Benefits benefits={benefits}/>
    </div>
  )
}

function SubHeader({className}) {
  return (
    <div className={`${styles.sub_header_container_color} px-[12px] py-[8px] mx-[23px] rounded-[10px] ${className}`}>
      <span className={'text-[#351B04] text-[14px] font-medium'}>升级解锁全部功能/内容 您还未开通 全部权益</span>
    </div>
  )
}

function BenefitItem({icon, title}) {
  return (
    <div className={'flex items-center gap-1'}>
      <Image src={icon} alt={`${title} icon`} width={24} height={24}/>
      <span className={'text-[14px] text-[#F4DBBA] font-normal'}>{title}</span>
    </div>
  )
}

function Benefits({benefits}) {
  return (
    <div className={`${styles.benefit_container_border} w-full`}>
      <div
        className={`relative flex flex-col items-center px-[20px] pb-[20px] pt-[30px]  rounded-xl ${styles.benefit_container_background_color}`}>
        <SubHeader className={'absolute top-0 -translate-y-1/2'}/>
        <div className={'grid grid-cols-2 w-full gap-y-1'}>
          {
            benefits.map((benefit, index) => <BenefitItem key={index} icon={benefit.icon} title={benefit.title}/>)
          }
        </div>
      </div>
    </div>

  )
}
