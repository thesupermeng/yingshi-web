import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {Button, Dialog, DialogBody, IconButton} from '@material-tailwind/react';
import useYingshiUser from '@/hook/yingshiUser/useYingshiUser';
import {useState} from 'react';

export default function PaymentDetailModal({open, handler}) {
  const {userInfo} = useYingshiUser()
  const accumulatedDays = userInfo?.user_vip_time_duration_days ?? 0
  const amountPaid = userInfo?.paid_vip_response.history
    .filter(x => x.transaction_status === 1)
    .reduce((acc, curr) => acc + curr.product_price, 0)


  const [history, setHistory] = useState(Array.from({length: 33}, (_, index) => index + 1))
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  return (
    <Dialog open={open} handler={handler} className={'relative bg-[#121212] rounded-[28px] p-0 outline-none'}
            size={'sm'}
            dismiss={{
              outsidePress: false
            }}
    >
      <DialogBody className={'p-[38px] w-full h-full flex flex-col text-white items-center'}>
        <FontAwesomeIcon icon={faTimesCircle}
                         className={'absolute top-4 right-4 cursor-pointer w-[35px] h-[35px] text-[#FFFFFF33] hover-effect'}
                         onClick={handler}
        />
        <span className={'text-[28px] font-semibold'}>购买明细</span>
        <div className={'flex bg-[#1D2023] rounded-[20px] w-full px-[34px] py-[30px] mt-[28px]'}>
          <div className={'flex-1 flex flex-col'}>
            <span className={'text-[24px] font-semibold'}>{accumulatedDays}天</span>
            <span className={'text-[13px] text-[#9C9C9C]'}>累计VIP天数</span>
          </div>
          <div className={'flex-1 flex flex-col'}>
            <span className={'text-[24px] font-semibold'}>{amountPaid}</span>
            <span className={'text-[13px] text-[#9C9C9C]'}>购买总额（￥)</span>
          </div>
        </div>
        <div className={'flex flex-col bg-[#1D2023] rounded-[20px] w-full px-[18px] py-[6px] mt-[20px]'}>
          {
            history
              .slice(itemsPerPage * currentPage, (currentPage + 1) * itemsPerPage)
              .map((entry, idx) => {
              return <TransactionDetail key={idx} status={'+30天'} title={entry} date={'2023-01-01'}/>
            })
          }

        </div>
          <Pagination totalPages={10} onChange={(e) => {setCurrentPage(e - 1)}} className={'self-end'}/>
      </DialogBody>
    </Dialog>
)
}


function TransactionDetail ({title, date, status}) {
  return (
    <div className={'flex justify-between py-[8px]'}>
      <div className={'flex flex-col'}>
        <span className={'text-[14px]'}>{title}</span>
        <span className={'text-[12px] text-[#9C9C9C]'}>{date}</span>
      </div>
      <span className={'text-[16px] text-shayuBlue font-medium self-center'}>{status}</span>
    </div>
  )
}


export function Pagination({ totalPages, onChange, className }) {
  const [active, setActive] = useState(1);

  const handlePageChange = (page) => {
    setActive(page);
    if (onChange) {
      onChange(page);
    }
  };

  const getItemProps = (index) => ({
    variant: 'text',
    onClick: () => handlePageChange(index),
    className: `rounded p-0 font-bold ${
      active === index ? 'bg-blue-500 text-white' : 'text-gray-500'
    }`,
    size: 'sm'
  });

  const next = () => {
    if (active === totalPages) return;
    handlePageChange(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    handlePageChange(active - 1);
  };

  const renderPages = () => {
    const pages = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <IconButton key={i} {...getItemProps(i)}>
            {i}
          </IconButton>
        );
      }
    } else {
      if (active <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(
            <IconButton key={i} {...getItemProps(i)}>
              {i}
            </IconButton>
          );
        }
        pages.push(<span key="end-ellipsis" className="text-gray-500">...</span>);
        pages.push(
          <IconButton key={totalPages} {...getItemProps(totalPages)}>
            {totalPages}
          </IconButton>
        );
      } else if (active > totalPages - 4) {
        pages.push(
          <IconButton key={1} {...getItemProps(1)}>
            1
          </IconButton>
        );
        pages.push(<span key="start-ellipsis" className="text-gray-500">...</span>);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(
            <IconButton key={i} {...getItemProps(i)}>
              {i}
            </IconButton>
          );
        }
      } else {
        pages.push(
          <IconButton key={1} {...getItemProps(1)}>
            1
          </IconButton>
        );
        pages.push(<span key="start-ellipsis" className="text-gray-500">...</span>);
        for (let i = active - 1; i <= active + 1; i++) {
          pages.push(
            <IconButton key={i} {...getItemProps(i)}>
              {i}
            </IconButton>
          );
        }
        pages.push(<span key="end-ellipsis" className="text-gray-500">...</span>);
        pages.push(
          <IconButton key={totalPages} {...getItemProps(totalPages)}>
            {totalPages}
          </IconButton>
        );
      }
    }

    return pages;
  };

  // Do not render the pagination if there is only 1 page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={'flex items-center gap-2 p-1 ' + className}>
      <IconButton
        className="flex items-center gap-2 rounded text-gray-500 disabled:text-gray-700 bg-transparent"
        onClick={prev}
        disabled={active === 1}
        size={'sm'}
      >
        <FontAwesomeIcon icon={faChevronLeft} className={'h-4 w-4'}/>
      </IconButton>
      <div className="flex items-center gap-2">
        {renderPages()}
      </div>
      <IconButton
        className="flex items-center gap-2 rounded text-gray-500 disabled:text-gray-700 bg-transparent"
        onClick={next}
        disabled={active === totalPages}
        size={'sm'}
      >
        <FontAwesomeIcon icon={faChevronRight} className={'h-4 w-4'}/>
      </IconButton>
    </div>
  );
}
