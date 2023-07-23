import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./mapSlice";
import userSlice from "./userSlice";
import modalSlice from "./modalSlice";
const isDevelopment = process.env.REACT_APP_ENV === "development";
export const store = configureStore({
  reducer: {
    mapSet: mapSlice,
    userSet: userSlice,
    modalSet: modalSlice,
  },
  devTools: isDevelopment,
});
