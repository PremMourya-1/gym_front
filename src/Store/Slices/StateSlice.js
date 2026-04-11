import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const stateSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setState(state, action) {
      return action.payload;
    },
  },
});
export const { setState } = stateSlice.actions;
export default stateSlice.reducer;
