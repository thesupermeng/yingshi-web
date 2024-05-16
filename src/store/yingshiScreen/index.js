import {createSlice} from '@reduxjs/toolkit';

export const setShowLogin = (d) => yingshiScreen.actions.setShowLogin(d)
export const setShowLoginSuccess = (d) => yingshiScreen.actions.setShowLoginSuccess(d)
export const setShowPayment = (d) => yingshiScreen.actions.setShowPayment(d)

export const yingshiScreen = createSlice({
  name: 'yingshiScreen',
  initialState: {
    isShowLogin: false,
    isShowLoginSuccess: false,
    isShowPayment: false,
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
  }

})
