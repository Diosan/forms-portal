import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Charge {
  id: number;
}

interface ChargesState {
  charge_count: number;
}

const initialState: ChargesState = {
  charge_count: 0,
};

const chargeSlice = createSlice({
  name: "charge",
  initialState,
  reducers: {
    countCharge: (state, action: PayloadAction<number>) => {
      if (state.charge_count < 0) {
        state.charge_count = 1;
      }
      else{
        state.charge_count += 1;
      }
      console.log("adding charge")
      console.log("adding charge count: ", state.charge_count)
    },
    deleteCharge: (state, action: PayloadAction<number>) => { // assuming payload is the charge id
      if (state.charge_count > 0) {
        state.charge_count -= 1;
      }
      console.log("deleting charge")
      console.log("deleting charge count: ", state.charge_count)
    },
  },
});



const { reducer, actions } = chargeSlice;
export const { countCharge, deleteCharge } = actions;
export default reducer;

