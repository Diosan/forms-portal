// features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/api'


interface AuthState {
    isAuthenticated: boolean;
    user: userData | null;
    loading: boolean;
    error: string | null;
    // ... other relevant state properties
  }

  const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    // ... initialize other state properties as needed
  };

type LoginCredentials = {
    email: string;
    password: string;
};

type OTPVerificationData = {
    email: string;
    otp: string;
};

type userData = {
        agency: string,
        reg_number: string,
        first_name: string,
        last_name: string,
        email: string,
        password: string
};





// Async thunk actions
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/users`, { user: userData });
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            rejectWithValue(error.response);
          } else {
            // Handle non-Axios error
          }
      return 
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/authenticate/login`, { email: email, password });
      } catch (error) {
        if (axios.isAxiosError(error)) {
            rejectWithValue(error.response);
        } else {
          // Handle non-Axios error
        }
      }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }: OTPVerificationData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/authenticate/verify-otp`, { email, otp });
      } catch (error) {
        if (axios.isAxiosError(error)) {
                // dispatch({ type: REGISTER_FAILURE, payload: error.response });
                rejectWithValue(error.response);
              } else {
                // Handle non-Axios error
              }
        }
      }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        // Handle pending state
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // Handle success
      })
      .addCase(registerUser.rejected, (state, action) => {
        // Handle failure
      });
    // Repeat for other async thunks
  },
});

export const { /* exported reducers */ } = authSlice.actions;
export default authSlice.reducer;
