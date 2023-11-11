import { PersonSlice } from "./features/personSlice"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"

export const store=configureStore({
    reducer: {
        person: PersonSlice.reducer
    }
})

export const useAppDispatch: () => typeof store.dispatch=useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector