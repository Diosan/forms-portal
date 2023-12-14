import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import '../assets/Submission.css'
import '../assets/Signature.css'

type SignaturesProps = {
    submission_id: number,
    complainant_email: string,
    complainant_name: string,
    already_signed: boolean,
    already_verified: boolean
}

const log = (type: any) => console.log.bind(console, type)


export const Signatures = ({
        submission_id, 
        complainant_email, 
        complainant_name, 
        already_signed, 
        already_verified
    }:SignaturesProps) => {

    const navigate = useNavigate()

    const [otpSent, setOtpSent] = useState(false)
    const [verifyOtpSent, setVerifyOtpSent] = useState(false)
    const [signOTP, setSignOTP] = useState('')
    const [signed, setSigned] = useState(false)
    const [verified, setVerified] = useState(false)
    const [verifierEmail, setVerifierEmail] = useState('')
    const [signatureHash, setSignatureHash] = useState('')
    const [signatureName, setSignatureName] = useState('')
    const [signatureDate, setSignatureDate] = useState('')
    const [verificationHash, setVerificationHash] = useState('')
    const [verificationName, setVerificationName] = useState('')
    const [verificationDate, setVerificationDate] = useState('')

    useEffect(() => {
        (async () => {
            
            let submission = await axios.get(API_URL + '/api/submissions/' + submission_id)
            if(submission.data.submission.status == 'signed' || submission.data.submission.status == 'verified') {

                let retrieved_signature = await axios.post(
                    API_URL + '/api/submissions/signature/', 
                    {                                                                        
                        submission_id: submission.data.submission.id,
                        userId: submission.data.submission.userId
                    }
                )

                console.log('\n\n\n Signature for signed submission: ', retrieved_signature.data)
                setSignatureHash(retrieved_signature.data.signature.hash)
                setSignatureName(retrieved_signature.data.user.firstName + ' ' + retrieved_signature.data.user.lastName)                
                setSignatureDate(retrieved_signature.data.signature.createdAt)

            }

            if(submission.data.submission.status == 'verified') {

                // let retrieved_signature = await axios.post(
                //     API_URL + '/api/submissions/signature/', 
                //     {                                                                        
                //         submission_id: submission.data.submission.id,
                //         userId: submission.data.submission.userId
                //     }
                // )

                // console.log('\n\n\n Signature for signed submission: ', retrieved_signature.data)
                // setSignatureHash(retrieved_signature.data.signature.hash)
                // setSignatureName(retrieved_signature.data.user.firstName + ' ' + retrieved_signature.data.user.lastName)                
                // setSignatureDate(retrieved_signature.data.signature.createdAt)


                let retrieved_verification = await axios.post(
                    API_URL + '/api/submissions/verification/', 
                    {                                                                        
                        submission_id: submission.data.submission.id,
                        userId: submission.data.submission.userId
                    }
                )

                console.log('\n\n\n Verification for signed submission: ', retrieved_verification.data)
                setVerificationHash(retrieved_verification.data.signature.hash)
                setVerificationName(retrieved_verification.data.user.firstName + ' ' + retrieved_verification.data.user.lastName)                
                setVerificationDate(retrieved_verification.data.signature.createdAt)

            }

            

        })();        
    }, [])

    return (
        <>
            {/* <h5>Signatures</h5> */}

            { (already_signed || already_verified) ?
                <div className="signature-format-complainant">
                    {/* <!-- Row 1 --> */}
                    <div className="col-12 col">
                        <div className="logo-placeholder d-flex swf-sign">
                            <span className="swf-e-signed">e-signed on</span> <span className="swf-swif">SWiF</span>
                        </div>
                    </div>
                    <div className="col-12 col">
                        <div className="text-placeholder text-right">{signatureDate.substring(11, 20)}</div>
                        <div className="text-placeholder text-right">{signatureDate.substring(0, 10)}</div>
                        {/* <div className="text-placeholder text-right">[ip address]</div> */}
                    </div>

                    {/* <!-- Row 2 --> */}
                    <div className="col-12 col">
                        <div className="name-placeholder fw-bold  text-left">{signatureName}</div>
                    </div>

                    {/* <!-- Row 3 --> */}
                    <div className="col-12 col">
                        <p className="hash-placeholder text-left">
                        {signatureHash}</p>
                    </div>
                </div>
                :
                <></>
            }

            { already_verified?
                <div className="signature-format-verifier">
                    {/* <!-- Row 1 --> */}
                    <div className="col-12 col">
                        <div className="logo-placeholder d-flex swf-sign">
                            <span className="swf-e-signed">Verified on </span> <span className="swf-swif">SWiF</span>
                        </div>
                    </div>
                    <div className="col-12 col">
                        <div className="text-placeholder text-right">{verificationDate.substring(11, 20)}</div>
                        <div className="text-placeholder text-right">{verificationDate.substring(0, 10)}</div>
                        {/* <div className="text-placeholder text-right">[ip address]</div> */}
                    </div>

                    {/* <!-- Row 2 --> */}
                    <div className="col-12 col">
                        <div className="name-placeholder fw-bold  text-left">{verificationName}</div>
                    </div>

                    {/* <!-- Row 3 --> */}
                    <div className="col-12 col">
                        <p className="hash-placeholder text-left">
                        {verificationHash}</p>
                    </div>
                </div>
                :
                <></>
            }


        </>
    )

}