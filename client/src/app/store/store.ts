import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import basketSlice from "../../features/Basket/basketSlice";
import { productSlice } from "../../features/Catalog/catalogSlice";
import { accountSlice } from "../../features/Account/accountSlice";

export const store = configureStore({
  reducer: {
    basket: basketSlice,
    catalog: productSlice.reducer,
    account: accountSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
