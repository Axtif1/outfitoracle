import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchClothes = createAsyncThunk(
  'clothing/fetchClothes',
  async (category, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/clothes${category && category !== 'all' ? `?category=${category}` : ''}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clothes');
    }
  }
);

const clothingSlice = createSlice({
  name: 'clothing',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedCategory: 'all',
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClothes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClothes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClothes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory } = clothingSlice.actions;

export default clothingSlice.reducer;
