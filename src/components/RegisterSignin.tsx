import { useState } from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import '../assets/Auth.css'

type RegisterSigninProps = {}

type Error = {
    description: string
}

export const RegisterSignin = ({}: RegisterSigninProps) => {

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

    const [signinError, setSigninError] = useState(false)
    const [signinSuccess, setSigninSuccess] = useState({success: false, message: ''})
    const [signinErrorMessage, setSigninErrorMessage] = useState('')
    const [signinEmail, setSigninEmail] = useState('')
    const [signinPassword, setSigninPassword] = useState('')

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
    }

    const signinPasswordChange = (event: any) => {
        setSigninPassword(event.target.value)
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

        axios.post(API_URL + '/api/authenticate/login', {email: signinEmail, password: signinPassword})
        .then((response) => {
            switch(response.data.outcome) {
                case 'success':
                    console.log(response.data.message)
                    setSigninError(false)
                    setSigninSuccess({success: true, message: response.data.message})
                    break
                case 'error':
                    console.log('Registration error: ' + response.data.error)
                    setSigninSuccess({success: false, message: ''})
                    setSigninError(true)
                    setSigninErrorMessage(response.data.error)
                    break
                default:
                    console.log('Unknown registration outcome')
                    break
            }
            
        })
            
    }

    return (
        <>
            
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
                                    <form>
                                        <div className="card py-5 px-3 otp-card fade show">
                                            <h5 className="m-0">Email verification</h5>
                                            <br/>
                                            <span className="mobile-text">Enter the code we just send on your email <b>{signinEmail}</b></span>
                                            <div className="d-flex flex-row mt-5 otp-row">
                                                <input type="text" className="form-control otp-input" placeholder="  ###### " />
                                                <a className="btn btn-secondary otp-button" >Verify</a>
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
    
                        </div>
                        <div id="welcome_register" className="tab-pane fade" role="tabpanel">

                            { registrationSuccess.success ?                                                                                                                                       
                                <>
                                    <br/><div className="alert alert-success fade show text-success fw-bold text-center" role="alert">{registrationSuccess.message}</div>
                                    <form>
                                        <div className="card py-5 px-3 otp-card fade show">
                                            <h5 className="m-0">Email verification</h5>
                                            <br/>
                                            <span className="mobile-text">Enter the code we just send on your email <b>{regEmail}</b></span>
                                            <div className="d-flex flex-row mt-5 otp-row">
                                                <input type="text" className="form-control otp-input" placeholder="  ###### " />
                                                <a className="btn btn-secondary otp-button" >Verify</a>
                                            </div>
                                            <div className="text-center mt-5"><span className="d-block mobile-text">Don't receive the code?</span><span className="font-weight-bold text-danger cursor">Resend</span></div>
                                        </div>
                                    </form>
                                </>
                                    
                                : <>
                                    <form onSubmit={register} >
                                        <div className="mb-3">
                                            <select className='form-select' id="agency" value={agency} onChange={agencyChange} placeholder="Select your agency">
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

                            { registrationError ?                                                                                                                                       
                                <><br/><div className="alert alert-danger fade show text-center text-danger fw-bold" role="alert">{regErrorMessage}</div></>
                                : ''
                            }
    
                        </div>
                    </div>
                </div>    
    
        </>
        )
}