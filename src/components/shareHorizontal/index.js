import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  whatsapp as WhatsappIcon,
  MessengerIcon,
  TelegramIcon,
  LineIcon,
  WechatIcon,
  CameraIcon,
  WeiboIcon,
  QqIcon,
  Facebook2Icon,
  CopyLink2Icon,
} from "@/asset/icons";

export const ShareHorizontal = ({
  className = '',
  setShowShareBox,
}) => {
  const { t } = useTranslation();

  const share = () => {
    setShowShareBox();
  }

  const closeShare = () => {
    setShowShareBox();
  }

  return <div className={`flex space-x-4 items-center ${className} m-0`}>
    
    <div className="lg:hidden flex">
      <span className="text-sm text-white/75 py-1" style={{ fontWeight: '300', color: '#9C9C9C' }}>{t('分享')}:</span>
    </div>
    <div className="lg:flex hidden">
      <span>{t('分享')}:</span>
    </div>

    <div className={`flex flex-1 space-x-2`} onClick={share} style={{ cursor: 'pointer' }}>
      <div className="">
        <Image
          width={ '3px' }
          src={WhatsappIcon}
          alt="Icon"
          style={{
            borderRadius: 999,
          }}
        />
      </div>
      <div className="">
        <Image
          src={MessengerIcon}
          alt="Icon"
        />
      </div>
      <div className="">
        <Image
          src={TelegramIcon}
          alt="Icon"
        />
      </div>
      <div className="">
        <Image
          src={LineIcon}
          alt="Icon"
        />
      </div>
      <div className="">
        <Image
          src={WechatIcon}
          alt="Icon"
        />
      </div>
      <div className="">
        <Image
          src={CameraIcon}
          alt="Icon"
        />
      </div>
      <div className="">
        <Image
          src={WeiboIcon}
          alt="Icon"
        />
      </div>
      <div className="">
        <Image
          src={QqIcon}
          alt="Icon"
        />
      </div>
      <div className="">
        <Image
          src={Facebook2Icon}
          alt="Icon"
        />
      </div>
      <div className="">
        <Image
          src={CopyLink2Icon}
          alt="Icon"
        />
      </div>
    </div>
  </div>
}
