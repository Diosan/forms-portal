import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import '../assets/Submission.css'

type SignIndictmentProps = {
    submission_id: number,
    complainant_email: string
}

const log = (type: any) => console.log.bind(console, type)


export const SignIndictment = ({submission_id, complainant_email}:SignIndictmentProps) => {

    const navigate = useNavigate()

    const [otpSent, setOtpSent] = useState(false)
    const [signOTP, setSignOTP] = useState('')
    const [signed, setSigned] = useState(false)
    const [signature, setSignature] = useState('')

    const signOTPChange = (event: any) => {
        setSignOTP(event.target.value)
    }

    const sendOTP = async () => {
        // console.log('\n\n\n complainant_email: ', complainant_email)
        // let otp_send = await axios.post(API_URL + '/api/submissions/send_otp', {email: complainant_email})
        // console.log('otp_send: ', otp_send.data)
        // if(otp_send.data.outcome == 'success') {
          setOtpSent(true)  
        // }
    }

        
    const sign = async (event: any) => {
        
        event.preventDefault()

        let signature_hash = await axios.post(
            API_URL + '/api/submissions/complainant_sign', 
            {
                submission_id: submission_id,
                email: complainant_email
            }
        )

        setSignature(signature_hash.data.submission_hash)

        console.log('\n\n\n Signature hash: ', signature_hash.data.submission_hash)
        console.log('\n\n\n')

        // let signed_submission = await axios.post(
        //     API_URL + '/api/submissions/update', 
        //     {
        //         id: submission_id,
        //         status: 'signed'
        //     }
        // )
        setSigned(true)
        
    }

    return (<>
        {!otpSent && !signed ? 
                <div className="d-grid gap-2">
                    <button className="btn btn-dark" type="submit" onClick={sendOTP}>Sign Submission</button>
                </div>
            : <></>
        }       
        {otpSent && !signed ?
            <form onSubmit={sign}>
                <div className="card py-5 px-3 otp-card fade show">
                    <h5 className="m-0">Sign Submission</h5>
                    <br/>
                    <span className="mobile-text">Enter the code sent to email </span>
                    <div className="d-flex flex-row mt-5 otp-row">
                        <input type="text" className="form-control otp-input" placeholder="  ###### " value={signOTP} onChange={signOTPChange} />
                        <button type="submit" className="btn btn-secondary otp-button" >Verify</button>
                    </div>
                    <div className="text-center mt-5"><span className="d-block mobile-text">Don't receive the code?</span><span className="font-weight-bold text-danger cursor">Resend</span></div>
                </div>
            </form>
            : <></>
        }

        { signed ?
            <div className="signature-frame">
                <strong>Signed by: {complainant_email}</strong>
                <br/><br /><p>{signature}</p>
            </div>
            : <></>
        }

    </>)

}