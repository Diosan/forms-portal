// Import Form and validator from RJSF form despite what documentation says or fails to say
import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import "../assets/Submission.css"
// import "../assets/javascript/submission"
import { Step } from "./Step"
import { Complainant } from "./Complainant"
import { Charges } from "./Charges"
import AuthService from "../services/AuthService"
import { Navigate, useNavigate } from "react-router-dom"

type SubmissionsProps = {}

export const Submissions = ({}: SubmissionsProps) => {
    const navigate = useNavigate()

    const auth = new AuthService

    return (
        <>
            { auth.loggedIn() ? 
            <>
                <div className="container submissions-container">

                    <div>
                        <div className="row">
                            <h3 className='page-title submissions-title'> My Submissions </h3>
                        </div>
                        
                        {/* <table>
                            <thead>
                                <tr>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>

                                </tr>
                            </tbody>
                        </table> */}

                        <div className="row">
                            <a href="/submission" className="btn btn-secondary new-submission-btn float-end">New Submission +</a><br/><br/>
                        </div>
                        
                        <div className="row">
                            <div className="card submission-card"></div>
                            <div className="card submission-card"></div>
                        </div>
                    </div>

                </div>
                         
            </>
            : <Navigate to="/" replace={true} />
            }        
        </>
    )
}