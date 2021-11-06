import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoiceId(state, action) {
      state.id = action.payload;
    },
  },
});

export const { setInvoiceId } = invoiceSlice.actions;
export const selectInvoice = (state) => state.invoice;
export default invoiceSlice.reducer;
