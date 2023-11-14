import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Charge {
    ICCS: string
    UNODC: string
    name: string
}

export interface Accused {
    id: number
    name: string
    address: string
    charges: Charge[]
}

interface AccusedState {
    accuseds: Accused[]
}

const initialState: AccusedState = {
    accuseds: []
}

export const AccusedSlice = createSlice({
    name: "accused",
    initialState,
    reducers: {
        addAccused: (state, action: PayloadAction<{name: string, address: string}>) => {
            state.accuseds.push({
               id: state.accuseds.length,
               name: action.payload.name,
               address: action.payload.address,
               charges: []
            })
        },
        addCharge: (state, action: PayloadAction<{ICCS: string, UNODC: string, name: string}>) => {

        }
    }
})

export default AccusedSlice.reducer
export const {addAccused, addCharge} = AccusedSlice.actions