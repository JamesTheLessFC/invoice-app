import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./features/toast/toastSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { invoiceApi } from "./services/invoice";
import invoiceFormReducer from "./features/invoiceForm/invoiceFormSlice";

export const store = configureStore({
  reducer: {
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    toast: toastReducer,
    invoiceForm: invoiceFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(invoiceApi.middleware),
});

setupListeners(store.dispatch);
