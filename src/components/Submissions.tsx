// Import Form and validator from RJSF form despite what documentation says or fails to say
import { useEffect, useState } from "react"
import { API_URL } from "../config/api"
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
import { login, logout, verifyOtp } from "../slices/auth";





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

    return (
        <div className="d-flex">

            <div className="pt-3 px-3 mx-3" 
                    style={{maxWidth:"250px", 
                    flexShrink:0, position:"fixed", top:0, left:0, height:"100%"}}
            >
                    <div   className="mb-3">
                        <a  className="mb-4" href="#">
                            <img src="/jsswf-01.svg" width="90"  className="d-inline-block align-top " alt=""/>
                        </a>
                    </div>
                   
                    <div  className="text-center " style={{}}>
                        <ul className=" m-0 navbar-nav ms-auto">
                            
                            <li  className="nav-item active jud-header-item"><a  className="nav-link" href="/">Home  </a></li>
                            <li  className="nav-item jud-header-item"><a  className="nav-link" href="/submissions"> My Submissions</a></li>
                            <li  className="nav-item jud-header-item"><a  className="nav-link" href="/submission"> New Complaint With Oath</a></li>
                            <li  className="nav-item jud-header-item"><a  className="nav-link" href="/indictable"> New Indictable</a></li>
                            <li  className="nav-item jud-header-item"><button onClick={handleLogout} style={{width:"100%"}}  className="nav-link m-0 text-center">Logout</button></li>
                        </ul>
                    </div>
            </div>




            {token ?
                <>
                    <div className="container submissions-container" style={{ borderRadius:"5px", maxWidth: "900px", padding: "20px 40px", margin: "30px 30px 30px 300px", flexGrow:1 }}>

                        <div>
                            {/* <div className="row">
                                <h3 className='page-title submissions-title'> My Submissions </h3>
                            </div> */}

                            <div className="d-flex justify-content-between align-items-center mb-4" style={{}}>
                                <h4 className='text-left flex-grow-1' style={{ marginRight: 'auto' }}>My Submissions</h4>
                                <div className="row" style={{maxWidth:"200px", margin:"0 auto"}} >
                                    <a href="/submission" className="btn m-0 btn-primary new-submission-btn float-end">New +</a>
                                </div>
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
                                {submissions.map((submission: Submission) =>

                                    <a href={submission.type == 'indictable' ? '/indictable/' + submission.id : '/submission/' + submission.id} key={submission.id} >
                                        <div className="card submission-card" style={{ padding: "1px" }} >
                                            <div className="card-body" style={{ padding: "10px 25px" }} >
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