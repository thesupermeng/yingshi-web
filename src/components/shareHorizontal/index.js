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
}) => {
  const { t } = useTranslation();

  return <div className={`flex space-x-4 items-center ${className}`}>
    <span>{t('分享')}:</span>

    <div className={`flex flex-1 space-x-2`}>
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
