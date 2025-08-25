import React, { useState, useEffect  } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { login, logout, verifyOtp } from "../slices/auth";
import { clearMessage } from "../slices/message"
import { RootState } from '../store';
import Logo from "../assets/jwflogo.svg"

// import { useAppDispatch } from '../useAppDispatch'; 
const API_URL = import.meta.env.VITE_API_URL
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
        .then(() => {
            console.log("Reidrecting")
            if (isVerified) {
            navigate('/submissions');
            }
        })
        .catch((error: any) => {
            // Handle the error
            console.log(error)
        });



    }

    const registrationVerify = (event: any) => {

        event.preventDefault()

    }

    const handleLogout = (event: any) => {
        event.preventDefault();
        dispatch(logout() as any)
    }

    return (

        <>


            { isLoggedIn ?
                 <Navigate to="/submissions" replace={true} /> 
                 :  
                <>
            





            <section className="admin-main-section d-flex align-items-center justify-content-center vh-100" 
                >

            <section className="form-container container text-left" style={{ maxWidth: '600px' }}>
                <div className="row" style={{ border: '1px solid #eee' }}>
                    <div className="col-md-6 text-center" style={{ padding: '30px', backgroundColor: '#b2292e', color: 'white' }}>
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
                        <div className="col-md-6" style={{ padding: '40px' }}>
                            <form onSubmit={signIn} >
                                <div>
                                <label className="mb-1">Username</label>
                                <input 
                                type="email" className="form-control px-2 py-1" id="loginEmail" aria-describedby="emailHelp" 
                                placeholder="email" value={signinEmail} onChange={signinEmailChange} required />

                                </div>
                                <div>
                                <label className="mb-1">Password</label>
                                <input type="password" className="form-control px-2 py-1" id="loginPassword" 
                                placeholder="password" 
                                value={signinPassword} onChange={signinPasswordChange} required />

                                </div>

                                <div className="">
                                    <button  className="mt-1 btn btn-primary">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>

                </section>
            </section>




                 <div className='row'>
                     <ul className="nav nav-tabs justify-content-center">
                         <li className="nav-item active">
                             <a className="nav-link active jud-tab" aria-current="page" data-bs-toggle="tab" href="#welcome_signin">Sign In</a>
                         </li>
                         <li className="nav-item">
                             <a className="nav-link jud-tab"  data-bs-toggle="tab" href="#welcome_register">Register</a>
                         </li>
                     </ul>
                 </div>
     
                 <div className='row'> 
                       
                     <div className="tab-content">
                         <div id="welcome_signin" className="tab-pane fade show active" role="tabpanel">
 
                             { signinSuccess.success ?
                                 <>
                                     <br/><div className="alert alert-success fade show text-success fw-bold text-center" role="alert">{signinSuccess.message}</div>    
                                 </>
                                 : <></>
                             }    
                         
                             
                             { otpRequired ? 
                                 <>
                                     
                                     <form onSubmit={signinVerify} >
                                         <div className="card py-5 px-3 otp-card fade show">
                                             <h5 className="m-0">Email verification</h5>
                                             <br/>
                                             <span className="mobile-text">Enter the code we just sent to your email <b>{signinEmail}</b></span>
                                             <div className="d-flex flex-row mt-5 otp-row">
                                                 <input type="text" className="form-control otp-input" placeholder="  ###### " value={signinOTP} onChange={signinOTPChange} />
                                                 <button type="submit" className="btn btn-secondary otp-button" >Verify</button>
                                             </div>
                                             <div className="text-center mt-5"><span className="d-block mobile-text">Don't receive the code?</span><span className="font-weight-bold text-danger cursor">Resend</span></div>
                                         </div>
                                     </form>
                                 </>
                                 : <>
 
                                     <form onSubmit={signIn}>
 
                                         <div className="mb-3">
                                             <input type="email" className="form-control" id="loginEmail" aria-describedby="emailHelp" placeholder="email" value={signinEmail} onChange={signinEmailChange} required />
                                         </div>
                                         <div className="mb-3">
                                             <input type="password" className="form-control" id="loginPassword" placeholder="password" value={signinPassword} onChange={signinPasswordChange} required />
                                         </div>
 
                                         <div className="d-grid gap-2">
                                             <button type="submit" className="btn btn-secondary">Sign In</button>
                                         </div>
 
                                     </form>
 
                                     { signinError ?                                                                                                                                       
                                         <><br/><div className="alert alert-danger fade show text-center text-danger fw-bold" role="alert">{signinErrorMessage}</div></>
                                         : ''
                                     }
 
                                 </>
                             }
 
                             { signinVerifyError ?                                                                                                                                       
                                 <><br/><div className="alert alert-danger fade show text-center text-danger fw-bold" role="alert">Sign in verification error</div></>
                                 : <></>
                             }
 
     
                         </div>
                         <div id="welcome_register" className="tab-pane fade" role="tabpanel">
 
 
 
                             { registrationSuccess.success ?                                                                                                                                       
                                 <>
                                     <br/><div className="alert alert-success fade show text-success fw-bold text-center" role="alert">{registrationSuccess.message}</div>
                                     <form onSubmit={registrationVerify}>
                                         <div className="card py-5 px-3 otp-card fade show">
                                             <h5 className="m-0">Email verification</h5>
                                             <br/>
                                             <span className="mobile-text">Enter the code we just send on your email <b>{regEmail}</b></span>
                                             <div className="d-flex flex-row mt-5 otp-row">
                                                 <input type="text" className="form-control otp-input" placeholder="  ###### " value={regOTP} onChange={regOTPChange} />
                                                 <button type="submit" className="btn btn-secondary otp-button" >Verify</button>
                                             </div>
                                             <div className="text-center mt-5"><span className="d-block mobile-text">Don't receive the code?</span><span className="font-weight-bold text-danger cursor">Resend</span></div>
                                         </div>
                                     </form>
                                 </>
                                     
                                 : <>
                                     <form onSubmit={register} >
                                         <div className="mb-3">
                                             <select className='form-select' id="agency" value={agency} onChange={agencyChange} >
                                                 <option>Select your agency</option>
                                                 <option value="TTPS">TTPS (Trinidad & Tobago Police Service)</option>
                                             </select>
                                         </div>
                                         <div className="mb-3">
                                             <input type="text" className="form-control" id="regNumber" value={regNumber} onChange={regNumberChange} placeholder="Regimental Number" required />
                                         </div>
                                         <div className="mb-3">
                                             <input type="text" className="form-control" id="firstName" value={firstName} onChange={firstNameChange} placeholder="First Name" required />
                                         </div>
                                         <div className="mb-3">
                                             <input type="text" className="form-control" id="lastName" value={lastName} onChange={lastNameChange} placeholder="Last Name" required />
                                         </div>
                                         <div className="mb-3">
                                             <input type="email" className="form-control" id="email1" value={email} onChange={emailChange} placeholder="email" required />
                                         </div>
                                         <div className="mb-3">                                
                                             <input type="password" className="form-control" id="password" value={password} onChange={passwordChange} placeholder="password" required />
                                         </div>
 
                                         <div className="d-grid gap-2">
                                             <button type="submit" className="btn btn-secondary" >Register</button>
                                         </div>
 
                                     </form>
                                 </>
                             }
 
                             { registrationVerifyError ?                                                                                                                                       
                                 <><br/><div className="alert alert-danger fade show text-center text-danger fw-bold" role="alert">Registration verification error</div></>
                                 : <></>
                             }
 
                             { registrationError ?                                                                                                                                       
                                 <><br/><div className="alert alert-danger fade show text-center text-danger fw-bold" role="alert">{regErrorMessage}</div></>
                                 : ''
                             }
     
                         </div>
                     </div>
                 </div>    
     
                    </>
            }
        
        </>



    )
}