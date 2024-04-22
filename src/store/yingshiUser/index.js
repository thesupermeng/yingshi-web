import {createSlice} from '@reduxjs/toolkit';

export const setYingshiUserInfo = (d) => yingshiUser.actions.setUserInfo(d)

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
        userInfo: null
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        }
    }
})
