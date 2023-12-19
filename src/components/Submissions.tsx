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

export const Submissions = ({ }: SubmissionsProps) => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state

    useEffect(() => {
        if (isLoggedIn && isVerified && token && !otpRequired) {
            navigate('/submissions');
        }
        else {
            console.log("Cannot navigate to submissions page")
        }
    }, [isLoggedIn, isVerified, token, otpRequired]);


    console.log(">>> STATE <<<")
    console.log(state)



    // useEffect(() => {
    //     axios.get(API_URL + '/api/submissions')
    //         .then((response) => {
    //             console.log('Submissions fetched from server: ', response.data);
    //             setSubmissions(response?.data?.submissions?.rows || [])
    //             // setSubmissions([])
    //             // let dSubmissions: Submission[] = [{description: "Testing description rendering", userId: 4}]
    //             // setSubmissions(dSubmissions)
    //         })
    // }, []);


    useEffect(() => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.get(API_URL + '/api/submissions', config)
            .then((response) => {
                console.log('Submissions fetched from server: ', response.data);
                const submissionsData = response?.data?.submissions?.rows || [];

                // Sort submissions first by status (ascending), then by createdAt (or any other criteria)
                const sortedSubmissions = submissionsData.sort((a: any, b: any) => {
                    if (a.status === b.status) {
                        // If status is the same, you can further sort by createdAt (or other criteria)
                        return a.createdAt.localeCompare(b.createdAt);
                    }
                    // Sort by status in ascending order
                    return a.status.localeCompare(b.status);
                });

                setSubmissions(sortedSubmissions);
                console.log('Sorted Submissions: ', sortedSubmissions);
            });
    }, []);


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

    const groupedSubmissions:any = submissions.reduce((groups:any, submission) => {
        if (!groups[submission.status]) {
            groups[submission.status] = [];
        }
        groups[submission.status].push(submission);
        return groups;
    }, {});

    return (
        <div className="d-flex">

            <div className="pt-3 px-3 mx-3"
                style={{
                    maxWidth: "250px",
                    flexShrink: 0, position: "fixed", top: 0, left: 0, height: "100%"
                }}
            >
                {/* <LeftColumn /> */}
            </div>




            {token ?
                <>
                    <div className="container submissions-container" style={{ borderRadius: "5px", maxWidth: "900px", padding: "20px 40px", margin: "30px 30px 30px 300px", flexGrow: 1 }}>

                        <div>
                            {/* <div className="row">
                                <h3 className='page-title submissions-title'> My Submissions </h3>
                            </div> */}

                            <div className="d-flex justify-content-between align-items-center mb-4" style={{}}>
                                <h3 className='text-left flex-grow-1' style={{ marginRight: 'auto' }}>My Submissions</h3>
                                {/* <div className="row" style={{ maxWidth: "200px", margin: "0 auto" }} >
                                    <a href="/submission" className="btn m-0 btn-primary new-submission-btn float-end">New +</a>
                                </div> */}
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

                            {/* <div className="row" style={{maxWidth:"200px", margin:"0 auto"}} >
                            <a href="/submission" className="btn btn-secondary new-submission-btn float-end">New Submission +</a><br/><br/>
                        </div> */}

                            <div className="row">
                                <div>



                                    {/* Render "pending" submissions with a different background color */}
                                    {groupedSubmissions['pending'] && (
                                        <div className="mt-4 group-submission pending-group" style={{ backgroundColor: '##dfdfdf' }}>
                                            <h4 className="my-2 mb-4 fs-5 fw-bold text-left">Pending Submissions</h4>
                                            {groupedSubmissions['pending'].map((submission:any) => (
                                                <a
                                                    href={submission.type === 'indictable' ? '/indictable/' + submission.id : '/submission/' + submission.id}
                                                    key={submission.id}
                                                >
                                                    <div className="card submission-card" style={{ padding: '1px' }}>
                                                        <div className="card-body" style={{ padding: '10px 25px' }}>
                                                            <h5 className="card-title fs-6 text-left">{submission.description}</h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Render "pending" submissions with a different background color */}
                                    {groupedSubmissions['complainant_saved'] && (
                                        <div className="mt-4 group-submission pending-group" style={{ backgroundColor: '#dfdfdf' }}>
                                            <h4 className="my-2 mb-4 text-left">Complainant Saved</h4>
                                            {groupedSubmissions['pending'].map((submission:any) => (
                                                <a
                                                    href={submission.type === 'indictable' ? '/indictable/' + submission.id : '/submission/' + submission.id}
                                                    key={submission.id}
                                                >
                                                    <div className="card submission-card" style={{ padding: '1px' }}>
                                                        <div className="card-body" style={{ padding: '10px 25px' }}>
                                                            <h5 className="card-title text-left">{submission.description}</h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Render "charge_saved" submissions with a different background color */}
                                    {groupedSubmissions['charge_saved'] && (
                                        <div className="mt-4 group-submission charge-saved-group" style={{ backgroundColor: '#ddeedd' }}>
                                            <h4 className="my-2 mb-4 fs-5">Charge Saved Submissions</h4>
                                            {groupedSubmissions['charge_saved'].map((submission:any) => (
                                                <a
                                                    // href={submission.type === 'indictable' ? '/indictable/' + submission.id : '/submission/' + submission.id}
                                                    href={'/sign/' + submission.id}
                                                    key={submission.id}
                                                >
                                                    <div className="card submission-card" style={{ padding: '1px' }}>
                                                        <div className="card-body" style={{ padding: '10px 25px' }}>
                                                            <h5 className="card-title text-left">{submission.description}</h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Render "complete" submissions with a different background color */}
                                    {/* {groupedSubmissions['signed'] && (
                                        <div className="mt-4 group-submission complete-group" style={{ backgroundColor: '#fff' }}>
                                            <h4 className="my-2 mb-4 fs-5">Signed Submissions</h4>
                                            {groupedSubmissions['signed'].map((submission:any) => (
                                                <a
                                                    href={'/verify/' + submission.id}
                                                    key={submission.id}
                                                >
                                                    <div className="card submission-card" style={{ padding: '1px' }}>
                                                        <div className="card-body" style={{ padding: '10px 25px' }}>
                                                            <h5 className="card-title text-left">{submission.description}</h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )} */}


                                    {/* {groupedSubmissions['verified'] && (
                                        <div className="mt-4 group-submission complete-group" style={{ backgroundColor: '#fff' }}>
                                            <h4 className="my-2 mb-4 fs-5">Verified Submissions</h4>
                                            {groupedSubmissions['verified'].map((submission:any) => (
                                                <a
                                                    href={'/view/' + submission.id}
                                                    key={submission.id}
                                                >
                                                    <div className="card submission-card" style={{ padding: '1px' }}>
                                                        <div className="card-body" style={{ padding: '10px 25px' }}>
                                                            <h5 className="card-title text-left">{submission.description}</h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )} */}


                                    {/* {groupedSubmissions['final'] && (
                                        <div className="mt-4 group-submission complete-group" style={{ backgroundColor: '#fff' }}>
                                            <h4 className="my-2 mb-4 fs-5">Completed Submissions</h4>
                                            {groupedSubmissions['final'].map((submission:any) => (
                                                <a
                                                    href={'/sign/' + submission.id}
                                                    key={submission.id}
                                                >
                                                    <div className="card submission-card" style={{ padding: '1px' }}>
                                                        <div className="card-body" style={{ padding: '10px 25px' }}>
                                                            <h5 className="card-title text-left">{submission.description}</h5>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )} */}


                                </div>
                                




                                {/* {submissions.map((submission: Submission) => (
                                    <a
                                        href={submission.type === 'indictable' ? '/indictable/' + submission.id : '/submission/' + submission.id}
                                        key={submission.id}
                                    >
                                        <div
                                            className={`card submission-card ${submission.status === 'pending' ? 'pending-bg' : submission.status === 'charge_saved' ? 'charge-saved-bg' : 'complete-bg'}`}
                                            style={{ padding: "1px" }}
                                        >
                                            <div className="card-body" style={{ padding: "10px 25px" }}>
                                                <h5 className="card-title">{submission.description}</h5>
                                            </div>
                                        </div>
                                    </a>
                                ))} */}














                                {/* {submissions.map((submission: Submission) =>

                                    <a href={submission.type == 'indictable' ? '/indictable/' + submission.id : '/submission/' + submission.id} key={submission.id} >
                                        <div className="card submission-card" style={{ padding: "1px" }} >
                                            <div className="card-body" style={{ padding: "10px 25px" }} >
                                                <h5 className="card-title">{submission.description}</h5>
                                            </div>
                                        </div>
                                    </a>
                                )} */}

                                {/* <>
                                        <div className="card submission-card"></div>
                                    </> */}

                                {/* <div className="card submission-card"></div> */}
                            </div>


                            {/* <div>No submissions available.</div> */}


                            {/* <>
                                        <div className="card submission-card"></div>
                                    </> */}

                            {/* <div className="card submission-card"></div> */}
                        </div>



                    </div>


                </>
                :
                <>
                    {/* <Navigate to="/" replace={true} /> */}
                </>
            }
        </div>
    )
}