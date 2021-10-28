import { configureStore } from "@reduxjs/toolkit";
import invoicesReducer from "./features/invoices/invoicesSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { invoiceApi } from "./services/invoice";

export const store = configureStore({
  reducer: {
    [invoiceApi.reducerPath]: invoiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(invoiceApi.middleware),
});

setupListeners(store.dispatch);
