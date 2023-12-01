import axios from "axios";
import dotenv from "dotenv"
// import { API_URL } from '../config/api';
import { Navigate, useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL



interface User {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
    outcome: string;
    message: string;
    error?: string;
    token?: string | null;
  }

interface VerifyResponse {
  outcome: string;
  message?: string;
  token?: string;
}

export interface VerifyOtpResponse {
    outcome: string;
    token: string;  
    message?: string; 
}

interface AuthResponse {
    user: User;
    message: string;
    // Add other properties you expect from the response
  }

  const register = (user: User): Promise<AuthResponse> => {
    return axios.post(API_URL + '/api/users', user)
      .then((response) => {
        switch (response.data.outcome) {
          case 'success':
            console.log(response.data.message);
            return response.data; // Return the response data
          case 'error':
            console.log('Registration error: ' + response.data.error);
            throw new Error(response.data.error); // Throw an error with the message
          default:
            console.log('Unknown registration outcome');
            throw new Error('Unknown registration outcome'); // Throw a generic error
        }
      }, (error) => {
        console.log('Registration error: ', error.response);
        throw error; // Rethrow the error
      });
  };


const login = (email: string, password: string): Promise<LoginResponse> => {
    console.log(`ok logging in... with: ${email} and ${password}`);
    
    return axios.post(API_URL + '/api/authenticate/login', { email, password }, {withCredentials:true})
      .then((response: { data: LoginResponse }) => {
        if (response.data.outcome === 'success') {
          // Ensure that user data is always defined
          console.log(response.data)

          return response.data;

        } else {
          throw new Error(response.data.error || 'Login failed');
        }
    }, (error) => {
        console.log('Registration error: ', error.response);
        throw error; 
    });
  };
  

const verifyOtp = (otp: string): Promise<VerifyOtpResponse> => {
    return axios.post(API_URL + '/api/authenticate/verify-otp', { otp })
    .then(response => response.data)
    .catch(error => {
      // throw error;
      return { outcome: 'error', message: error.response.data.message || 'OTP verification failed' };
    });
};



const registrationVerify = (regEmail: string, regOTP: string): Promise<void> => {
  return axios.post(API_URL + '/api/authenticate/verify-otp', { email: regEmail, otp: regOTP })
    .then((response: { data: VerifyResponse }) => {
      switch (response.data.outcome) {
        case 'success':
          // navigate("/submissions");
          break;
        case 'error':
          console.log('OTP verification failed');
          break;
        default:
          console.log('Unknown verification outcome');
          break;
      }
    });
};

const logout = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem('userToken');
};

const resendOTP = (email:string): any => {
  return axios.post(API_URL + '/api/authenticate/resend-otp', { email}, {withCredentials:true})
    .then((response) => {
      if (response.data.outcome === 'success') {
        // console.log(response.data)
        localStorage.removeItem("user");
        localStorage.removeItem('userToken');

        localStorage.setItem("userToken", response.data.token);

        return response.data;

      } else {
        throw new Error(response.data.error || 'OTP Sending failed');
      }
  }, (error) => {
      console.log('OTP error: ', error.response);
      throw error; 
  });
};

const authService = {
  register,
  login,
  logout,
  verifyOtp,
  registrationVerify,
  resendOTP
};

export default authService;
