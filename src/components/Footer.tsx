
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect  } from "react";
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


export const Footer = () => {

    const [loading, setLoading] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const {isLoggedIn, otpRequired, token, isVerified} = state

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const d = new Date();
    let year = d.getFullYear();

    return (
        <>
            { isVerified &&  
                <footer className="vrfy-footer row">
                <div style={{backgroundColor:'white'}}>
                  <div className="container">
                    <div className="position-relative align-items-center">
            
            
                      <div className="d-lg-flex justify-content-center">
            
                       <div className="vrfy-logos" >
                            <div className="logo-top mt-5 mb-4">
                                <a href="https://eservices.ttlawcourts.org" target="_blank"><img width="209" height="35" className="logo-eservices" src={eservicesLogo} /></a>
                            </div>
                       </div>
                        
                      </div>
            
            
            
                      
                    </div>
                  </div>
                </div>
            
                <div style={{ padding: '30px', backgroundColor: '#b2292e', color: 'white' }}>
                  <div>
            
            
                      <div className="d-flex d-flex-row lnks justify-content-center col-xs-12">
            
                        <ul className="nav text-white">
                          
                          {/* <li className="nav-item">
                            <a className="nav-link" href="/about">About</a>
                          </li> */}
                          {/*
                          <li className="nav-item">
                            <a className="nav-link" href="/faq">FAQs</a>
                          </li>
                          */}
{/*             
                          <li className="nav-item">
                            <a className="nav-link" href="/help">Help</a>
                          </li> */}
                        </ul>
                        
                      </div>
            
            
            
                      <div className=" d-flex d-flex-row cavs-footer-b justify-content-center">
                        {/*
                        <div className="jttname">
                            <p className="jtt">Judiciary of Trinidad and Tobago</p>
                            <p className="appname">Court Authentication and Verification System</p>
                        </div>
                        */}
                      </div>
            
                      <div className="copyright">
                        <div className="jtt-logo-bottom mb-3">
                          <img  width="30" src={jttSmall} />
                        </div>

                        
                        Copyright © {year}. <a style={{color:"#fff", textDecoration:"none"}} href="https://www.ttlawcourts.org">Judiciary of Trinidad and Tobago</a>. All Rights Reserved</div>
                      
                    
                  </div>
                </div>
                  
            
              </footer>
            }
        </>

    )
}