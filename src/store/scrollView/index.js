import { createSlice } from '@reduxjs/toolkit';

export const setIsScroll = (d) => isScroll.actions.setIsScroll(d);
export const resetIsScroll = () => isScroll.actions.resetIsScroll();

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
