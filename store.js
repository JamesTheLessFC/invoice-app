import { configureStore } from "@reduxjs/toolkit";
import invoicesReducer from "./features/invoices/invoicesSlice";

export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
  },
});
