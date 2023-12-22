import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { login, logout, resendOTP, verifyOtp } from "../slices/auth";
import { clearMessage } from "../slices/message"
import { RootState } from '../store';
import AuthService from "../services/AuthService"

// import { useAppDispatch } from '../useAppDispatch'; 
// const API_URL = import.meta.env.VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import '../assets/Auth.css'
// import AuthService from "../services/AuthService"
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck, faTrash, faTrashCan, faSpinner } from '@fortawesome/free-solid-svg-icons';



type RegisterSigninProps = {}

type Error = {
    description: string
}

export const RegisterSignin = ({ }: RegisterSigninProps) => {



    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state
    const [changePassword, setChangePassword] = useState(false);
    const auth = new AuthService



    useEffect(() => {
        if (isLoggedIn && isVerified && token && !otpRequired) {
            navigate('/submissions');
        }
        else {
            //console.log("Cannot navigate to submissions page")
            // dispatch(logout() as any)
            // .unwrap()
            // .then((response:any) => {
            //     //console.log(response)
            //     navigate("/"); 
            // })
            // .catch((error: any) => {
            //     //console.log(error)
            // });
        }
    }, [isLoggedIn, isVerified, token, otpRequired]);

    //console.log(">>> STATE <<<")
    //console.log(state)

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
    const [registrationSuccess, setRegistrationSuccess] = useState({ success: false, message: '' })
    const [regEmail, setRegEmail] = useState('')
    const [regOTP, setRegOTP] = useState('')
    const [registrationVerifyError, setRegistrationVerifyError] = useState(false)

    const [signinError, setSigninError] = useState(false)
    const [signinSuccess, setSigninSuccess] = useState({ success: false, message: '' })
    const [signinErrorMessage, setSigninErrorMessage] = useState('')
    const [signinEmail, setSigninEmail] = useState('')
    const [signinPassword, setSigninPassword] = useState('')
    const [signinOTP, setSigninOTP] = useState('')
    const [signinVerifyError, setSigninVerifyError] = useState(false)

    const [confirmMessage, setConfirmMessage] = useState("Instructions for resetting your password have been sent to your email address.")

    const [emailSent, setEmailSent] = useState(false)

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
        //console.log(event.target.value)
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

    const passwordResetLink = async (event: any) => {
        event.preventDefault()
        //console.log("clicked")
        setChangePassword(true)
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

        // //console.log('Registration URL: ' + API_URL + '/api/users')

        axios.post(API_URL + '/api/users', user)
            .then((response) => {

                switch (response.data.outcome) {
                    case 'success':
                        //console.log(response.data.message)
                        setRegistrationError(false)
                        setRegistrationSuccess({ success: true, message: response.data.message })
                        setRegEmail(response.data.email)
                        break
                    case 'error':
                        //console.log('Registration error: ' + response.data.error)
                        setRegistrationSuccess({ success: false, message: '' })
                        setRegistrationError(true)
                        setRegErrorMessage(response.data.error)
                        break
                    default:
                        //console.log('Unknown registration outcome')
                        break
                }

            }, (error) => {
                //console.log('Registration error: ', error.response)
            })

    }

    const signIn = (event: any) => {
        event.preventDefault()
        setLoading(true);
        setSigninError(false)
        // //console.log(`>>> signin with ${email} and password: ${password}`)
        dispatch(login({ username: email, password: password }) as any)
            .unwrap()
            .then((response: any) => {
                setSigninError(false)
                setLoading(false);
                // window.location.reload();
                console.log(response)
            })
            .catch((error: any) => {
                setLoading(false);
                setSigninError(true)
                setSigninErrorMessage(error)
                console.log(error)
            });
    }

    const signinVerify = async (event: any) => {
        event.preventDefault()
        setLoading(true);
        // const dispatch = useAppDispatch();
        //console.log(">>> signin")
        try {
            dispatch(verifyOtp({ otp: signinOTP }) as any)
            .unwrap()
            .then(async (message: any) => {
                //console.log("Reidrecting...")
                //console.log(message)
                let decoded = await auth.decodedToken()
                //console.log(decoded)
                if (isVerified) {
                    navigate('/submissions');
                }
            })
            .catch((error: any) => {
                // Handle the error
                //console.log(error)
                setSigninVerifyError(true)
            });

        } catch (error) {
            console.error('Error checking token validity:', error);
            setChangePassword(false);
        }finally {
            setLoading(false); // Stop loading after the async operation is done
        }

    }

    const requestNewPassword = (event: any) => {
        event.preventDefault()
        setLoading(true);
        setSigninErrorMessage('')
        //console.log(password);
        const checkTokenValidity = async () => {
            try {
                //console.log("...requesting token" + email)
                const response = await axios.post(`${API_URL}/api/users/password/forgotPasswordRequest`,
                    { username: email });
                // Check response to determine if the token is valid
                //console.log(".......response is coming from server >", response)
                if (response.data.outcome === "success") {
                    setChangePassword(false);
                    setEmailSent(true)
                } else {
                    setChangePassword(false);
                }
            } catch (error:any) {
                let message = error && error.response && error.response.data && error.response.data.error ? error.response.data.error : "Error resetting password";
                setSigninErrorMessage(message);
                setSigninError(true)
                console.error(message);
                setChangePassword(false);
            } finally {
            setLoading(false); // Stop loading after the async operation is done
            }
        };

        checkTokenValidity();


    }




    const handleResendOTP = () => {
        dispatch(resendOTP({ email }) as any)
    }



    const handleLogout = (event: any) => {
        event.preventDefault()
        dispatch(logout() as any)
            .unwrap()
            .then(() => {
                //console.log("Logging out...")
                navigate("/"); // This will redirect to the home page
            })
            .catch((error: any) => {
                // Handle the error
                //console.log(error)
            });
    }



    return (

        <>
            <section className="admin-main-section d-flex align-items-center justify-content-center vh-100">
                <section className="form-container  text-left" style={{ width: "100%", maxWidth: '500px' }}>

                    {isLoggedIn ?
                        <Navigate to="/submissions" replace={true} />
                        : <>
                            <div className="row" style={{ border: '1px solid #eee', backgroundColor:"#fff"}}>
                                <div className="col-md-4 text-center" style={{ padding: "50px 20px", backgroundColor: '#b2292e', color: 'white' }}>
                                    <div style={{
                                        display: 'block', margin: '0 auto 10px auto', width: "130px", backgroundColor: '#fff', maxWidth: '130px',
                                        minWidth: "130px", minHeight: "130px", height: "130px", maxHeight: '130px', padding: '10px', borderRadius: '50%'
                                    }}>
                                        <img style={{ maxWidth: "120px", height: "auto", padding: "15px 0 0 0" }} src="/jsswf-01.svg" width="100" className="d-inline-block" alt="" />
                                    </div>
                                    <h3 style={{ fontWeight: 400 }}>
                                        <span><strong>SWiF</strong></span>
                                    </h3>
                                    <h4 style={{ fontWeight: 400 }}>

                                    </h4>
                                    <div className="" style={{ fontSize: "80%", lineHeight: "1rem" }}>
                                        Simple and Secure<br />Web Forms
                                    </div>

                                </div>
                                <div className="col-md-8" style={{ padding: '30px' }}>



                                    {otpRequired ?
                                        <>

                                            <form onSubmit={signinVerify} className="swf-form">
                                                <div className=" py-1 px-1 otp-card fade show">
                                                    <h5 className="m-0">Two-Factor Authentication</h5>
                                                    <br />
                                                    <div className="fs-6 mb-1">Enter the 6-digit code sent to your email.</div>
                                                    {signinVerifyError ?
                                                        <div className="alert p-1 mb-1 mt-3 alert-danger fade show text-center text-danger fw-normal">
                                                            Incorrect Code, Please Try Again.
                                                        </div>
                                                        : <></>
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

                                                        <div className="text-center">
                                                            
                                                            <button type="submit" className="mt-1 btn btn-primary"  disabled={loading}>
                                                                    {loading ? (
                                                                        <>
                                                                            <FontAwesomeIcon icon={faSpinner} spin />
                                                                            &nbsp;Confirming...
                                                                        </>
                                                                    ) : (
                                                                        "Confirm"
                                                                    )}
                                                                </button>                                                            
                                                        </div>


                                                    </div>
                                                    <div className="text-center mt-3"><span className="d-block mobile-text">Didn't received the code?</span></div>
                                                </div>
                                            </form>
                                            <div className="font-weight-bold p-0 mt-0 text-center cursor"><button onClick={handleResendOTP} className="btn btn-sm btn-link" >Resend</button></div>


                                        </>
                                        : <>
                                            {changePassword ? (
                                                <>
                                                    <form onSubmit={requestNewPassword} className="swf-form">
                                                        <h4 className="mb-3">Forgot your password?</h4>



                                                        <div>
                                                            <label className="mb-1">Username</label>


                                                            <input type="email"
                                                                className="form-control px-2 py-2"
                                                                id="email" value={email}
                                                                onChange={emailChange}
                                                                placeholder="email" required />

                                                        </div>



                                                        <div className="mt-2">
                                                                <button className="mt-1 btn btn-primary" disabled={loading}>
                                                                    {loading ? (
                                                                        <>
                                                                            <FontAwesomeIcon icon={faSpinner} spin />
                                                                            &nbsp;Submitting request...
                                                                        </>
                                                                    ) : (
                                                                        "Submit"
                                                                    )}
                                                                </button>
                                                        </div>


                                                        <div className="mt-3 small mb-4">
                                                            <a href="/" className="">
                                                                Click here to Log in.
                                                            </a>
                                                        </div>
                                                    </form>
                                                </>
                                            )
                                                : (
                                                    <>
                                                        <form onSubmit={signIn} className="swf-form">
                                                            <h4 className="mb-3">Log in</h4>

                                                            {emailSent && (
                                                                <div className="mt-1 mb-1 text-center" style={{ borderRadius:"5px", backgroundColor:"#eee", 
                                                                    padding:"7px 10px", lineHeight:"1rem", color: "#004085", fontSize: "13px" }} role="alert">
                                                                    {confirmMessage}
                                                                </div>
                                                            )}
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
                                                                <button className="mt-1 btn btn-primary"  disabled={loading}>
                                                                {loading ? (
                                                                    <>
                                                                        <FontAwesomeIcon icon={faSpinner} spin />
                                                                        &nbsp;Log in...
                                                                    </>
                                                                ) : (
                                                                    "Log In"
                                                                )}
                                                                </button>
                                                            </div>

                                                            {signinError && (
                                                                <div className="mt-1 mb-1" style={{ color: "red", fontSize: "12px" }} role="alert">
                                                                    {signinErrorMessage}
                                                                </div>
                                                            )}

                                                            <div className="mt-3 mb-4 small">
                                                                Forgot your password? <span><a href="#" className="" onClick={passwordResetLink}>Click to reset.</a></span>
                                                            </div>
                                                        </form>


                                                    </>
                                                )
                                            }
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