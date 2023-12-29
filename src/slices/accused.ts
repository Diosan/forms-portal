import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Accused {
  id: number;
}

interface AccusedState {
  accused: Accused[];
  count: number,
}

const initialState: AccusedState = {
  accused: [],
  count: 0,
};



const accusedSlice = createSlice({
  name: "accused",
  initialState,
  reducers: {
    setAccused: (state, action) => {
      state.accused = action.payload;
      state.count = action.payload.length;
      console.log("Setting the count")
    },
    clearAccused: (state) => {
      state.accused = [];
      state.count = 0;
      console.log("Clearing the count")
    },
    addAccused: (state, action:PayloadAction<Accused>) => {
      state.count += 1;
      console.log("Adding to count")
    },
    removeAccused: (state, action: PayloadAction<number>) => {
      state.count -= 1;
      console.log("Reducing the count")
    }
  },
});

const { reducer, actions } = accusedSlice;

export const { setAccused, clearAccused, addAccused, removeAccused, } = actions;
export default reducer;