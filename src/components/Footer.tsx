
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store"
import { Navigate, useNavigate } from "react-router-dom"
import { login, logout, verifyOtp } from "../slices/auth";
import { clearMessage } from "../slices/message"
import { RootState } from '../store';
import logo from '../images/evrfy_logo.svg'
import judiciaryLogo from '../images/jtt_logo_n.svg'
import eservicesLogo from '../images/eservices-logo.svg'
import jttSmall from '../images/jtt-sq.svg'
import jttRed from '../images/jtt-red.svg'
import '../assets/Style.css'


export const Footer = () => {
  const [loading, setLoading] = useState(false);
  const state = useSelector((state: RootState) => state.auth);
  const { isLoggedIn, otpRequired, token, isVerified } = state

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const d = new Date();
  let year = d.getFullYear();

  return (
    <>
      {isVerified &&
        <>
          <footer className="vrfy-footer row">
            <div style={{ backgroundColor: 'white' }}>
              <div className="container">
                <div className="position-relative align-items-center">


                  <div className="d-lg-flex justify-content-center">

                    {/* <div className="vrfy-logos" >
                            <div className="logo-top mt-5 mb-4">
                                <a href="https://eservices.ttlawcourts.org" target="_blank"><img width="209" height="35" className="logo-eservices" src={eservicesLogo} /></a>
                            </div>
                       </div> */}

                  </div>




                </div>
              </div>
            </div>
          </footer>
          <div 
            id="footer"
            style={{
            padding: '3px 30px 7px', borderTop: "1px solid #ddd",
            position: "fixed", bottom: "0px", width: "100%", backgroundColor: '#f9f9f9', color: 'white'
          }}>
            <div>

              <div className="copyright">
                <span style={{ color: "#444", fontSize: "12px", lineHeight:"1.2rem", textDecoration: "none" }}>SWIF Version: 1.0.6</span>
                
                &nbsp; &nbsp;
                <span>
                  <a style={{ color: "#444", fontSize: "12px", textDecoration: "none" }} href="https://www.ttlawcourts.org">
                    Copyright © {year}&nbsp;  &nbsp;
                  <img className=" copy-img" width="12" src={jttRed} />
                  &nbsp;
                    Judiciary of Trinidad and Tobago
                    </a>
                </span>
                &nbsp; &nbsp;
                <span className="copy-img"><a href="https://eservices.ttlawcourts.org" target="_blank"><img width="auto" height="12" className="logo-eservices  copy-img" src={eservicesLogo} /></a></span>
                &nbsp; &nbsp;
                
              </div>

            </div>
          </div>
        </>
      }
    </>

  )
}