import {clear} from '@/asset/icons'
import Image from 'next/image';
import {useEffect, useState} from 'react';
import {Button, Dialog, DialogBody, Progress} from '@material-tailwind/react';
import {useRouter} from 'next/navigation';

const getObjectValue = (obj, targetKey) => {
  // Check if the object is defined and if it contains the 'times' key
  if (obj && obj.times && obj.times[targetKey]) {
    return obj.times[targetKey];
  } else {
    return 0; // Return null if the key is not found
  }
};

const secondsToHHMMSS = (seconds) => {
  // Convert seconds to integer
  seconds = parseInt(seconds);

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Format hours, minutes, and remaining seconds as HH:MM:SS
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  return formattedTime;
};

export default function HistoryPage() {

  const [watchHistoryList, setWatchHistoryList] = useState([]);
  const [openConfirmClearHistory, setOpenConfirmClearHistory] = useState(false);

  const router = useRouter();

  const handleOpenConfirmClearHistory = () => {
    setOpenConfirmClearHistory(x => !x)
  }

  const handleClearWatchHistory = () => {
    localStorage.removeItem('artplayer_settings');
    localStorage.removeItem('watchHistoryList');
    setWatchHistoryList([]);
  };

  useEffect(() => {
    let watchHistoryData = JSON.parse(
      localStorage.getItem('watchHistoryList')
    );
    let artPlayerData = JSON.parse(
      localStorage.getItem('artplayer_settings')
    );

    if (watchHistoryData !== null) {
      const updatedWatchHistoryData = watchHistoryData.map((item) => {
        const watchedTimes = getObjectValue(artPlayerData, item.vodurl);
        if (watchedTimes !== 0) {
          return { ...item, watchtimes: watchedTimes };
        } else {
          if (item.watchtimes !== 0) {
            return { ...item };
          } else {
            return { ...item, watchtimes: watchedTimes };
          }
        }
      });

      localStorage.setItem(
        'watchHistoryList',
        JSON.stringify(updatedWatchHistoryData)
      );
      setWatchHistoryList(
        JSON.parse(localStorage.getItem('watchHistoryList'))
      );
    }
  }, [])

  console.log(watchHistoryList)

  return (
    <div className={`flex-col gap-[36px] w-full ${watchHistoryList.length === 0 ? 'hidden' : 'flex'}`}>
      <ConfirmClearHistoryModal
        open={openConfirmClearHistory}
        handler={handleOpenConfirmClearHistory}
        onConfirm={() => {
          handleClearWatchHistory()
          setOpenConfirmClearHistory(false)
        }}
        onCancel={() => setOpenConfirmClearHistory(false)}
      />
      <div className={'relative flex justify-center items-center'}>
        <span className={'text-[28px] font-semibold text-center text-white'}>播放历史</span>
        <div className={'absolute right-0'}>
          <div
            className={`flex flex-row justify-center cursor-pointer`}
            onClick={() => {
              setOpenConfirmClearHistory(true);
            }}
          >
                <span
                  className="text-sm"
                  style={{color: 'rgba(156, 156, 156, 1)'}}
                >
                  清除记录
                </span>
            <Image className="mx-1" src={clear} alt="clear" width={10}/>
          </div>
        </div>
      </div>
      <div className={'flex flex-wrap justify-start gap-x-2'}>
        {
          watchHistoryList.map((vod, idx) => {
            return <HistoryCard key={idx} vod={vod} onClick={() => {
              router.push(
                `/play/${vod.tid}/${vod.nid}/${vod.vodid}`,
              );
            }}/>
          })
        }
      </div>
    </div>
  )
}

// {
//   "tid": "2",
//   "nid": 1,
//   "vodid": "201644",
//   "vodpic": "https://oss.yingshi.tv/images/vod/e5/e5d-e8-ca7.jpg",
//   "vodname": "超意神探(粤)",
//   "vodurl": "https://m3u.haiwaikan.com/xm3u8/49bcfa2efa367893f6700a82697fde24323fe367e803251207d0615eba053c719921f11e97d0da21.m3u8",
//   "watchtimes": 74.832744
// }


function HistoryCard ({vod, onClick}) {
  if (!vod) return null
  else {
    return (
      <div className={'flex flex-col w-[224px] mb-2 cursor-pointer hover:text-shayuBlue'} onClick={onClick}>
        <div className={'h-[126px] rounded-[12px] overflow-hidden relative mb-2'}>
          <Image src={vod.vodpic} alt={`Image for ${vod.vodname}`} fill={true} objectFit={'cover'}/>
          {/* add placeholder  */}
        </div>
        <span className={'hover:text-inherit text-[15px] mb-1'}>{vod.vodname}</span>
        <span className={'text-white text-[12px] mb-1'}>观看至 {secondsToHHMMSS(vod.watchtimes)}</span>
        <Progress value={10} size={'sm'} color={'blue'} className={'bg-[#FFFFFF38]'}/>
      </div>
    )
  }
}

function ConfirmClearHistoryModal ({open, handler, onConfirm, onCancel}) {
  return <Dialog open={open} handler={handler} className={'bg-[#121212] rounded-[28px] p-[30px]'} size={'xs'}>
    <DialogBody className={'p-0 w-full h-full'}>
      <div className={'flex flex-col gap-[16px] px-10 font-medium'}>
        <span className={'text-[17px] text-white text-center'}>清除提示</span>
        <span className={'text-[17px] text-white text-center'}>您确定要清空播放历史吗？？</span>
        <div className={'flex flex-col py-[10px]'}>
          <Button className={'text-[15px] text-white bg-shayuBlue'} onClick={onConfirm}>确定</Button>
          <Button className={'text-[15px] text-[#9C9C9C] bg-transparent'} onClick={onCancel}>取消</Button>
        </div>
      </div>
    </DialogBody>
  </Dialog>
}
