import {createSlice} from '@reduxjs/toolkit';

export const setYingshiUserInfo = (d) => yingshiUser.actions.setUserInfo(d)
export const setYingshiUserToken = (d) => yingshiUser.actions.setToken(d)
export const setYingshiUserLoginParam = (d) => yingshiUser.actions.setLoginParam(d)
export const setAhaToken = (d) => yingshiUser.actions.setAhaToken(d)

// pixel payment 
export const setPendingTransactionId = (d) => yingshiUser.actions.setPendingTransactionId(d)
export const setPendingTransactionTry = (d) => yingshiUser.actions.setPendingTransactionTry(d)

export const setRefreshCd = (d) => yingshiUser.actions.setRefreshCd(d)


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
        token: null,
        loginParam: null,
        ahaToken: null,
        pendingTransactionId: '',
        pendingTransactionTry: 0,
        refreshCd: null
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
        },
        setAhaToken: (state, action) => {
            state.ahaToken = action.payload;
        },

        setPendingTransactionId: (state, action) => {
            state.pendingTransactionId = action.payload;
          },
          setPendingTransactionTry: (state, action) => {
            state.pendingTransactionTry = action.payload;
          },
       

        setRefreshCd: (state, action) => {
            state.refreshCd = action.payload;
        }

    }
})
