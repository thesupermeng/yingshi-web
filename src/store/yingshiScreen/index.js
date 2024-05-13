import {createSlice} from '@reduxjs/toolkit';

export const setShowLogin = (d) => yingshiScreen.actions.setShowLogin(d)
export const setShowPayment = (d) => yingshiScreen.actions.setShowPayment(d)

export const yingshiScreen = createSlice({
  name: 'yingshiScreen',
  initialState: {
    isShowLogin: false,
    isShowPayment: false,
  },
  reducers: {
    setShowLogin: (state, action) => {
      state.isShowLogin = action.payload;
    },
    setShowPayment: (state, action) => {
      state.isShowPayment = action.payload;
    },
  }

})
