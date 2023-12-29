import { PersonSlice } from "./features/personSlice"
import { AccusedSlice } from "./features/accusedSlice"
import chargesSlice from "../slices/charge"


import AuthSlice from './features/authSlice';

import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"

export const store=configureStore({
    reducer: {
        person: PersonSlice.reducer,
        accused: AccusedSlice.reducer,
        charge: chargesSlice,
        auth: AuthSlice
    }
})

export const useAppDispatch: () => typeof store.dispatch=useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector