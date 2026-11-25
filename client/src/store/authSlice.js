import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token') || null;
const user = JSON.parse(localStorage.getItem('user')) || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user,
    token: token,
    isAuthenticated: !!token,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateCredits: (state, action) => {
      if (state.user) {
        state.user.credits = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateCredits } = authSlice.actions;

export default authSlice.reducer;
