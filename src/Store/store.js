import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slices/AuthSlice";
import planDetailSlice from "./Slices/planDetailSlice";

const isAdmin = window.location.pathname.includes("admin");

const adminReducers = {
  auth: authSlice,
};
const frontReducers = {
  auth: authSlice,
  plan: planDetailSlice,
};

// const rootReducer = (state, action) => {
//   if (action.type === "auth/userLogedOut") {
//     state = undefined; // Reset state to undefined
//   }
//   return reducer(state, action);
// };

// // Configure store
// const store = configureStore({
//   reducer: rootReducer,
// });

export const store = configureStore({
  reducer: isAdmin ? adminReducers : frontReducers,
});
