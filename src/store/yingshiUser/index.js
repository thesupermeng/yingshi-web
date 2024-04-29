import {createSlice} from '@reduxjs/toolkit';
import {LocalStorageKeys} from '@/config/common';

export const setYingshiUserInfo = (d) => yingshiUser.actions.setUserInfo(d)
export const setYingshiUserToken = (d) => yingshiUser.actions.setToken(d)
export const setYingshiUserLoginParam = (d) => yingshiUser.actions.setLoginParam(d)


export const yingshiUser = createSlice( {
    name: 'yingshiUser',
    initialState: {
        /**
         *     userToken: string;
         *     userId: string;
         *     userName: string;
         *     userReferralCode: string;
         *     userEmail: string;
         *     userPhoneNumber: string;
         *     userMemberExpired: string;
         *     userReferrerName: string;
         *     userEndDaysCount: number;
         *     userTotalInvite: number;
         *     userAccumulateRewardDay: number;
         *     userAllowUpdateReferral: boolean;
         *     userInvitedUserList: any;
         *     userUpline: any;
         *     userCurrentTimestamp: string;
         *     userAccumulateVipRewardDay: number;
         *     userPaidVipList: any;
         */
        userInfo: null,
        token: localStorage.getItem(LocalStorageKeys.AuthToken),
        loginParam: null,
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setLoginParam: (state, action) => {
            state.loginParam = action.payload;
        }
    }
})
