import {useSelector} from 'react-redux';

export default function useYingshiUser() {
    // {isVip, userInfo}
    const getYingshiUser = (s) => s.yingshiUser
    const {userInfo} = useSelector(getYingshiUser);

    const isVip = userInfo && (userInfo.userCurrentTimestamp < userInfo.userMemberExpired)

    return {
        userInfo,
        isVip
    }
}
