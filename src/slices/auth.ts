import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService from "../services/auth.service";
import {VerifyOtpResponse}  from "../services/auth.service";
import axios from "axios";


// Interfaces
interface User {
  username?: string;
  email?: string;
  password?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  otpRequired: boolean;
  isVerified:boolean;
  token: string;
  otpErrorMessage:any;
}

interface VerifyOtpPayload {
  otp: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface ResendOtpPayload {
  email: string;
}


// const initialState: AuthState = {
//   isLoggedIn: false,
//   user: null,
//   otpRequired: false, // Add this to your AuthState interface
// };

// Parsing user from localStorage
const user = JSON.parse(localStorage.getItem("user") || 'null');

// // Async Thunks
// export const register = createAsyncThunk(
//   "auth/register",
//   async ({ username, email, password }: RegisterPayload, thunkAPI) => {
//     try {
//       const response = await AuthService.register({ username, email, password });
//       thunkAPI.dispatch(setMessage(response.message));
//       return { user: response.message };
//     } catch (error: any) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       thunkAPI.dispatch(setMessage(message));
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }: RegisterPayload, thunkAPI) => {
    try {
      const response = await AuthService.register({ username, email, password });
      thunkAPI.dispatch(setMessage(response.message));
      // Ensure that you're returning a User object or null
      // Example: return { user: response.user || null };
      return { user: response.user }; // Replace 'response.user' with actual user object from response
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: LoginPayload, thunkAPI) => {
    try {
      console.log("..trying to login - at slice")
      const response = await AuthService.login(username, password);
      thunkAPI.dispatch(setMessage(response.message));

      if (typeof response.token === 'string') {
        // Store the JWT token in localStorage
        localStorage.setItem("userToken", response.token);

        // Set the token as the default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      } else {
        // Handle the case where the token is not a string
        console.error("Invalid token received from login response");
        return thunkAPI.rejectWithValue("Invalid token received");
      }

       // update your state to indicate the user needs to provide OTP sent to their account
       return { user: null, otpRequired: true, token: response.token };

    } catch (error: any) {
      console.log("..trying to login - got a response from service",)
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    // Perform any logout logic here. For example:
    localStorage.removeItem("userToken"); // Clear the JWT token
    // Clear local storage or any other side effects
    await AuthService.logout();
    // Return any data if needed, or just resolve the promise
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ otp }: VerifyOtpPayload, thunkAPI) => {
    try {
      const response: VerifyOtpResponse = await AuthService.verifyOtp(otp);
      if (response.outcome === 'success') {
        console.log(response)
        // localStorage.setItem("id_token", response.token);
        return { verified: true, token: response.token };
      } else {
        return thunkAPI.rejectWithValue(response.message);
      }
    } catch (error: any) {
      // Error handling as before
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const resendOTP = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }: ResendOtpPayload, thunkAPI) => {
    try {
      const response =  await AuthService.resendOTP(email);
      thunkAPI.dispatch(setMessage(response.message));
      console.log(response)

      if (typeof response.token === 'string') {
        // Store the JWT token in localStorage
        localStorage.setItem("userToken", response.token);

        // Set the token as the default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      } else {
        // Handle the case where the token is not a string
        console.error("Invalid token received from login response");
        return thunkAPI.rejectWithValue("Invalid token received");
      }

      return { user: null, otpRequired: true, token: response.token };



      // if (response) {
      //   console.log(response)
      //   return response;
      // } else {
      //   return thunkAPI.rejectWithValue(response);
      // }

    } catch (error: any) {
      // Error handling as before
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Slice with initialState and reducers
// const initialState: AuthState = user
//   ? { isLoggedIn: true, user }
//   : { isLoggedIn: false, user: null };
  

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  otpRequired: false,
  isVerified: false,
  otpErrorMessage:"",
  token: localStorage.getItem("userToken") || ""
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    //REGISTER
      .addCase(register.fulfilled, (state, action: PayloadAction<{user: User}>) => {
        state.isLoggedIn = false; 
        state.isVerified = false;
        state.user = action.payload.user; 
      })
      .addCase(register.rejected, (state) => {
        state.isLoggedIn = false;
        state.isVerified = false;
      })
      //LOGIN
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.isVerified = false;
        state.user = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{  otpRequired: boolean }>) => {
        state.isLoggedIn = false;
        state.isVerified = false;
        state.otpRequired = action.payload.otpRequired;
      })
      //LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.isVerified = false;
        state.user = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.isVerified = false;
        state.user = null;
        state.otpRequired = true;
      })
      //VERIFY OTP
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<{ verified: boolean; token: string } | undefined>) => {
        if (action.payload) {
          state.isVerified = true;
          state.isLoggedIn = true;
          state.token = action.payload.token;
          state.otpRequired = false;
          // state.user = action.payload.user; 
        } else {
          state.isVerified = false;
          state.isLoggedIn = false;
          state.token = "";
          state.otpRequired = true;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isVerified = false;
        state.isLoggedIn = false;
        state.otpErrorMessage = action.payload;
      });

        
  },
});

const { reducer } = authSlice;
export default reducer;
