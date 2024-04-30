import {Button, Dialog, DialogBody} from '@material-tailwind/react';

export default function LogoutModal ({open, handler, onConfirm, onCancel}) {
  return (
    <Dialog open={open} handler={handler} className={'bg-[#121212] rounded-[28px] p-[30px]'} size={'xs'}>
      <DialogBody className={'p-0 w-full h-full'}>
        <div className={'flex flex-col gap-[16px] px-10 font-medium'}>
          <span className={'text-[17px] text-white text-center'}>退出登录</span>
          <span className={'text-[17px] text-white text-center'}>您是否确定要退出登录？</span>
          <div className={'flex flex-col py-[10px]'}>
            <Button className={'text-[15px] text-white bg-shayuBlue'} onClick={onConfirm}>确定</Button>
            <Button className={'text-[15px] text-[#9C9C9C] bg-transparent'} onClick={onCancel}>取消</Button>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  )
}
