import { createSlice } from "@reduxjs/toolkit";

const holidaySlice = createSlice({
  name: "holiday",
  initialState: null,
  reducers: {
    setHolidayData: (state, action) => {
      return action.payload;
    },
    addHolidayData: (state, action) => {
      return state ? [action.payload, ...state] : [action.payload];
    },
    updateHolidayData: (state, action) => {
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        } else return item;
      });
    },
    deleteHolidayData: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setHolidayData,
  addHolidayData,
  updateHolidayData,
  deleteHolidayData,
} = holidaySlice.actions;
export default holidaySlice.reducer;
