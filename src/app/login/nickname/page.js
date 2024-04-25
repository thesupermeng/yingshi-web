'use client'
import React, {useState} from 'react';

export default function Nickname () {

  const [nickname, setNickname] = useState('')

  const validator = (val) => {
    // check whether val is between 2 and 18 characters
    return val.length >= 2 && val.length <= 18;
  }

  const handleChange = (e) => {
    const val = e.target.value
    setNickname(val)
  }

  const handleConfirm = () => {
    console.log('nickname', nickname, canSubmit)
  }

  const canSubmit = validator(nickname)


  return (
    <div>
      <div className="desktop" style={{paddingTop: '100px', minHeight: '80vh'}}>
        WEB
      </div>
      <div className="mobile w-screen p-4">
        <div className={'flex flex-col items-center w-full px-[23px] pt-10'}>
          <p className={'text-[22px] text-center font-medium'}>输入属于您的昵称</p>
          <p className={'text-[14px] text-center mt-[23px]'}>请输入2-18个字符</p>

          <div className={'flex flex-col mt-[32px] w-full'}>
            <div className={'bg-[#1D2023] rounded-[10px] px-[20px] h-[48px] flex items-center'}>
              <input onChange={handleChange} className={'text-white text-[15px] outline-none bg-inherit w-full'}
                     maxLength={18}/>
            </div>
            <span className={'self-end text-[16px] text-[#9C9C9C] font-medium'}>{nickname.length}/18</span>
          </div>

          <button onClick={handleConfirm}
                  className={'enabled:text-white enabled:bg-shayuBlue disabled:text-[#9C9C9C] disabled:bg-[#1D2023] w-full rounded-[10px] py-3 mt-[32px] h-[48px]'}
                  disabled={!canSubmit}>
            确定
          </button>
        </div>
      </div>
    </div>

  )
}
