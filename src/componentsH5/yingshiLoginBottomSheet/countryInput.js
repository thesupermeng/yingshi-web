import Image from 'next/image';
import {CaretDown, CNFlag} from '@/asset/icons';

export default function CountryInput () {
    const handleClick = () => {
        // TODO : another bottom sheet to choose country
    }

    return (
        <div className='flex px-[12px] py-[14px] gap-[10px] items-center bg-[#1D2023] rounded-[6px] w-fit' onClick={handleClick}>
            <Image src={CNFlag} alt={'country flag'} width={20} height={20} />
            <Image src={CaretDown} alt={'more'}/>
        </div>
    )
}
