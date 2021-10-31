import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: [],
  invoiceCount: 0,
  page: 1,
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
    incrementPage(state, action) {
      state.page = state.page + 1;
    },
    decrementPage(state, action) {
      state.page = state.page - 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const {
  addFilter,
  removeFilter,
  setFilters,
  setInvoiceCount,
  incrementPage,
  decrementPage,
  setPage,
} = invoiceListSlice.actions;
export const selectInvoiceList = (state) => state.invoiceList;
export default invoiceListSlice.reducer;
