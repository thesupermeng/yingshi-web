import Image from "next/image"
import { useTranslation } from "react-i18next"
import { ArrowRightIcon } from "@/asset/icons";
import { convertTimeStampToDateTime } from "@/util/date";

export const VodCard = ({
  imgSource,
  vodName,
  vodUpdateDate,
  vodYear,
  vodClass,
  vodRemark,
}) => {
  const { t } = useTranslation();

  const _vodUpdateDate = convertTimeStampToDateTime(vodUpdateDate);


  return <div className="flex flex-row space-x-4">
    <div className="relative w-1/3 rounded-xl">
      <img className="rounded-xl" src={imgSource} />
      <span className="absolute bottom-2 left-0 text-xs bg-black/50 rounded-r py-0.5 pr-0.5">{vodRemark}</span>
    </div>

    <div className="flex flex-col w-2/3">
      <span className="text-lg">{vodName}</span>
      <span className="text-white/75">{t('update')}: {_vodUpdateDate.year}-{_vodUpdateDate.month}-{_vodUpdateDate.day}</span>
      <span className="text-white/75">{vodYear} {vodClass}</span>
      <div className="flex flex-row space-x-2">
        <span className="text-white/75">{t('introduction')}</span>
        <Image
          src={ArrowRightIcon}
          alt="Icon"
        />
      </div>
    </div>
  </div>
}