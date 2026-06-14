import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const planDetailSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setPlanDetails(state, action) {
      return action.payload;
    },
  },
});
export const { setPlanDetails } = planDetailSlice.actions;

export const getCurrentPlanDetails = (state) => state.plan;
export default planDetailSlice.reducer;
