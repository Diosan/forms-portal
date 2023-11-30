
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect  } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { login, logout, verifyOtp } from "../slices/auth";
import { clearMessage } from "../slices/message"
import { RootState } from '../store';

type HeaderProps = {}

export const Header = (({}: HeaderProps) => {

    const [loading, setLoading] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const {isLoggedIn, otpRequired, token, isVerified} = state

    const dispatch = useAppDispatch();

    const handleLogout = (event: any) => {
        event.preventDefault()
        console.log(">>> signin")
        dispatch(logout() as any)
        .unwrap()
        .then(() => {
            console.log("Logging out...")
        })
        .catch((error: any) => {
            // Handle the error
            console.log(error)
        });
    }

    return (
        <>
            <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand pl-2 swf-logo" href="#">
                    <img src="/jsswf-01.svg" width="60"  className="d-inline-block align-top ml-3" alt="" />
                    {/* <div className="site-name">Forms Portal</div> */}
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item active jud-header-item">
                            <a className="nav-link" href="/">Home {/* <span className="sr-only">(current)</span> */} </a> 
                        </li>

                        { isLoggedIn && token ? 
                            <>
                                <li className="nav-item jud-header-item">
                                    <a className="nav-link" href="/submissions"> My Submissions</a>
                                </li>

                                <li className="nav-item jud-header-item">
                                    <a className="nav-link" href="/submission"> New Complaint With Oath</a>
                                </li>

                                <li className="nav-item jud-header-item">
                                    <a className="nav-link" href="/indictable"> New Indictable</a>
                                </li>

                                <li className="nav-item jud-header-item">
                                    <button className="nav-link" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>                     
                            </>
                            : <></>
                        }


                        {/* <li className="nav-item">
                            <Button>SIGN IN</Button>
                        </li> */}

                        {/* <li className="nav-item">
                            <a className="nav-link disabled" href="#">Disabled</a>
                        </li> */}
                    </ul>
                </div>
            </nav>
            </header>
            
        

        </>

    )
})