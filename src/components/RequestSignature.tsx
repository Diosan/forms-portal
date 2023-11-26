import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"

type RequestSignatureProps = {
    submission_id: number,
    complainant_email: string
}

export const RequestSignature = ({submission_id, complainant_email}:RequestSignatureProps) => {

    const requestSignature = async () => {
        alert('Do it now!')
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