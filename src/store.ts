import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"


const reducer = {
  auth: authReducer,
  message: messageReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export const useAppDispatch: () => typeof store.dispatch=useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;


