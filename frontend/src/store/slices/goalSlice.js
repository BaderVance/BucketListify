import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Get user's goals
export const getUserGoals = createAsyncThunk(
  'goals/getUserGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/goals/my`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get public goals
export const getPublicGoals = createAsyncThunk(
  'goals/getPublicGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/goals/public`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create goal
export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/goals`, goalData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update goal
export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ id, goalData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/goals/${id}`, goalData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete goal
export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/goals/${id}`, {
        headers: getAuthHeader(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update goal progress
export const updateProgress = createAsyncThunk(
  'goals/updateProgress',
  async ({ id, progress }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/goals/${id}/progress`,
        { progress },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Toggle like
export const toggleLike = createAsyncThunk(
  'goals/toggleLike',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/goals/${id}/like`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  userGoals: [],
  publicGoals: [],
  loading: false,
  error: null,
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user goals
      .addCase(getUserGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoals = action.payload;
      })
      .addCase(getUserGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch goals';
      })
      // Get public goals
      .addCase(getPublicGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.publicGoals = action.payload;
      })
      .addCase(getPublicGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch public goals';
      })
      // Create goal
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoals.unshift(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create goal';
      })
      // Update goal
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoals = state.userGoals.map((goal) =>
          goal._id === action.payload._id ? action.payload : goal
        );
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update goal';
      })
      // Delete goal
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoals = state.userGoals.filter(
          (goal) => goal._id !== action.payload
        );
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete goal';
      })
      // Update progress
      .addCase(updateProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoals = state.userGoals.map((goal) =>
          goal._id === action.payload._id ? action.payload : goal
        );
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update progress';
      })
      // Toggle like
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoals = state.userGoals.map((goal) =>
          goal._id === action.payload._id ? action.payload : goal
        );
        state.publicGoals = state.publicGoals.map((goal) =>
          goal._id === action.payload._id ? action.payload : goal
        );
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to toggle like';
      });
  },
});

export const { clearError } = goalSlice.actions;
export default goalSlice.reducer; 