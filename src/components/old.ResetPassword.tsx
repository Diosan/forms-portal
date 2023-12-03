import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { resetPassword } from "../slices/auth";
import { RootState } from "../store";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons
import { clearMessage } from "../slices/message"


import "../assets/Auth.css";

export const PasswordReset = () => {
    const initialValues = {
        password: '',
        confirmPassword: ''
    };

    const [loading, setLoading] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state;

    console.log(">>> STATE <<<")
    // console.log(state)
    const dispatch = useAppDispatch();

    const passwordSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required')
    });

    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        lettersAndNumbers: false,
        uppercase: false,
        passwordsMatch: false
    });

    const handleSubmit = async (values: any, event:any) => {
        event.preventDefault();
        
        console.log("well");
        return
        const token="asjajsljdasd"
        const newPassword = values.password || "";
        dispatch(resetPassword({ password:newPassword, token:token }) as any)
        .unwrap()
        .then((message: any) => {
            console.log("Reidrecting")
            console.log(message)
            if (message.outcome == "success") {
            // navigate('/');
            }
        })
        .catch((error: any) => {
            // Handle the error
            console.log(error)
            // setSigninVerifyError(true)
        });
        
    };


    // Update the state based on the current password
    const validatePassword = (password: string, confirmPassword: string) => {
        setPasswordCriteria({
            minLength: password.length >= 8,
            lettersAndNumbers: /[a-z]/i.test(password) && /\d/.test(password),
            uppercase: /[A-Z]/.test(password),
            passwordsMatch: password === confirmPassword && password != ""
        });
    };

    // Render the criteria list with appropriate styles and icons
    const renderCriteria = (criteria: any, text: any) => {
        return (
            <div style={{ color: criteria ? 'green' : 'grey' }}>
                {criteria ? <FaCheck /> : <FaTimes />} {text}
            </div>
        );
    };

    const allCriteriaMet = () => {
        return Object.values(passwordCriteria).every(value => value === true);
    };

    return (
        <>
            
                        <section className="admin-main-section d-flex align-items-center justify-content-center vh-100">
                            <section
                                className="form-container container text-left"
                                style={{ maxWidth: "600px" }}
                            >
                                {isLoggedIn ? (
                                    <>
                                        {/* <Navigate to="/" replace={true} /> */}
                                    </>
                                ) : (
                                    <>
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
                                                {otpRequired ? (
                                                    <></>
                                                ) : (
                                                    <>
                                                    <Formik
                                                        initialValues={{ password: '', confirmPassword: '' }}
                                                        validationSchema={passwordSchema}
                                                        onSubmit={(values, { setSubmitting }) => {
                                                            // Handle form submission here
                                                            console.log(values);
                                                            setSubmitting(false);
                                                            handleSubmit
                                                          }}
                                                    >

                                                    
                                                    {({ values, isSubmitting, handleChange }) => {
                                                        useEffect(() => {
                                                            validatePassword(values.password, values.confirmPassword);
                                                        }, [values.password, values.confirmPassword]);

                                                        return (


                                                        <form >
                                                            <h4 className="mb-3">Reset Password</h4>
                                                         

                                                            <div className="form-group">
                                                                <label>Password</label>
                                                                <Field
                                                                    type="password" name="password"
                                                                    style={{borderRadius:0, margin:"5px 0 15px 0"}}
                                                                    className="form-control px-2 py-2"
                                                                    onChange={(e: any) => {
                                                                        handleChange(e); validatePassword(values.password, e.target.value);
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Confirm Password</label>
                                                                <Field type="password"
                                                                    style={{borderRadius:0, margin:"5px 0 15px 0"}}
                                                                    name="confirmPassword"
                                                                    className="form-control px-2 py-2"
                                                                    onChange={(e: any) => {
                                                                        handleChange(e);
                                                                        validatePassword(values.password, e.target.value);
                                                                    }}
                                                                />
                                                            </div>

                                                            <button type="submit" 
                                                            className="btn btn-primary mb-4" 
                                                            disabled={isSubmitting || !allCriteriaMet()}>
                                                                Submit
                                                            </button>

                                                            <div className="validation-box fs-9" style={{fontSize:"12px"}}>
                                                                <div className="fs-6 mb-1" style={{fontSize:"14px" }}>Password Requirements:</div>
                                                                {renderCriteria(passwordCriteria.minLength, "Must be at least 8 characters")}
                                                                {renderCriteria(passwordCriteria.lettersAndNumbers, "Must be a series of letters and numbers")}
                                                                {renderCriteria(passwordCriteria.uppercase, "Must include an uppercase letter")}
                                                                {renderCriteria(passwordCriteria.passwordsMatch, "Passwords must match")}
                                                            </div>
                                                        </form>
                                                        )
                                                        }}
                                        
                                                    </Formik>

                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>
                        </section>
        </>
    );
};
