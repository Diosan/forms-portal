// authActions.ts
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE
} from './actionTypes';

// Registration action
export const registerUser = (userData: any) => async (dispatch: any) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await axios.post(`${API_URL}/api/users`, { user: userData });
    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({ type: REGISTER_FAILURE, payload: error.response });
    } else {
      // Handle non-Axios error
    }
  }
};

// Login action
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(`${API_URL}/api/authenticate/login`, { email, password });
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({ type: REGISTER_FAILURE, payload: error.response });
    } else {
      // Handle non-Axios error
    }
  }
};

// OTP Verification action
export const verifyOTP = (email: string, otp: string) => async (dispatch: any) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const response = await axios.post(`${API_URL}/api/authenticate/verify-otp`, { email, otp });
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: response.data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch({ type: REGISTER_FAILURE, payload: error.response });
    } else {
      // Handle non-Axios error
    }
  }
};
