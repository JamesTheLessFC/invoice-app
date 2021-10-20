import { createSlice } from "@reduxjs/toolkit";
import data from "../../data.json";

const initialState = data;

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    saveInvoice: (state, action) => [...state, action.payload],
    deleteInvoice: (state, action) =>
      state.filter((invoice) => invoice.id !== action.payload.id),
  },
});

export const { saveInvoice, deleteInvoice } = invoicesSlice.actions;
export const selectInvoices = (state) => state.invoices;
export default invoicesSlice.reducer;
