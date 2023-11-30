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
// import AuthService from "../services/AuthService"
import { Navigate, useNavigate } from "react-router-dom"
import { Submission } from "./Submission"
import { RootState } from '../store';
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store"
import { clearMessage } from "../slices/message"




type SubmissionsProps = {}

interface Submission {
    id: number,
    description: string,
    userId: number,
    createdAt: string,
    updatedAt: string
}

export const Submissions = ({}: SubmissionsProps) => {

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const message = useSelector((state: RootState) => state.message);

    const navigate = useNavigate()



    useEffect(() => {
        axios.get(API_URL + '/api/submissions')
        .then((response) => {
            console.log('Submissions fetched from server: ', response.data);
            setSubmissions(response?.data?.submissions?.rows || [])
            // setSubmissions([])
            // let dSubmissions: Submission[] = [{description: "Testing description rendering", userId: 4}]
            // setSubmissions(dSubmissions)
        })
    }, []); 

    return (
        <>
            { isLoggedIn ? 
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
                        { submissions.length > 0 ? 
                            <div className="row">
                                {submissions.map((submission: Submission) => 
                                    
                                    <a href={'/submission/' + submission.id}>
                                        <div className="card submission-card" key={submission.id}>
                                            <div className="card-body">
                                                <h5 className="card-title">{submission.description}</h5>                                   
                                            </div>
                                        </div>
                                    </a>
                                )}

                                    {/* <>
                                        <div className="card submission-card"></div>
                                    </> */}
                                
                                {/* <div className="card submission-card"></div> */}
                            </div>
                        
                            :
                            <div>No submissions available.</div>
                        }

                    </div>

                </div>
                         
            </>
            : <Navigate to="/" replace={true} />
            }        
        </>
    )
}