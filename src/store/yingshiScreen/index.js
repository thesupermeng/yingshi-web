import {createSlice} from '@reduxjs/toolkit';

export const setShowLogin = (d) => yingshiScreen.actions.setShowLogin(d)
export const setShowLoginSuccess = (d) => yingshiScreen.actions.setShowLoginSuccess(d)
export const setShowPayment = (d) => yingshiScreen.actions.setShowPayment(d)
export const setShowPaymentPending = (d) => yingshiScreen.actions.setShowPaymentPending(d)
// pixel payment 
export const setPendingTransactionId = (d) => yingshiScreen.actions.setPendingTransactionId(d)
export const setPendingTransactionTry = (d) => yingshiScreen.actions.setPendingTransactionTry(d)
export const setPendingTransactionObj = (d) => yingshiScreen.actions.setPendingTransactionObj(d)
export const yingshiScreen = createSlice({
  name: 'yingshiScreen',
  initialState: {
    isShowLogin: false,
    isShowLoginSuccess: false,
    isShowPayment: false,
    isShowPaymentPending: false,
    pendingTransactionId: '',
    pendingTransactionTry: 0,
    pendingTransactionObj:{},
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
    setPendingTransactionId: (state, action) => {
      state.pendingTransactionId = action.payload;
    },
    setPendingTransactionTry: (state, action) => {
      state.pendingTransactionTry = action.payload;
    },
    setPendingTransactionObj: (state, action) => {
      state.pendingTransactionObj = action.payload;
    },
  }

})
