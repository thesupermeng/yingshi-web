import {useSelector} from 'react-redux';

export default function useYingshiUser() {
    // {isVip, userInfo}
    const getYingshiUser = (s) => s.yingshiUser
    const {userInfo} = useSelector(getYingshiUser);

    const isVip = !!(userInfo && (userInfo.current_timestamp < userInfo.vip_end_time))

    return {
        userInfo,
        isVip
    }
}
