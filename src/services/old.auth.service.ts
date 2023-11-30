import axios from "axios";
import { API_URL } from '../config/api'





const register = (user: any) => {
//   return axios.post(API_URL + "/api/users", {
//     username,
//     email,
//     password,
//   });
return axios.post(API_URL + '/api/users', user)
        .then((response) => {
            
            switch(response.data.outcome) {
                case 'success':
                    console.log(response.data.message)
                    // setRegistrationError(false)
                    // setRegistrationSuccess({success: true, message: response.data.message})
                    // setRegEmail(response.data.email)
                    break
                case 'error':
                    console.log('Registration error: ' + response.data.error)
                    // setRegistrationSuccess({success: false, message: ''})
                    // setRegistrationError(true)
                    // setRegErrorMessage(response.data.error)
                    break
                default:
                    console.log('Unknown registration outcome')
                    break
            }

        }, (error) => {
            console.log('Registration error: ', error.response)            
        })

};

const login = (email, password) => {
//   return axios
//     .post(API_URL + "/api/authenticate/login", {
//       username,
//       password,
//     })
//     .then((response) => {
//       if (response.data.accessToken) {
//         localStorage.setItem("user", JSON.stringify(response.data));
//       }

//       return response.data;
//     });


    return axios.post(API_URL + '/api/authenticate/login', {email: signinEmail, password: signinPassword})
        .then((response) => {
            switch(response.data.outcome) {
                case 'success':
                    console.log(response.data.message)
                    if (response.data.accessToken) {
                        localStorage.setItem("user", JSON.stringify(response.data));
                    }
                    // setSigninError(false)
                    // setSigninSuccess({success: true, message: response.data.message})
                    break
                case 'error':
                    console.log('Registration error: ' + response.data.error)
                    // setSigninSuccess({success: false, message: ''})
                    // setSigninError(true)
                    // setSigninErrorMessage(response.data.error)
                    break
                default:
                    console.log('Unknown registration outcome')
                    break
            }
            
        })
};

const verifyOtp = (email, otp) => {
    return axios.post(API_URL + '/api/authenticate/verify-otp', {email: email, otp: otp})
        .then((response) => {
            switch(response.data.outcome) {
                case 'success':
                    console.log('OTP verification successful')
                    localStorage.setItem("id_token", response.data.token)
                    // auth.setToken(response.data.token)
                    navigate("/submissions")
                    // setSigninError(false)
                    // setSigninSuccess({success: true, message: response.data.message})
                    break
                case 'error':
                    console.log('OTP verification failed')
                    // setSigninSuccess({success: false, message: ''})
                    // setSigninVerifyError(true)
                    break
                default:
                    console.log('Unknown verification outcome')
                    break
            }
            
        })
};





const registrationVerify = (regEmail, regOTP) => {
    return axios.post(API_URL + '/api/authenticate/verify-otp', {email: regEmail, otp: regOTP})
    .then((response) => {
        switch(response.data.outcome) {
            case 'success':
                // alert('OTP succesfully verified')
                // auth.setToken(response.data.token)
                navigate("/submissions");
                // setSigninError(false)
                // setSigninSuccess({success: true, message: response.data.message})
                break
            case 'error':
                // alert('OTP verification failed')
                // setSigninSuccess({success: false, message: ''})
                // setRegistrationVerifyError(true)
                break
            default:
                console.log('Unknown verification outcome')
                break
        }
        
    })

}









const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
  verifyOtp
};

export default authService;