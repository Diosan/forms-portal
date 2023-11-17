import { useState } from "react"
import { API_URL} from "../config/api"
import axios from "axios"

type RegisterSigninProps = {}

export const RegisterSignin = ({}: RegisterSigninProps) => {

    const [agency, setAgency] = useState('TTPS')
    const [regNumber, setRegNumber] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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

    const register = () => {
        
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
                    break
                case 'error':
                    console.log('Registration error: ' + response.data.error)
                    break
                default:
                    console.log('Unknown registration outcome')
                    break
            }

        }, (error) => {
            console.log('Registration error: ', error.response)
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
                        
                            <form>
                                <div className="mb-3">
                                    {/* <label for="exampleInputEmail1" className="form-label">Email address</label> */}
                                    <input type="email" className="form-control" id="loginEmail" aria-describedby="emailHelp" placeholder="email" />
                                </div>
                                <div className="mb-3">
                                    {/* <label for="exampleInputPassword1" className="form-label">Password</label> */}
                                    <input type="password" className="form-control" id="loginPassword" placeholder="password" />
                                </div>
                                {/* <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                    <label className="form-check-label" for="exampleCheck1">Check me out</label>
                                </div> */}

                                
                            </form>
                            <div className="d-grid gap-2">
                                <a className="btn btn-secondary" onClick={register}>Sign In</a>
                            </div>
    
                        </div>
                        <div id="welcome_register" className="tab-pane fade" role="tabpanel">
                            
                            <form>
                                <div className="mb-3">
                                    <select className='form-select' id="agency" value={agency} onChange={agencyChange} placeholder="Select your agency">
                                        <option>Select your agency</option>
                                        <option>TTPS (Trinidad & Tobago Police Service)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="regNumber" value={regNumber} onChange={regNumberChange} placeholder="Regimental Number" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="firstName" value={firstName} onChange={firstNameChange} placeholder="First Name" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="lastName" value={lastName} onChange={lastNameChange} placeholder="Last Name" />
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control" id="email1" value={email} onChange={emailChange} placeholder="email" />
                                </div>
                                <div className="mb-3">                                
                                    <input type="password" className="form-control" id="password" value={password} onChange={passwordChange} placeholder="password" />
                                </div>                       
                            </form>
                            <div className="d-grid gap-2">
                                <a className="btn btn-secondary" onClick={register} >Register</a>
                            </div> 
    
                        </div>
                    </div>
                </div>    
    
        </>
        )
}