import { createSlice } from "@reduxjs/toolkit";

const planSlice = createSlice({
  name: "plan",
  initialState: null,
  reducers: {
    setPlanData(state, action) {
      return action.payload;
    },
  },
});
export const { setPlanData } = planSlice.actions;
export default planSlice.reducer;
