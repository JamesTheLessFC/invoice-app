import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  on: false,
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.on = !state.on;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;
export const selectDarkMode = (state) => state.darkMode;
export default darkModeSlice.reducer;
