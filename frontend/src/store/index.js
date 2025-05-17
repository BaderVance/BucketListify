import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import goalReducer from './slices/goalSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
  },
});

export default store; 