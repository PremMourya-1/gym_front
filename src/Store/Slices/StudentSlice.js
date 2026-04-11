import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "student",
  initialState: null,
  reducers: {
    setStudentData: (state, action) => {
      return action.payload;
    },
    addStudentData: (state, action) => {
      return state
        ? {
            studentCount: state.studentCount + 1,
            data: [action.payload, ...state.data],
          }
        : { studentCount: 1, data: [action.payload] };
    },
    AddBulkStudents: (state, action) => {
      return state
        ? {
            studentCount: action.payload.length + state.studentCount,
            data: [...action.payload, ...state.data],
          }
        : { studentCount: action.payload.length, data: action.payload };
    },
    updateStudentData: (state, action) => {
      const updated = state.data.map((it) => {
        return it.id === action.payload.id ? action.payload.data : it;
      });
      return { ...state, data: updated };
    },
    deleteStudentData: (state, action) => {
      const updated = state.data.filter((it) => it.id !== action.payload.id);
      return { studentCount: state.studentCount - 1, data: updated };
    },
  },
});

export const {
  setStudentData,
  addStudentData,
  deleteStudentData,
  updateStudentData,
  AddBulkStudents,
} = studentSlice.actions;
export default studentSlice.reducer;
