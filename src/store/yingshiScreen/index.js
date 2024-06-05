import {createSlice} from '@reduxjs/toolkit';

export const setShowLogin = (d) => yingshiScreen.actions.setShowLogin(d)
export const setShowLoginSuccess = (d) => yingshiScreen.actions.setShowLoginSuccess(d)
export const setShowPayment = (d) => yingshiScreen.actions.setShowPayment(d)
export const setShowPaymentPending = (d) => yingshiScreen.actions.setShowPaymentPending(d)
export const setShowPinSuccess = (d) => yingshiScreen.actions.setShowPinSuccess(d)
export const setShowPinMsg = (d) => yingshiScreen.actions.setShowPinMsg(d)


export const yingshiScreen = createSlice({
  name: 'yingshiScreen',
  initialState: {
    isShowLogin: false,
    isShowLoginSuccess: false,
    isShowPayment: false,
    isShowPaymentPending: false,
    isShowPinSuccess: false,
    isShowPinMsg: '',
  },
  reducers: {
    setShowLogin: (state, action) => {
      state.isShowLogin = action.payload;
    },
    setShowLoginSuccess: (state, action) => {
      state.isShowLoginSuccess = action.payload;
    },
    setShowPayment: (state, action) => {
      state.isShowPayment = action.payload;
    },
    setShowPaymentPending: (state, action) => {
      state.isShowPaymentPending = action.payload;
    },
    setShowPinSuccess: (state, action) => {
      state.isShowPinSuccess = action.payload;
    },
    setShowPinMsg: (state, action) => {
      state.isShowPinMsg = action.payload;
    },
  }

})
