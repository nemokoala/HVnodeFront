import { createSlice } from "@reduxjs/toolkit";
export const mapSlice = createSlice({
  name: "mapSet",
  initialState: {
    zoomLevel: 13,
    center: { lat: 36.2683, lng: 127.6358 },
    showReview: [],
  },
  reducers: {
    saveZoom: (state, action: any): any => {
      console.log(action.payload);
      state.zoomLevel = action.payload;
    },

    saveCenter: (state, action: any): any => {
      console.log(action.payload);
      state.center = action.payload;
    },

    saveShowReview: (state, action: any): any => {
      console.log(action.payload);
      state.showReview = action.payload;
    },
  },
});

export const { saveZoom, saveCenter, saveShowReview } = mapSlice.actions;
export default mapSlice.reducer;
