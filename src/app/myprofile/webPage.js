import VipCard from '@/components/myprofile/VipCard';
import {FeedbackIconGrey, HistoryIconGrey, LogoutGrey, PersonIconGrey} from '@/asset/icons';
import NavCard from '@/components/myprofile/NavCard';


const navs = [
  {
    title: '个人中心',
    icon: PersonIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'web'
  },
  {
    title: '播放历史',
    icon: HistoryIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'web'
  },
  {
    title: '我要反馈',
    icon: FeedbackIconGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'web'
  },
  {
    title: '登出',
    icon: LogoutGrey,
    onClick: () => {},
    isSelected: false,
    platform: 'web'
  },
]

export default function WebPage () {

  return (
    <div className={'grid grid-cols-4 px-[110px]'}>
        <div className={'w-full'}>
          <VipCard/>
          {navs.map((nav, index) => {
            return <NavCard key={index} {...nav}/>
          })
          }
        </div>

    </div>
  )
}
