import { createSlice } from "@reduxjs/toolkit";

const existingSlice = createSlice({
  name: "existingStudent",
  initialState: null,
  reducers: {
    setExistingStudentData(state, action) {
      return action.payload;
    },
    updateExistingStudentData(state, action) {
      return state ? [action.payload, ...state] : [action.payload];
    },
    updateExistingStudentDataBulk(state, action) {
      return state ? [...action.payload, ...state] : [...action.payload];
    },
  },
});
export const {
  setExistingStudentData,
  updateExistingStudentData,
  updateExistingStudentDataBulk,
} = existingSlice.actions;
export default existingSlice.reducer;
