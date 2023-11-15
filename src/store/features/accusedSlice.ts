import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Charge {
    accused_id: number
    ICCS: string
    UNODC: string
    name: string
    count: number
}

export interface Accused {
    id: number
    name: string
    address: string
}

interface AccusedState {
    accuseds: Accused[]
    charges: Charge[]
}

const initialState: AccusedState = {
    accuseds: [],
    charges: []
}

export const AccusedSlice = createSlice({
    name: "accused",
    initialState,
    reducers: {
        addAccused: (state, action: PayloadAction<{name: string, address: string}>) => {
            state.accuseds.push({
               id: state.accuseds.length,
               name: action.payload.name,
               address: action.payload.address
            })
        },
        addCharge: (state, action: PayloadAction<{
            accused_id: number, 
            ICCS: string, 
            UNODC: string, 
            name: string,
            count: number
            }>) => {
                // alert('addCharge triggered');
                state.charges.push({
                    accused_id: action.payload.accused_id,
                    ICCS: action.payload.ICCS,
                    UNODC: action.payload.UNODC,
                    name: action.payload.name,
                    count: action.payload.count
            })            
        }
    }
})

export default AccusedSlice.reducer
export const {addAccused, addCharge} = AccusedSlice.actions