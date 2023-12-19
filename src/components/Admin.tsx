// Import Form and validator from RJSF form despite what documentation says or fails to say
import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import "../assets/Submission.css"
import "../assets/Style.css"
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
import { login, logout, verifyOtp } from "../slices/auth";
import { LeftColumn } from "./LeftColumn"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';





type SubmissionsProps = {}

interface Submission {
    id: number,
    description: string,
    userId: number,
    createdAt: string,
    updatedAt: string,
    type: string,
    status: string
}

export const Admin  = ({ }: SubmissionsProps) => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    // const state = useSelector((state: RootState) => state.auth);
    // const { isLoggedIn, otpRequired, token, isVerified } = state

    // useEffect(() => {
    //     if (isLoggedIn && isVerified && token && !otpRequired) {
    //         navigate('/submissions');
    //     }
    //     else {
    //         console.log("Cannot navigate to submissions page")
    //     }
    // }, [isLoggedIn, isVerified, token, otpRequired]);


    // console.log(">>> STATE <<<")
    // console.log(state)



    useEffect(() => {
        axios.get(API_URL + '/api/submissions/admin/1')
            .then((response) => {
                console.log('Submissions fetched from server: ', response.data);
                setSubmissions(response?.data?.submissions?.rows || [])
                // setSubmissions([])
                // let dSubmissions: Submission[] = [{description: "Testing description rendering", userId: 4}]
                // setSubmissions(dSubmissions)
            })
    }, []);


    // useEffect(() => {
    //     axios.get(API_URL + '/api/submissions')
    //         .then((response) => {
    //             console.log('Submissions fetched from server: ', response.data);
    //             const submissionsData = response?.data?.submissions?.rows || [];

    //             // Sort submissions first by status (ascending), then by createdAt (or any other criteria)
    //             const sortedSubmissions = submissionsData.sort((a: any, b: any) => {
    //                 if (a.status === b.status) {
    //                     // If status is the same, you can further sort by createdAt (or other criteria)
    //                     return a.createdAt.localeCompare(b.createdAt);
    //                 }
    //                 // Sort by status in ascending order
    //                 return a.status.localeCompare(b.status);
    //             });

    //             setSubmissions(sortedSubmissions);
    //             console.log('Sorted Submissions: ', sortedSubmissions);
    //         });
    // }, []);


    // const submissionComponent = (submission: any) => {

    //     let path = ''

    //     switch(submission.type) { 
    //         case 'indictable': { 
    //            //statements; 
    //            break; 
    //         } 
    //         case '': { 
    //            //statements; 
    //            break; 
    //         } 
    //         default: { 
    //            //statements; 
    //            break; 
    //         } 
    //      }       

    // }


    // const handleLogout = (event: any) => {
    //     event.preventDefault()
    //     dispatch(logout() as any)
    //         .unwrap()
    //         .then(() => {
    //             console.log("Logging out...")
    //             navigate("/"); // This will redirect to the home page
    //         })
    //         .catch((error: any) => {
    //             // Handle the error
    //             console.log(error)
    //         });
    // }

    // const groupedSubmissions:any = submissions.reduce((groups:any, submission) => {
    //     if (!groups[submission.status]) {
    //         groups[submission.status] = [];
    //     }
    //     groups[submission.status].push(submission);
    //     return groups;
    // }, {});

    return (
        <div className="d-flex">

            <div className="pt-3 px-3 mx-3"
                style={{
                    maxWidth: "250px",
                    flexShrink: 0, position: "fixed", top: 0, left: 0, height: "100%"
                }}
            >
                
            </div>


            <div className="container submissions-container" style={{ borderRadius: "5px", maxWidth: "900px", padding: "20px 40px", margin: "30px 30px 30px 300px", flexGrow: 1 }}>

                <div>

                    <div className="d-flex justify-content-between align-items-center mb-4" style={{}}>
                        <h3 className='text-left flex-grow-1' style={{ marginRight: 'auto' }}>Submissions Admin</h3>
                    </div>

                    {submissions.map((submission:any) => (

                            <div className="card submission-card" style={{ padding: '1px' }} key={submission.id}>
                                <div className="card-body" style={{ padding: '10px 25px' }}>
                                    <h5 className="card-title text-left">{submission.description}</h5>
                                </div>
                            </div>
                      
                    ))}

                </div>

            </div>



        </div>
    )
}