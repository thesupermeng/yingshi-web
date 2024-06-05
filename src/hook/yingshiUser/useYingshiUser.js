import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {LocalStorageKeys} from '@/config/common';
import {queryUserInfo} from '@/services/yingshiUser';
import {setAhaToken, setYingshiUserInfo, setYingshiUserToken , setRefreshCd} from '@/store/yingshiUser';

export default function useYingshiUser() {
    // {isVip, userInfo}
    const getYingshiUser = (s) => s.yingshiUser
    const {userInfo, token, ahaToken ,refreshCd} = useSelector(getYingshiUser);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            // if token exist, no need set token
            return
        }

        // get token
        const localStorageToken = localStorage.getItem(LocalStorageKeys.AuthTokenHeader);
        const localStorageAhaToken = localStorage.getItem(LocalStorageKeys.AhaToken);

        if (localStorageToken) {
            dispatch(setYingshiUserToken(localStorageToken))
        }
        if (localStorageAhaToken) {
            dispatch(setAhaToken(localStorageAhaToken))
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

    const refreshUserInfo = () => {
        queryUserInfo().then(res => {
            if(res){
                dispatch(setYingshiUserInfo(res.user))
            }
        })
    }

    const isVip = !!(userInfo && (userInfo.current_timestamp < userInfo.vip_end_time))

    return {
        userInfo,
        isVip,
        token,
        ahaToken,
        refreshCd,
        refreshUserInfo
    }
}
