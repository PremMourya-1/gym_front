import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginToggleAction(state, action) {
      return action.payload;
    },
    updateAuthDataForSession(state, action) {
      return { ...state, ...action.payload };
    },
    updateUserData(state, action) {
      return { ...state, user: { ...state.user, ...action.payload } };
    },
    updateUserForPlan(state, action) {
      return { ...state, ...action.payload };
    },
    logoutAction() {
      return {};
    },
  },
});
export const {
  loginToggleAction,
  logoutAction,
  updateAuthDataForSession,
  updateUserData,
  updateUserForPlan,
} = authSlice.actions;

export const getLoggedInUserDetails = (state) => state.auth;
export default authSlice.reducer;
