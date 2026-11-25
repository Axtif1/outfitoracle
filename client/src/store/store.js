import { configureStore } from '@reduxjs/toolkit';
import clothingReducer from './clothingSlice';
import tryonReducer from './tryonSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    clothing: clothingReducer,
    tryon: tryonReducer,
    auth: authReducer,
  },
});
