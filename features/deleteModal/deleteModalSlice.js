import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  hidden: true,
};

export const showDeleteModal = createAsyncThunk(
  "deleteModal/showDeleteModal",
  (arg, { dispatch }) => {
    dispatch(open());
    setTimeout(() => {
      dispatch(show());
    }, 0);
  }
);

export const hideDeleteModal = createAsyncThunk(
  "deleteModal/hideDeleteModal",
  (arg, { dispatch }) => {
    dispatch(hide());
    setTimeout(() => {
      dispatch(close());
    }, 500);
  }
);

const deleteModalSlice = createSlice({
  name: "deleteModal",
  initialState,
  reducers: {
    open: (state) => ({
      open: true,
      hidden: true,
    }),
    show: (state) => ({
      open: true,
      hidden: false,
    }),
    hide: (state) => ({
      open: true,
      hidden: true,
    }),
    close: (state) => ({
      open: false,
      hidden: true,
    }),
  },
});

export const { open, show, hide, close } = deleteModalSlice.actions;
export const selectDeleteModal = (state) => state.deleteModal;
export default deleteModalSlice.reducer;
