import { createSlice } from "@reduxjs/toolkit";

const tamplateSlice = createSlice({
  name: "tamplate",
  initialState: null,
  reducers: {
    setTamplate: (state, action) => {
      return action.payload;
    },
    addTamplate: (state, action) => {
      return state ? [action.payload, ...state] : [action.payload];
    },
    updateTamplate: (state, action) => {
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        } else return item;
      });
    },
    deleteTamplateData: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setTamplate, addTamplate, updateTamplate, deleteTamplateData } =
  tamplateSlice.actions;
export default tamplateSlice.reducer;
