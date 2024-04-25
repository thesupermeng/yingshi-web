import Image from 'next/image';
import {CaretDown, CNFlag} from '@/asset/icons';
import TextInput from '@/componentsH5/yingshiLoginBottomSheet/input';
import {useEffect, useState} from 'react';
import {getCountryList} from '@/services/yingshiUser';
import {BottomSheet} from 'react-spring-bottom-sheet';

export default function CountryInput ({name, placeholder, validator, onChange, errorMessage, isShowIcon}) {
    const [countryList, setCountryList] = useState([]);
    const [chosenCountry, setChosenCountry] = useState(null);
    const [openCountry, setOpenCountry] = useState(false);

    useEffect(() => {
        getCountryList().then((result) => {
            setCountryList(result)
            setChosenCountry(result[0])
            onChange({target: {name: 'phonecode', value: result[0].country_phonecode}})
            onChange({target: {name: 'countryId', value: result[0].country_id}})
        })
    }, [])

    const prefix = chosenCountry ? `+${chosenCountry.country_phonecode}` : '+86'
    const flag = chosenCountry ? chosenCountry.country_flag : CNFlag;

    const handleClick = () => {
        setOpenCountry(true);
    }

    return (
        <div className={'flex gap-[14px]'}>
            <div className='flex px-[12px] py-[14px] gap-[10px] items-center bg-[#1D2023] rounded-[6px] w-fit' onClick={handleClick}>
                <Image src={flag} alt={'country flag'} width={20} height={20} />
                <Image src={CaretDown} alt={'more'}/>
            </div>
            <TextInput name={name} placeholder={placeholder} validator={validator} onChange={onChange}
                       errorMessage={errorMessage} isShowIcon={isShowIcon} prefixText={prefix}
                        inputType={'number'}
            />
            <BottomSheet open={openCountry} onDismiss={() => setOpenCountry(false)}>
                <p className={'text-xl text-center'}>选择国家电话代码</p>
                <div className={'flex flex-col '}>
                    {countryList && countryList.map(country => {
                        return <CountrySelectItem
                            country={country}
                            key={country.country_id}
                            onClick={(e) => {
                                onChange(e)
                                setChosenCountry(country)
                                setOpenCountry(false)
                            }}
                            isSelected={country.country_id === chosenCountry.country_id
                        }
                        />
                    })}
                </div>
            </BottomSheet>
        </div>
    )
}

function CountrySelectItem ({country, onClick, isSelected}) {
    const selectedStyles = isSelected ? 'bg-[#0085E01F]' : ''

    const handleOnClick = (e) => {
        const phonecodeEvent = {...e}
        phonecodeEvent.target.name = 'phonecode'
        phonecodeEvent.target.value = country.country_phonecode
        onClick(phonecodeEvent)

        const countryidEvent = {...e}
        countryidEvent.target.name = 'countryId'
        countryidEvent.target.value = country.country_id
        onClick(countryidEvent)
    }

    return (
        <div className={`flex gap-[15px] p-[12px] rounded-[6px] ${selectedStyles}`} onClick={handleOnClick} data-name={'test'}>
            <Image src={country.country_flag} alt={country.country_iso3} width={22} height={22} />
            <span className={'w-[45px]'}>+{country.country_phonecode}</span>
            <span className={'flex-1'}>{country.country_name}</span>
        </div>
    )
}