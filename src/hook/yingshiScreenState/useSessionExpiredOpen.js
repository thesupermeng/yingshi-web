import {useDispatch, useSelector} from 'react-redux';
import {setIsSessionExpired} from '@/store/yingshiScreen';

export const useSessionExpiredOpen = () => {
  const getIsIsSessionExpired = (state) => state.yingshiScreen.isIsSessionExpired;
  const isIsSessionExpired = useSelector(getIsIsSessionExpired);
  const dispatch = useDispatch();
  const internalSetIsSessionExpired = (d) => dispatch(setIsSessionExpired(d));

  return [isIsSessionExpired, internalSetIsSessionExpired]
}
