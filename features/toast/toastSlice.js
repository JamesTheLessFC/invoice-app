import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: false,
  hidden: true,
  message: "",
  type: "",
};

export const showToast = createAsyncThunk(
  "toast/showToast",
  ({ message, type }, { dispatch }) => {
    dispatch(activate());
    setTimeout(() => {
      dispatch(show({ message, type }));
      setTimeout(() => {
        dispatch(hideToast());
      }, 2500);
    }, 0);
  }
);

export const hideToast = createAsyncThunk(
  "toast/hideToast",
  (arg, { dispatch, getState }) => {
    if (!getState().toast.hidden) {
      dispatch(hide());
      setTimeout(() => {
        dispatch(deactivate());
      }, 500);
    }
  }
);

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    activate: (state) => ({
      ...state,
      active: true,
      hidden: true,
    }),
    show: (state, action) => ({
      ...state,
      hidden: false,
      message: action.payload.message,
      type: action.payload.type,
    }),
    hide: (state) => ({
      ...state,
      hidden: true,
    }),
    deactivate: (state) => initialState,
  },
});

export const { activate, show, hide, deactivate } = toastSlice.actions;
export const selectToast = (state) => state.toast;
export default toastSlice.reducer;
