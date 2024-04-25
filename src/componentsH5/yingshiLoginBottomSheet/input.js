import {useCallback, useState} from 'react';
import {CrossRed, TickBlue} from '@/asset/icons';
import Image from 'next/image';
import {debounce} from 'lodash';

export default function TextInput({name, placeholder, validator, onChange, errorMessage, isShowIcon, prefixText, inputType='text'}) {
    const [isError, setIsError] = useState(false);
    const [_value, _setValue] = useState(''); // for condition checking only

    const internalOnChange = useCallback((e) => {
        if (validator){
            if (!e.target.value) {
                setIsError(false)
            }
            else {
                const isValidInput = validator(e.target.value)

                if (!isValidInput){
                    setIsError(true)
                } else {
                    setIsError(false)
                }
            }
        }

        onChange(e);
        _setValue(e.target.value)
    }, [validator, onChange]);

    const debouncedOnChange = debounce(internalOnChange, 100)

    const inputBackground = isError ? 'bg-[#FF10101A] border border-[#FF1010]' : 'bg-[#1D2023]'

    const icon = isError ? CrossRed : TickBlue

    return (
        <div className='flex-col flex-1'>
            <div
                className={`h-[47px] px-[9px] py-[22px] rounded-[10px] flex items-center gap-[12px] ${inputBackground}`}
            >
                {prefixText &&
                    <span className={'text-white text-[15px] bg-transparent'}>{prefixText}</span>
                }
                <input
                    name={name}
                    placeholder={placeholder}
                    onChange={debouncedOnChange}
                    className={'text-white text-[15px] w-full bg-transparent'}
                    type={inputType}
                />
                {validator && // if validator exist
                    _value && // if value is not empty
                    isShowIcon && // prop
                <Image
                    src={icon}
                />}
            </div>
            {isError && <p className={'text-[13px] text-[#FF1010]'}>{errorMessage}</p>}
        </div>
    )
}