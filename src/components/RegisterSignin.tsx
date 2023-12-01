import React, { useState, useEffect  } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { login, logout, resendOTP, verifyOtp } from "../slices/auth";
import { clearMessage } from "../slices/message"
import { RootState } from '../store';

// import { useAppDispatch } from '../useAppDispatch'; 
import { API_URL} from "../config/api"
import axios from "axios"
import '../assets/Auth.css'
// import AuthService from "../services/AuthService"
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";


type RegisterSigninProps = {}

type Error = {
    description: string
}

export const RegisterSignin = ({}: RegisterSigninProps) => {

    

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const {isLoggedIn, otpRequired, token, isVerified} = state

 

    useEffect(() => {
        if (isLoggedIn && isVerified && token && !otpRequired) {
          navigate('/submissions');
        } 
        else{
            console.log("Cannot navigate to submissions page")
        }
      }, [isLoggedIn, isVerified, token, otpRequired]);

      console.log(">>> STATE <<<")
      console.log(state)

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearMessage());
      }, [dispatch]);

    const initialValues = {
        username: "",
        password: "",
      };

    let regErrs: Error[] = []

    const [agency, setAgency] = useState('TTPS')
    const [regNumber, setRegNumber] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [registrationError, setRegistrationError] = useState(false)
    const [regErrorMessage, setRegErrorMessage] = useState('')
    const [registrationSuccess, setRegistrationSuccess] = useState({success: false, message: ''})
    const [regEmail, setRegEmail] = useState('')
    const [regOTP, setRegOTP] = useState('')
    const [registrationVerifyError, setRegistrationVerifyError] = useState(false)

    const [signinError, setSigninError] = useState(false)
    const [signinSuccess, setSigninSuccess] = useState({success: false, message: ''})
    const [signinErrorMessage, setSigninErrorMessage] = useState('')
    const [signinEmail, setSigninEmail] = useState('')
    const [signinPassword, setSigninPassword] = useState('')
    const [signinOTP, setSigninOTP] = useState('')
    const [signinVerifyError, setSigninVerifyError] = useState(false)

    const agencyChange = (event: any) => {
        setAgency(event.target.value)
    }

    const regNumberChange = (event: any) => {
        setRegNumber(event.target.value)
    }

    const firstNameChange = (event: any) => {
        setFirstName(event.target.value)
    }

    const lastNameChange = (event: any) => {
        setLastName(event.target.value)
    }

    const emailChange = (event: any) => {
        setEmail(event.target.value)
    }

    const setOtpError = (event: any) => {
        setSigninVerifyError(true)
    }

    const passwordChange = (event: any) => {
        setPassword(event.target.value)
    }

    const signinEmailChange = (event: any) => {
        setSigninEmail(event.target.value)
        console.log(event.target.value)
    }

    const signinPasswordChange = (event: any) => {
        setSigninPassword(event.target.value)
    }

    const signinOTPChange = (event: any) => {
        setSigninOTP(event.target.value)
    }

    const regOTPChange = (event: any) => {
        setRegOTP(event.target.value)
    }


    const register = (event: any) => {

        event.preventDefault()
        
        let user = {
            agency: agency,
            reg_number: regNumber,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password
        }

        // console.log('Registration URL: ' + API_URL + '/api/users')

        axios.post(API_URL + '/api/users', user)
        .then((response) => {
            
            switch(response.data.outcome) {
                case 'success':
                    console.log(response.data.message)
                    setRegistrationError(false)
                    setRegistrationSuccess({success: true, message: response.data.message})
                    setRegEmail(response.data.email)
                    break
                case 'error':
                    console.log('Registration error: ' + response.data.error)
                    setRegistrationSuccess({success: false, message: ''})
                    setRegistrationError(true)
                    setRegErrorMessage(response.data.error)
                    break
                default:
                    console.log('Unknown registration outcome')
                    break
            }

        }, (error) => {
            console.log('Registration error: ', error.response)            
        })

    }

    const signIn = (event: any) => {
        event.preventDefault()
        console.log(`>>> signin with ${email} and password: ${password}`)
        dispatch(login({ username:email, password: password }) as any)
        // .unwrap()
        // .then(() => {
        //     navigate("/submissions");
        //     window.location.reload();
        // })
        // .catch(() => {
        //     setLoading(false);
        // });
    }

    const signinVerify = (event: any) => {
        event.preventDefault()
        // const dispatch = useAppDispatch();
        console.log(">>> signin")
        dispatch(verifyOtp({otp: signinOTP}) as any)
        .unwrap()
        .then((message: any) => {
            console.log("Reidrecting")
            console.log(message)
            if (isVerified) {
            navigate('/submissions');
            }
        })
        .catch((error: any) => {
            // Handle the error
            console.log(error)
            setSigninVerifyError(true)
        });

    }

    const registrationVerify = (event: any) => {

        event.preventDefault()

    }

    const handleResendOTP = () => {
        dispatch(resendOTP({email}) as any )
    }

    return (

        <>
             <section className="admin-main-section d-flex align-items-center justify-content-center vh-100">
                    <section className="form-container container text-left" style={{ maxWidth: '600px' }}>

            { isLoggedIn ?
                 <Navigate to="/submissions" replace={true} /> 
                 : <>
                    <div className="row" style={{ border: '1px solid #eee' }}>
                        <div className="col-md-4 text-center" style={{ padding: '30px', backgroundColor: '#b2292e', color: 'white' }}>
                            <div style={{ display: 'block', margin: '0 auto 10px auto', backgroundColor: '#fff', width: '140px', height: '140px', padding: '10px', borderRadius: '50%' }}>
                                <img src="/jsswf-01.svg" width="120"  className="d-inline-block" alt="" />
                            </div>
                            <h3 style={{ fontWeight: 400 }}>
                                <span><strong>SWF</strong></span>
                            </h3>
                            <h4 style={{ fontWeight: 400 }}>
                                
                            </h4>
                            <div>
                                Simple and Secure Web Forms
                            </div>
                                
                        </div> 
                        <div className="col-md-8" style={{ padding: '30px' }}>


                            
                            { otpRequired ? 
                                    <>
                                        
                                        <form onSubmit={signinVerify} className="swf-form">
                                            <div className=" py-1 px-1 otp-card fade show">
                                                <h5 className="m-0">Two-Factor Authentication</h5>
                                                <br/>
                                                <div className="fs-6 mb-1">Enter the 6-digit code sent to your email.</div>
                                                {signinVerifyError ? 
                                                        <div className="alert p-1 mb-1 mt-3 alert-danger fade show text-center text-danger fw-normal">
                                                            Incorrect Code, Please Try Again.
                                                        </div>
                                                    :<></>
                                                    }
                                                <div className="">
                                                    <input
                                                        name="otpCode"
                                                        placeholder="******"
                                                        style={{ fontSize: "16px", letterSpacing: '7px', textAlign: 'center' }}
                                                        className="px-2 py-1 fs-3 mt-2 mb-3 stretched-text-input"
                                                        maxLength={6}
                                                        value={signinOTP} 
                                                        onChange={signinOTPChange}
                                                        minLength={6}
                                                        pattern="\d{6}"
                                                        />
                                                    
                                                   <div className="text-center"><button type="submit" className="btn btn-lg btn-secondary" >Confirm</button></div> 
                                                    

                                                </div>
                                                <div className="text-center mt-3"><span className="d-block mobile-text">Haven't received the code?</span></div>
                                            </div>
                                        </form>
                                        <div className="font-weight-bold p-0 mt-0 text-center cursor"><button onClick={handleResendOTP} className="btn btn-sm btn-link" >Resend</button></div>

                                        
                                    </>
                                    : <>
                                            <form onSubmit={signIn}  className="swf-form">
                                                <div>
                                                <label className="mb-1">Username</label>
                                 

                                                <input type="email" 
                                                    className="form-control px-2 py-2" 
                                                    id="email" value={email} 
                                                    onChange={emailChange} 
                                                    placeholder="email" required />

                                                </div>
                                                <div>
                                                <label className="mb-1">Password</label>
                
                                                <input type="password" 
                                                    className="form-control px-2 py-2" 
                                                    id="password" value={password} 
                                                    onChange={passwordChange} 
                                                    placeholder="password" 
                                                    required />

                                                </div>

                                                <div className="">
                                                    <button  className="mt-1 btn btn-primary">Log In</button>
                                                </div>
                                            </form>
                                            {signinError && (
                                                <div className="alert alert-danger fade show text-center text-danger fw-bold" role="alert">
                                                    {signinErrorMessage}
                                                </div>
                                            )}
                                            {signinSuccess.success && (
                                                <div className="alert alert-success fade show text-success fw-bold text-center" role="alert">
                                                    {signinSuccess.message}
                                                </div>
                                            )}
                                    </>
                            }

                        </div>

                    </div>

                </>
            }
            </section>
        </section>

</>



    )
}