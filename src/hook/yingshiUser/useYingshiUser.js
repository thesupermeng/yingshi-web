import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {LocalStorageKeys} from '@/config/common';
import {queryUserInfo} from '@/services/yingshiUser';
import {setYingshiUserInfo, setYingshiUserToken} from '@/store/yingshiUser';

export default function useYingshiUser() {
    // {isVip, userInfo}
    const getYingshiUser = (s) => s.yingshiUser
    const {userInfo, token} = useSelector(getYingshiUser);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            // if token exist, no need set token
            return
        }

        // get token
        const localStorageToken = localStorage.getItem(LocalStorageKeys.AuthToken);

        if (localStorageToken) {
            dispatch(setYingshiUserToken(localStorageToken))
        }

    }, [])

    useEffect(() => {
        if (!token || userInfo) {
            // if no token or user info populated, no need populate again
            return
        }

        queryUserInfo().then(res => {
            dispatch(setYingshiUserInfo(res.user))
        })

    }, [token])

    const isVip = !!(userInfo && (userInfo.current_timestamp < userInfo.vip_end_time))

    return {
        userInfo,
        isVip
    }
}