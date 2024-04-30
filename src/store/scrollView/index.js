import { createSlice } from '@reduxjs/toolkit';

export const setIsScroll = (d) => isScroll.actions.setIsScroll(d);
export const resetIsScroll = () => isScroll.actions.resetIsScroll();

export const setIsTop = (d) => isTop.actions.setIsTop(d);
export const resetIsTop = () => isTop.actions.resetIsTop();

export const isScroll = createSlice({
  name: 'isScroll',
  initialState: { res: false },
  reducers: {
    resetIsScroll: (state) => {
      return {};
    },
    setIsScroll: (state, action) => {
      state.res = action.payload;
    },
  },
});

export const isTop = createSlice({
  name: 'isTop',
  initialState: { res: true },
  reducers: {
    resetIsTop: (state) => {
      return {};
    },
    setIsTop: (state, action) => {
      state.res = action.payload;
    },
  },
});
