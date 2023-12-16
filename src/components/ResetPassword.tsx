import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { resetPassword } from "../slices/auth";
import { RootState } from "../store";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons
import { clearMessage } from "../slices/message"
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom"
import dotenv from "dotenv"




const API_URL = import.meta.env.VITE_API_URL
// import { API_URL } from "../config/api";



import "../assets/Auth.css";

export const PasswordReset = () => {

    const initialValues = {
        password: '',
        confirmPassword: ''
    };

    const navigate = useNavigate()


    const [resetToken, setResetToken] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const location = useLocation();
    const PASSWORD_URL =  import.meta.env.VITE_PAASSWORD_URL

    useEffect(() => {
        const tokenFromUrl = location.pathname.split('/').pop();
        setResetToken(tokenFromUrl || "");
        console.log("Token form url", tokenFromUrl)
        const checkTokenValidity = async () => {
            try {
                console.log("...checking token")
                const response = await axios.post(`${PASSWORD_URL}/password/new/${tokenFromUrl}`);
                // Check response to determine if the token is valid
                console.log(".......response from server >", response)
                if (response.data.outcome === "valid") {
                    setIsValidToken(true);
                } else {
                    setIsValidToken(false);
                }
            } catch (error) {
                console.error('Error checking token validity:', error);
                setIsValidToken(false);
            }
        };

        if (tokenFromUrl) {
            checkTokenValidity();
        }
    }, [location]);

    const [loading, setLoading] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, isVerified } = state;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



    console.log(">>> STATE <<<")
    // console.log(state)
    const dispatch = useAppDispatch();


    useEffect(() => {
        validatePassword(password, confirmPassword);
    }, [password, confirmPassword]);

  

    const handleSubmit = async (event: any,) => {
        event.preventDefault();

        console.log(password);
        // return
        const newPassword = password || "";
        dispatch(resetPassword({ password: newPassword, token: resetToken }) as any)
            .unwrap()
            .then((message: any) => {
                console.log("Resetting Password")
                console.log("response received:   ",message)
                if (message.outcome == "success") {
                    navigate('/');
                    console.log("success")
                }
                navigate('/');
            })
            .catch((error: any) => {
                // Handle the error
                console.log(error)
                navigate('/');
                // setSigninVerifyError(true)
            });

    };

    const validatePassword = (password: string, confirmPassword: string) => {
        setPasswordCriteria({
            minLength: password.length >= 8,
            lettersAndNumbers: /[a-z]/i.test(password) && /\d/.test(password),
            uppercase: /[A-Z]/.test(password),
            passwordsMatch: password === confirmPassword && password !== ""
        });
    };


    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        lettersAndNumbers: false,
        uppercase: false,
        passwordsMatch: false
    });


    const passwordSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required')
    });


    const renderCriteria = (criteria: any, text: any) => (
        <div style={{ color: criteria ? 'green' : 'grey' }}>
            {criteria ? <FaCheck /> : <FaTimes />} {text}
        </div>
    );

    const allCriteriaMet = () => {
        return Object.values(passwordCriteria).every(value => value === true);
    };

    return (
        !isValidToken ? (
            <>
                <h5 className="mt-4">Invalid or expired password reset link
                </h5>
                <p><a href="/">Please try again.</a></p>
            </>
        ) : (
            <>

                            <section className="admin-main-section d-flex align-items-center justify-content-center vh-100">
                                <section className="form-container container text-left" style={{ maxWidth: "600px" }}>
                                    {!isLoggedIn && !otpRequired && (
                                        <div className="row" style={{ border: "1px solid #eee" }}>
                                            <div
                                                className="col-md-4 text-center"
                                                style={{
                                                    padding: "30px",
                                                    backgroundColor: "#b2292e",
                                                    color: "white",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "block",
                                                        margin: "0 auto 10px auto",
                                                        backgroundColor: "#fff",
                                                        width: "140px",
                                                        height: "140px",
                                                        padding: "10px",
                                                        borderRadius: "50%",
                                                    }}
                                                >
                                                    <img
                                                        src="/jsswf-01.svg"
                                                        width="120"
                                                        className="d-inline-block"
                                                        alt=""
                                                    />
                                                </div>
                                                <h3 style={{ fontWeight: 400 }}>
                                                    <span>
                                                        <strong>SWF</strong>
                                                    </span>
                                                </h3>
                                                <h4 style={{ fontWeight: 400 }}></h4>
                                                <div>Simple and Secure Web Forms</div>
                                            </div>
                                            <div className="col-md-8" style={{ padding: "30px" }}>
                                                <form onSubmit={handleSubmit} className="swf-form">
                                                    <h4 className="mb-3">Enter New Password</h4>

                                                    <div className="form-group">
                                                        <label>Password</label>
                                                        <input
                                                            type="password"
                                                            value={password}
                                                            onChange={e => setPassword(e.target.value)}
                                                            className="form-control px-2 py-2"
                                                            style={{ borderRadius: 0, margin: "5px 0 15px 0" }}
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Confirm Password</label>
                                                        <input
                                                            type="password"
                                                            value={confirmPassword}
                                                            onChange={e => setConfirmPassword(e.target.value)}
                                                            className="form-control px-2 py-2"
                                                            style={{ borderRadius: 0, margin: "5px 0 15px 0" }}
                                                        />
                                                    </div>

                                                    <button type="submit" className="btn btn-primary mb-1" disabled={!allCriteriaMet()}>
                                                        Submit
                                                    </button>


                                                    <div className="validation-box" style={{ fontSize: "12px" }}>
                                                        <div className="fs-6 mb-1" style={{ fontSize: "14px" }}>Password Requirements:</div>
                                                        {renderCriteria(passwordCriteria.minLength, "Must be at least 8 characters")}
                                                        {renderCriteria(passwordCriteria.lettersAndNumbers, "Must be a series of letters and numbers")}
                                                        {renderCriteria(passwordCriteria.uppercase, "Must include an uppercase letter")}
                                                        {renderCriteria(passwordCriteria.passwordsMatch, "Passwords must match")}
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            </section>
         


            </>
        )
    );
};
function setPasswordCriteria(arg0: { minLength: boolean; lettersAndNumbers: boolean; uppercase: boolean; passwordsMatch: boolean; }) {
    throw new Error("Function not implemented.");
}

