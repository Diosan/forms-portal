import Button from 'react-bootstrap/Button';
// import '../assets/Welcome.css'
import { RegisterSignin } from './RegisterSignin';
import {faEye} from  '@fortawesome/free-solid-svg-icons';
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from '../store'
const API_URL = import.meta.env.VITE_API_URL

type CompletedProps = {}




export const CompletedSubmission = ({ }: CompletedProps) => {

    const location = useLocation();
    const id = location.state?.id;
    const navigate = useNavigate()

    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state

    const [submissionType, setSubmissionType] = useState('')

    const viewCompletedSubmission = (event: any) => {
        // console.log("where " + id);
        if(submissionType == 'complaint_with_consent') {
            navigate(`/consent/sign/${id}`)
        } else {
            navigate(`/sign/${id}`)
        }
       
    }

    useEffect(() => {

        const fetchSubmission = async () => {
            await axios.get(API_URL + '/api/submissions/' + id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }).then(submission => {
               setSubmissionType(submission.data.submission.type)
            })
        }

        fetchSubmission()
 
    }, [])

    return (
        <>
            <div className="submissions-container">

                <h2 className="my-3 mb-4">Submission completed</h2>
                {/* <p className="mt-3">Your submission has been successfully received and forwarded to the E-filing portal. 
                    If you have any questions or need assistance, feel free to contact our support team. 
                </p> */}

                <p>
                
                <button style={{ color: "#blue", textDecoration: "none" }} onClick={viewCompletedSubmission} type="button" className="btn btn-dark btn-md">
                    <FontAwesomeIcon icon={faEye} /> View Submission
                </button>                    

                </p>


            </div>
        </>
    )
}