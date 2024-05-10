import {Alert, Button} from '@material-tailwind/react';
import {useRef, useState} from 'react';
import TextInput from '@/components/login/input';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import {submitFeedback} from '@/services/yingshiUser';

export default function FeedbackForm() {

  const {userInfo} = useYingshiUser()

  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState(userInfo?.user_email)

  const [isShowSuccess, setIsShowSuccess] = useState(false)

  const handleChange = (e) => {
    setFeedback(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const canSubmit = feedback.length > 0 && feedback.length <= 200 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)

  const handleSubmit = () => {
    submitFeedback({email, feedback}).then(()=> {
      setIsShowSuccess(true)
      setTimeout(() => {
        setIsShowSuccess(false)
      }, 1500)
      setFeedback('')
    })
  }

  return (
    <div className={'relative flex flex-col gap-[36px] w-full'}>
      {isShowSuccess &&
        <div className={'absolute w-full h-full top-0 left-0 px-20 flex items-center z-10'} onClick={() => setIsShowSuccess(false)}>
          <Alert className={'bg-green-500'}>
            反馈提交成功，我们会尽快审核你的留言</Alert>
        </div>
      }
      <div className={`relative flex flex-col gap-[36px] w-full ${isShowSuccess ? 'blur' : ''}`}>
        <span className={'text-[28px] font-semibold text-center text-white'}>我要反馈</span>
        <div className={'flex flex-col'}>
          <span className={'text-white text-[16px] font-semibold'}>电子邮箱</span>
          <div className={'mt-[14px] font-semibold'}>
            <TextInput
              name="email"
              placeholder={'输入邮箱账号'}
              onChange={handleEmailChange}
              errorMessage={'电邮地址格式错误'}
              validator={(value) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(value)}
              initValue={email}
            />
          </div>


          <span className={'text-white text-[16px] font-semibold mt-[20px]'}>个人信息</span>
          <div className={'flex bg-[#1D2023] rounded-[10px] px-[20px] py-[17px] mt-[14px] h-[176px]'}>
          <textarea className={'w-full h-full bg-inherit text-white font-semibold resize-none outline-none'}
                    placeholder={'请详细描述您的问题和建议'} onChange={handleChange} maxLength={200} value={feedback}/>
          </div>
          <span className={'self-end text-[#9C9C9C] mt-[14px]'}>{feedback.length}/200</span>
          <Button className={'w-[33%] bg-shayuBlue text-[17px] font-semibold text-white'}
                  disabled={!canSubmit} onClick={handleSubmit}>提交</Button>
        </div>
      </div>

    </div>
  )
}
