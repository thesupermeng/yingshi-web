import {BottomSheet} from 'react-spring-bottom-sheet';
import React, {useState} from 'react';
import {loginRequestEmailOtp} from '@/services/yingshiUser';
import TextInput from '@/componentsH5/yingshiLoginBottomSheet/input';

export default function YingshiLoginBottomSheet({visible, onDismiss}) {
    const [formData, setFormData] = useState({})

    const handleRegister = () => {
        console.log('register', formData)
        // loginRequestEmailOtp(formData).then(response => {
        //     if (response.error) {
        //         console.log(response.error)
        //     } else {
        //         console.log(response.message);
        //     }
        // })
    }

    const handleInput = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const isEmailValid = (value) => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(value)) {
            return false;
        }

        return true;
    }

    return (
        <BottomSheet
            onDismiss={onDismiss}
            open={visible}
            snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight / 0.6]}

        >
            <div className={'flex-col items-center'}>
                <p className={'text-xl text-center'}>注册/登录</p>
                <p className={'text-sm text-center text-[#9C9C9C]'}>登录后可管理您的账号，多端同步观看历史和收藏夹。</p>
                <div>
                    <div>
                        <button>手机号码</button>
                        <button>电邮地址</button>
                    </div>
                    <div className={'flex flex-col'}>
                        <TextInput
                            name="email"
                            placeholder={'输入邮箱账号'}
                            onChange={handleInput}
                            errorMessage={'电邮地址格式错误'}
                            validator={isEmailValid}
                            isShowIcon={true}
                        />
                        <TextInput
                            name="referralCode"
                            placeholder={'邀请码（选填）'}
                            onChange={handleInput}
                            isShowIcon={false}
                            />
                        {/*<input name={'email'} placeholder={'输入邮箱账号'} onChange={handleInput} className={'bg-[#1D2023]'}/>*/}
                        {/*<input name={'referralCode'} placeholder={'邀请码（选填）'} onChange={handleInput} className={'bg-[#1D2023]'}/>*/}
                        <button onClick={handleRegister}>注册</button>
                    </div>
                </div>
            </div>
        </BottomSheet>
    )
}
