import { createSlice } from '@reduxjs/toolkit';

const tryonSlice = createSlice({
  name: 'tryon',
  initialState: {
    userImage: null,
    selectedClothing: null,
    resultImage: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserImage: (state, action) => {
      state.userImage = action.payload;
    },
    setSelectedClothing: (state, action) => {
      state.selectedClothing = action.payload;
    },
    setResultImage: (state, action) => {
      state.resultImage = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetTryon: (state) => {
      state.userImage = null;
      state.selectedClothing = null;
      state.resultImage = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setUserImage,
  setSelectedClothing,
  setResultImage,
  setLoading,
  setError,
  resetTryon,
} = tryonSlice.actions;

export default tryonSlice.reducer;
