import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: [],
  invoiceCount: 0,
};

const invoiceListSlice = createSlice({
  name: "invoiceList",
  initialState,
  reducers: {
    addFilter: (state, action) => ({
      ...state,
      filters: [...state.filters, action.payload],
    }),
    removeFilter: (state, action) => ({
      ...state,
      filters: state.filters.filter((filter) => filter !== action.payload),
    }),
    setFilters(state, action) {
      state.filters = action.payload;
    },
    setInvoiceCount(state, action) {
      state.invoiceCount = action.payload;
    },
  },
});

export const { addFilter, removeFilter, setFilters, setInvoiceCount } =
  invoiceListSlice.actions;
export const selectInvoiceList = (state) => state.invoiceList;
export default invoiceListSlice.reducer;
