// authReducer.ts
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
  } from '../actions/actionTypes';
  
  const initialState = {
    isLoading: false,
    user: null,
    error: null,
    token: null
  };
  
  export const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case REGISTER_REQUEST:
      case LOGIN_REQUEST:
      case VERIFY_OTP_REQUEST:
        return {
          ...state,
          isLoading: true
        };
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoading: false,
          user: action.payload.user,
          token: action.payload.token
        };
      case VERIFY_OTP_SUCCESS:
        return {
          ...state,
          isLoading: false,
          token: action.payload.token
        };
      case REGISTER_FAILURE:
      case LOGIN_FAILURE:
      case VERIFY_OTP_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: action.payload.error
        };
      default:
        return state;
    }
  };
  