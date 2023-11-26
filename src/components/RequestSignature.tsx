import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"

type RequestSignatureProps = {
    submission_id: number,
    complainant_email: string
}

export const RequestSignature = ({submission_id, complainant_email}:RequestSignatureProps) => {

    const navigate = useNavigate()

    const requestSignature = async () => {
        let requestResult = await axios.post(
            API_URL + '/api/submissions/request_signature', 
            {
                submission_id: submission_id,
                complainant_email: complainant_email
            }
        )
        if(requestResult.data.outcome == 'success') {
            navigate('/sign/' + submission_id)
        }

    }

    useEffect(() => {}, [])

    return (
        <>
            {/* <div className="card">
                <h5 className="card-title">Complainant Oath</h5>
            </div> */}

            <div className="d-grid gap-2">
                <button className="btn btn-dark" onClick={requestSignature} type="button">Request Signature</button>
            </div>

        </>


    )

}