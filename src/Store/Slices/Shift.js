import { createSlice } from "@reduxjs/toolkit";

const shiftSlice = createSlice({
  name: "shift",
  initialState: null,
  reducers: {
    setShift: (state, action) => {
      return action.payload;
    },
    addShiftData: (state, action) => {
      return state ? [action.payload, ...state] : [action.payload];
    },
    updateShiftData: (state, action) => {
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        } else return item;
      });
    },
    deleteShiftData: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setShift, addShiftData, updateShiftData, deleteShiftData } =
  shiftSlice.actions;
export default shiftSlice.reducer;
