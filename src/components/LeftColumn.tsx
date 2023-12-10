
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { login, logout, getHome, verifyOtp } from "../slices/auth";
import { clearMessage } from "../slices/message"
import { RootState } from '../store';

type HeaderProps = {}

export const LeftColumn = (({ }: HeaderProps) => {

    const [loading, setLoading] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = (event: any) => {
        event.preventDefault()
        dispatch(logout() as any)
            .unwrap()
            .then(() => {
                console.log("Logging out...")
                navigate("/"); // This will redirect to the home page
            })
            .catch((error: any) => {
                // Handle the error
                console.log(error)
            });
    }

    const goHome = (event: any) => {
        event.preventDefault()
        dispatch(getHome() as any)
            .unwrap()
            .then(() => {
                console.log("Going on...")
                navigate("/login"); // This will redirect to the home page
            })
            .catch((error: any) => {
                // Handle the error
                console.log(error)
            });
    }

    return (
        <div className="pt-3 px-3 left-column"
            style={{
                maxWidth: "300px",
                minWidth:"250px",
                flexShrink: 0, position: "fixed", 
                backgroundColor: "#fff",
                top: 0, left: 0, height: "100%"
            }}
        >
            <div className="" style={{ backgroundColor: "#fff" }}
            >
                <div className="mb-3">
                    <a className="mb-4" href="/">
                        <img src="/jsswf-01.svg" width="90" className="d-inline-block align-top " alt="" />
                    </a>
                </div>

                <div className="text-center " style={{}}>
                    <ul id="swf-mnu" className=" m-0 navbar-nav ms-auto">
                        {!isLoggedIn ?
                        <>
                            <li className="nav-item active jud-header-item" onClick={goHome}><a className="nav-link" href="/login">Login  </a></li>
                        </> :
                        <>
                            {/* <li className="nav-item active jud-header-item" onClick={goHome}><a className="nav-link" href="/">Welcome  </a></li> */}
                            <li className="nav-item active jud-header-item"><a className="nav-link" href="/">Home  </a></li>
                            <li className="nav-item jud-header-item"><a className="nav-link" href="/submissions"> My Submissions</a></li>
                            <li className="nav-item jud-header-item"><a className="nav-link" href="/submission"> Complaint With Oath</a></li>
                            <li className="nav-item jud-header-item"><a className="nav-link" href="/submission"> Complaint Without Oath</a></li>
                            <li className="nav-item jud-header-item"><a className="nav-link" href="/summons"> Complaint Summons</a></li>
                            <li className="nav-item jud-header-item"><a className="nav-link" href="/summons"> Complaint Warrant Or Summons</a></li>                        
                            <li className="nav-item jud-header-item"><a className="nav-link" href="/not_police"> Complaint By Person Other Than Police</a></li> 
                            <li className="nav-item jud-header-item"><a className="nav-link" href="/indictable"> Indictable</a></li>
                            <li className="nav-item jud-header-item"><button onClick={handleLogout} style={{ width: "100%" }} className="nav-link m-0 text-center">Logout</button></li>
                        </>
                        }

                    </ul>
                </div>

            </div>




        </div>

    )
})