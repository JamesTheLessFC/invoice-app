import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  hidden: true,
};

export const showInvoiceForm = createAsyncThunk(
  "invoiceForm/showInvoiceForm",
  (arg, { dispatch }) => {
    dispatch(open());
    setTimeout(() => {
      dispatch(show());
    }, 0);
  }
);

export const hideInvoiceForm = createAsyncThunk(
  "invoiceForm/hideInvoiceForm",
  (arg, { dispatch }) => {
    dispatch(hide());
    setTimeout(() => {
      dispatch(close());
    }, 500);
  }
);

const invoiceFormSlice = createSlice({
  name: "invoiceForm",
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

export const { open, show, hide, close } = invoiceFormSlice.actions;
export const selectInvoiceForm = (state) => state.invoiceForm;
export default invoiceFormSlice.reducer;
