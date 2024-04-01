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

export const ShareHorizontal = () => {
  const { t } = useTranslation();

  return <div className={`flex space-x-4 items-center`}>
    <span>{t('share')}:</span>

    <div className={`flex space-x-4`}>
      <Image
        className={``}
        src={WhatsappIcon}
        alt="Icon"
        style={{
          borderRadius: 999,
        }}
      />
      <Image
        className={``}
        src={MessengerIcon}
        alt="Icon"
      />
      <Image
        className={``}
        src={TelegramIcon}
        alt="Icon"
      />
      <Image
        className={``}
        src={LineIcon}
        alt="Icon"
      />
      <Image
        className={``}
        src={WechatIcon}
        alt="Icon"
      />
      <Image
        className={``}
        src={CameraIcon}
        alt="Icon"
      />
      <Image
        className={``}
        src={WeiboIcon}
        alt="Icon"
      />
      <Image
        className={``}
        src={QqIcon}
        alt="Icon"
      />
      <Image
        className={``}
        src={Facebook2Icon}
        alt="Icon"
      />
      <Image
        className={``}
        src={CopyLink2Icon}
        alt="Icon"
      />
    </div>
  </div>
}
