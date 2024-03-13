
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { login, logout, getHome, verifyOtp } from "../slices/auth";
import { clearMessage } from "../slices/message"
import { RootState } from '../store';


interface LeftColumnProps {
    setCreatePassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LeftColumn = (({ setCreatePassword }: LeftColumnProps) => {

    const [loading, setLoading] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state
    const [agency, setAgency] = useState('')
    const [email, setEmail] = useState('')

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = (event: any) => {
        event.preventDefault()
        localStorage.removeItem("email")
        localStorage.removeItem("agency")
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

    // Pull agency from local storage when component mounts
    useEffect(() => {
        const storedAgency = localStorage.getItem('agency');
        if (storedAgency) {
            setAgency(storedAgency);
        }
    }, []); // Empty dependency array means this effect runs once on mount

    // Update local storage when agency changes
    useEffect(() => {
        if (agency) {
            localStorage.setItem('agency', agency);
            setAgency(agency);
        }
    }, [agency]); // This effect runs every time 'agency' changes

    useEffect(() => {
        const interval = setInterval(() => {
            const storedAgency = localStorage.getItem('agency');
            if (storedAgency !== agency) {
                setAgency(storedAgency || ''); // Update the state if different
            }
        }, 300); // every 300 milliseconds

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [agency]); // Run effect when 'agency' changes




    const goHome = (event: any) => {
        event.preventDefault()
        dispatch(getHome() as any)
            .unwrap()
            .then(() => {
                console.log("Going on...")
                setCreatePassword(false)
                navigate('/login');
            })
            .catch((error: any) => {
                // Handle the error
                console.log(error)
            });
        setCreatePassword(false)
        navigate('/login');

    }

    return (
        <div className="pt-3 px-3 left-column"
            style={{
                maxWidth: "200px",
                minWidth: "220px",
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

                <div className="text-left fw-bold " style={{ fontSize: ".8rem" }}>
                    <ul id="swf-mnu" className=" m-0 navbar-nav ms-auto">
                        {!isLoggedIn ?
                            <>
                                <li className="nav-item active jud-header-item" onClick={goHome}><a className="nav-link" href="/login">Login  </a></li>
                            </> :
                            <>
                                {/* <li className="nav-item active jud-header-item" onClick={goHome}><a className="nav-link" href="/">Welcome  </a></li> */}

                                <li className="nav-item active jud-header-item"><a className="nav-link" href="/">Home  </a></li>
                                {agency !== 'dpp' ?
                                    <>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/submissions"> My Submissions </a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/submission"> Complaint With Oath</a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/consent"> Complaint With Oath, With Consent</a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/oathless"> Complaint Without Oath</a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/summons"> Complaint Without Oath Requesting Summons</a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/warrant"> Complaint  With Oath Requesting Warrant</a></li>
                                    </>
                                    :
                                    <>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/indictable"> Indictment with NO complaint </a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/indictable_complaint"> Indictment WITH complaint </a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/indictable_pcompleted"> Indictment (Preliminary Inquiry completed) </a></li>

                                    </>
                                }
                                {(agency == 'ttlawcourts' || agency == 'link868') &&
                                    <>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/indictable"> Indictment with NO complaint </a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/indictable_complaint"> Indictment WITH complaint </a></li>
                                        <li className="nav-item jud-header-item"><a className="nav-link" href="/indictable_pcompleted"> Indictment (Preliminary Inquiry completed) </a></li>

                                    </>
                                }
                                <li className="nav-item jud-header-item"><button onClick={handleLogout} style={{ width: "100%" }} className="nav-link m-0 text-left">Logout</button></li>
                            </>
                        }

                    </ul>
                </div>

            </div>




        </div>

    )
})