import { createSlice } from '@reduxjs/toolkit';

export const setHeaderMenu = (d) => headerMenu.actions.setData(d);
export const resetHeaderMenu = () => headerMenu.actions.resetData();
export const setSelectedId = (d) => headerMenuSelected.actions.setSelectedIds(d)
export const resetSelectedIds = () => headerMenuSelected.actions.resetData();

export const headerMenu = createSlice({
  name: 'headerMenu',
  initialState: {headerMenu: []},
  reducers: {
    resetData: (state) => {
      return {};
    },
    setData:  (state, action) => {
      state.headerMenu = action.payload;
    },
  },
});

export const headerMenuSelected = createSlice({
  name: 'headerMenuSelected',
  initialState: {id: 0},
  reducers: {
    resetSelectedIds: (state) => {
      return {};
    },
    setSelectedIds:  (state, action) => {
      state.id = action.payload;
    },
  },
});
