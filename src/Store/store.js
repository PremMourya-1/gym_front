import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slices/AuthSlice";
import stateSlice from "./Slices/StateSlice";
import masterSlice from "./Slices/MaserSlice";
import studentSlice from "./Slices/StudentSlice";
import existingSlice from "./Slices/ExistingStudent";
import PlanSlice from "./Slices/PlanSlice";
import HolidaySlice from "./Slices/HolidaySlice";
import TamplateSlice from "./Slices/TamplateSlice";
import shiftSlice from "./Slices/Shift";
import notificationSlice from "./Slices/NotificationSlice";

const isAdmin = window.location.pathname.includes("admin");

const adminReducers = {
  auth: authSlice,
  state: stateSlice,
  notification: notificationSlice,
  tamplate: TamplateSlice,
};
const frontReducers = {
  auth: authSlice,
  state: stateSlice,
  master: masterSlice,
  student: studentSlice,
  existingStudent: existingSlice,
  plan: PlanSlice,
  holiday: HolidaySlice,
  tamplate: TamplateSlice,
  shift: shiftSlice,
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
