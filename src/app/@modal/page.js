'use client'

import 'react-spring-bottom-sheet/dist/style.css'
import YingshiLoginBottomSheet from '@/componentsH5/yingshiLoginBottomSheet';
import {useLoginOpen} from '@/hook/yingshiScreenState/useLoginOpen';

export default function Page() {
  const [isOpenLogin, setIsOpenLogin] = useLoginOpen();

  return (
    <YingshiLoginBottomSheet
      visible={isOpenLogin}
      onDismiss={() => setIsOpenLogin(false)}
    />
  )

}
