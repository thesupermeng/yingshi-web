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
    <span>{t('share')}:</span>

    <div className={`flex flex-1 space-x-2`}>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={WhatsappIcon}
          alt="Icon"
          style={{
            borderRadius: 999,
          }}
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={MessengerIcon}
          alt="Icon"
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={TelegramIcon}
          alt="Icon"
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={LineIcon}
          alt="Icon"
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={WechatIcon}
          alt="Icon"
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={CameraIcon}
          alt="Icon"
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={WeiboIcon}
          alt="Icon"
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={QqIcon}
          alt="Icon"
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={Facebook2Icon}
          alt="Icon"
        />
      </div>
      <div className="flex-1 min-w-[30px]">
        <Image
          src={CopyLink2Icon}
          alt="Icon"
        />
      </div>
    </div>
  </div>
}
