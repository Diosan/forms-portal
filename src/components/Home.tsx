import Button from 'react-bootstrap/Button';
// import '../assets/Welcome.css'
import { RegisterSignin } from './RegisterSignin';
import judiciaryLogo from '../images/jtt_logo_n.svg'
import eservicesLogo from '../images/eservices-logo.svg'
import jttSmall from '../images/jtt-sq.svg'
import jttRed from '../images/jtt-red.svg'

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { login, logout, resendOTP, verifyOtp } from "../slices/auth";
import { clearMessage } from "../slices/message"
import { RootState } from '../store';
import AuthService from "../services/AuthService"



type WelcomeProps = {}

export const Welcome = ({ }: WelcomeProps) => {
    const navigate = useNavigate();

    const [changePassword, setChangePassword] = useState(false);
    const passwordResetLink = async (event: any) => {
        event.preventDefault()
        navigate('/login', { state: { setChangePassword: true } });
        console.log("link clicked")
    }

    const goToLogin = async (event: any) => {
        event.preventDefault()
        navigate('/login', { state: { setChangePassword: false } });
    }

    return (
        <>
            <div className="swf-container">

                {/* <a className="btn btn-outline-primary btn-lg">Connect with TTPS</a> */}
                <div className='swf-container-inner' style={{ margin: "100px 0 0 0" }}>
                    <div className='swf-home'>
                        <h1 className="text-center">
                            Welcome to <span style={{ color: "#b2292e" }}>SW</span><span style={{ color: "#777", fontFamily: "times", fontStyle: "italic" }}>i</span><span style={{ color: "#b2292e" }}>F</span>
                        </h1>
                        <h2 className="text-center mb-4">
                            Simple and Secure Web Forms
                        </h2>
                        <div className="text-center mb-3">
                            <img style={{ color: "#000", maxWidth: "30px" }} src={jttRed} />
                        </div>
                        <h6 className="text-center">
                            Judiciary of Trinidad and Tobago
                        </h6>
                    </div>
                    <div className="py-4 px-3 mt-5" style={{backgroundColor:"#d3edfe", borderRadius:"5px", color:"#333", maxWidth:"430px", marginLeft:"auto", marginRight:"auto"}}>
                        <h5 className="mb-3">
                            Is this your first time accessing SWIF?
                        </h5>
                        <p className="m-0">
                            If so, please click the button below to set up your SWIF account using your organisation's email address.<br/>

                            <button className="mt-3 btn btn-primary" onClick={passwordResetLink}>
                                Create SWiF Account
                            </button>  

                        </p>
                    </div>

                    <p className="my-3">or</p>

                    <button className="mt-0 btn btn-link" onClick={goToLogin}>
                                Login
                            </button>  

                </div>
            </div>



        </>
    )
}