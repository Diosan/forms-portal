// Import Form and validator from RJSF form despite what documentation says or fails to say
import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import "../assets/Submission.css"
import "../assets/Style.css"

import { Navigate, useNavigate } from "react-router-dom"
import { Submission } from "./Submission"
import { RootState } from '../store';
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store"




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

export const Admin = ({ }: SubmissionsProps) => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const count = useSelector((state: RootState) => state.charge?.charge_count); // Using optional chaining
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state



    useEffect(() => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.get(API_URL + '/api/submissions/admin/1', config)
            .then((response) => {
                console.log('Submissions fetched from server: ', response.data);
                setSubmissions(response?.data?.submissions?.rows || [])
                // setSubmissions([])
                // let dSubmissions: Submission[] = [{description: "Testing description rendering", userId: 4}]
                // setSubmissions(dSubmissions)
            })
    }, []);

    useEffect(() => {
        // console.log('The charge count has changed:', count);
        console.log("counting in accused: ",  count)
      }, [count]);

      const viewSubmission = (id:number) => {
        navigate(`/view/${id}`)
    };




    return (
        <div className="d-flex">
            <p>Counting Charges {count}</p>

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

                    {submissions.map((submission: any) => (

                        // <div className="card submission-card" style={{ padding: '1px' }} key={submission.id}>
                        //     <div className="card-body" style={{ padding: '10px 25px' }}>
                        //         <h5 className="card-title text-left">{submission.description}</h5>
                        //     </div>
                        // </div>


                        <div className="card submission-card d-flex" style={{ padding: '1px' }}>
                        <div className="card-body d-flex justify-content-between" style={{ padding: '10px 25px' }}>
                            <h5 className="card-title fs-6 text-left">{submission.description || (`Submission: ${submission.id}`)}</h5>
                            <div className="action-buttons">
                                <button className="btn btn-link" onClick={() => viewSubmission(submission.id)}>
                                    <i className="fa fa-edit"></i> View
                                </button>
                                <button className="btn btn-link">
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                        </div>





                    ))}

                </div>
            </div>

            



        </div>
    )
}