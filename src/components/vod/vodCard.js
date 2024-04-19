import Image from "next/image"
import { useTranslation } from "react-i18next"
import { ArrowRightIcon } from "@/asset/icons";
import { convertTimeStampToDateTime } from "@/util/date";
import { ShareHorizontal } from '@/components/shareHorizontal';

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
    <div className="relative hidden lg:w-1/3 lg:flex rounded-xl">
      <img className="rounded-xl" src={imgSource} />
      <span className="absolute bottom-2 left-0 text-xs bg-black/50 rounded-r py-0.5 pr-0.5">{vodRemark}</span>
    </div>

    <div className="flex flex-col lg:w-2/3">
      <div className="flex flex-row">
        <span className="text-lg pr-5">{vodName}</span>
        <div className="lg:hidden flex flex-row space-x-2 py-1">
          <span className="text-sm text-white/75" style={{ fontWeight: '300' }}>{t('简介')}</span>
          <Image
            src={ArrowRightIcon}
            alt="Icon"
          />
        </div>
      </div>
      <span className="text-sm text-white/75 py-1 pt-3" style={{ fontWeight: '300' }}>{vodYear} {vodClass}</span>
      <span className="text-sm text-white/75 py-1" style={{ fontWeight: '300' }}>{t('更新')}: {_vodUpdateDate.year}-{_vodUpdateDate.month}-{_vodUpdateDate.day}</span>
      <div className="lg:flex hidden flex-row space-x-2 py-1">
        <span className="text-sm text-white/75" style={{ fontWeight: '300' }}>{t('简介')}</span>
        <Image
          src={ArrowRightIcon}
          alt="Icon"
        />
      </div>
      {/* H5 Share Horizontal */}
      <div className="lg:hidden flex">
        <ShareHorizontal
          className={'w-[90%]'}
        />
      </div>
    </div>
  </div>
}