import { PersonSlice } from "./features/personSlice"
import { AccusedSlice } from "./features/accusedSlice"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"

export const store=configureStore({
    reducer: {
        person: PersonSlice.reducer,
        accused: AccusedSlice.reducer
    }
})

export const useAppDispatch: () => typeof store.dispatch=useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector