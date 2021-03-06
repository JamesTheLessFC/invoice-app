import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./features/toast/toastSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { invoiceApi } from "./services/invoice";
import invoiceFormReducer from "./features/invoiceForm/invoiceFormSlice";
import deleteModalReducer from "./features/deleteModal/deleteModalSlice";
import invoiceListReducer from "./features/invoiceList/invoiceListSlice";
import darkModeReducer from "./features/darkMode/darkModeSlice";
import invoiceReducer from "./features/invoice/invoiceSlice";

export const store = configureStore({
  reducer: {
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    toast: toastReducer,
    invoiceForm: invoiceFormReducer,
    deleteModal: deleteModalReducer,
    invoiceList: invoiceListReducer,
    darkMode: darkModeReducer,
    invoice: invoiceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(invoiceApi.middleware),
});

setupListeners(store.dispatch);
