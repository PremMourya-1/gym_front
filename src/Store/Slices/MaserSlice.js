import { createSlice } from "@reduxjs/toolkit";

const masterSlice = createSlice({
  name: "master",
  initialState: null,
  reducers: {
    setMasterData: (state, action) => {
      return state ? [...state, action.payload] : [action.payload];
    },
    setMasterDataAllMasterData: (state, action) => {
      return action.payload;
    },
    addMasterData: (state, action) => {
      return state.map((item) => {
        if (item.type === action.payload.type) {
          const allInactive = item.data.map((x) => {
            return { ...x, isActive: 0 };
          });
          return (item = {
            ...item, // type
            data: Number(action.payload.data.isActive)
              ? [action.payload.data, ...allInactive]
              : action.payload.type === "session"
              ? [action.payload.data, ...item.data]
              : [...item.data, action.payload.data],
          });
        }
        return item;
      });
    },
    updateMasterData: (state, action) => {
      return state.map((item) => {
        if (item.type === action.payload.type) {
          return {
            ...item,
            data: item.data.map((it) =>
              it.id === action.payload.id
                ? action.payload.data
                : Boolean(Number(action.payload.data.isActive)) === true
                ? { ...it, isActive: 0 }
                : it
            ),
          };
        }
        return item;
      });
    },
    deleteMasterData: (state, action) => {
      return state.map((item) => {
        if (item.type === action.payload.type) {
          return {
            ...item,
            data: item.data.filter((it) => it.id !== action.payload.id),
          };
        } else return item;
      });
    },
  },
});

export const {
  setMasterData,
  addMasterData,
  deleteMasterData,
  updateMasterData,
  setMasterDataAllMasterData,
} = masterSlice.actions;
export default masterSlice.reducer;
