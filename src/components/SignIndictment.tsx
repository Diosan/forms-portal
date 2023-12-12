import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import '../assets/Submission.css'
import '../assets/Signature.css'
import { useAppDispatch } from "../store/store"
import { resendSigningOTP } from "../slices/auth";



type SignIndictmentProps = {
    submission_id: number,
    complainant_email: string,
    complainant_name: string,
    complainant_regnum: string,
    already_signed: boolean,
    already_verified: boolean
}

const log = (type: any) => console.log.bind(console, type)


export const SignIndictment = ({submission_id, complainant_email, complainant_name, complainant_regnum, already_signed, already_verified}:SignIndictmentProps) => {

    

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

    const dispatch = useAppDispatch();

    const signOTPChange = (event: any) => {
        setSignOTP(event.target.value)
    }

    const sendOTP = async () => {
        // console.log('\n\n\n complainant_email: ', complainant_email)
        let otp_send = await axios.post(
            API_URL + '/api/submissions/send_otp', 
            {
                submission_id: submission_id,
                email: complainant_email,
                name: complainant_name
            }
        )
        console.log('otp_send: ', otp_send.data)
        if(otp_send.data.outcome == 'success') {
          setOtpSent(true)  
        }
    }

    const sendVerifyOTP = async () => {
        // console.log('\n\n\n complainant_email: ', complainant_email)
        let otp_send = await axios.post(
            API_URL + '/api/submissions/send_verify_otp', 
            {
                submission_id: submission_id,
                email: complainant_email,
                name: complainant_name
            }
        )
        console.log('otp_send: ', otp_send.data)
        if(otp_send.data.outcome == 'success') {
          setVerifyOtpSent(true)
          setVerifierEmail(otp_send.data.email)  
        }
    }

        
    const sign = async (event: any) => {
        
        event.preventDefault()

        console.log('\n\n\n signOTP: ', signOTP)
        console.log('\n\n\n')

        let verified = await axios.post(
            API_URL + '/api/submissions/verify_otp',
            {
                submission_id: submission_id,
                email: complainant_email,
                otp: signOTP 
            } 
        )

        console.log('\n\n\n verification response: ', verified.data)

        if(verified.data.outcome == 'success') {

            let returned_signature = await axios.post(
                API_URL + '/api/submissions/complainant_sign', 
                {
                    submission_id: submission_id,
                    email: complainant_email
                }
            )

            console.log('\n\n\n returned_signature: ', returned_signature.data);

            setSignatureHash(returned_signature.data.signature.hash)
            setSignatureName(returned_signature.data.user.firstName + ' ' + returned_signature.data.user.lastName)
            setSignatureDate(returned_signature.data.signature.createdAt)
            

            // console.log('\n\n\n Signature hash: ', returned_signature.data.submission.hash)
            // console.log('\n\n\n')

            let signed_submission = await axios.post(
                API_URL + '/api/submissions/update', 
                {
                    id: submission_id,
                    status: 'signed'
                }
            )

            let signRequest = await axios.post(
                API_URL + '/api/submissions/sign_request',
                {submission_id: submission_id}
            )

            setSigned(true)

        } else {
            alert('Verification failed. Try again');
        }
        
    }

    const verify = async (event: any) => {
        
        event.preventDefault()

        console.log('\n\n\n signOTP: ', signOTP)
        console.log('\n\n\n')

        let verified = await axios.post(
            API_URL + '/api/submissions/verify_otp',
            {
                submission_id: submission_id,
                email: verifierEmail,
                otp: signOTP 
            } 
        )

        console.log('\n\n\n verification response: ', verified.data)

        if(verified.data.outcome == 'success') {

            let returned_signature = await axios.post(
                API_URL + '/api/submissions/verifier_sign', 
                {
                    submission_id: submission_id,
                    email: complainant_email
                }
            )

            console.log('\n\n\n returned_signature: ', returned_signature.data);

            setVerificationHash(returned_signature.data.signature.hash)
            setVerificationName(returned_signature.data.user.firstName + ' ' + returned_signature.data.user.lastName)
            setVerificationDate(returned_signature.data.signature.createdAt)
            

            // console.log('\n\n\n Signature hash: ', returned_signature.data.submission.hash)
            // console.log('\n\n\n')

            let signed_submission = await axios.post(
                API_URL + '/api/submissions/update', 
                {
                    id: submission_id,
                    status: 'verified'
                }
            )

            // let signRequest = await axios.post(
            //     API_URL + '/api/submissions/sign_request',
            //     {submission_id: submission_id}
            // )

            setVerified(true)

        } else {
            alert('Verification failed. Try again');
        }
        
    }

    useEffect(() => {
        (async () => {
            
            // let signature = await axios.get(API_URL + '/api/submissions/signature/' + submission_id)
            let submission = await axios.get(API_URL + '/api/submissions/' + submission_id)
            // console.log('\n\n\n complainant_email: ', complainant_email)
            let the_email = await complainant_email
            // console.log('\n\n\n the_email: ', the_email)
            if(submission.data.submission.status == 'signed') {
                // console.log('retreived submission is signed')

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
            } else {
                console.log('retreived submission is NOT signed')
            }

            // console.log('\n\n\n retreived signature: ', signature.data)

        })();        
    }, [])



    const handleResendSigningOTP = (event:any, email:string) => {
        dispatch(resendSigningOTP({ email }) as any)
    }

    return (<>



        {!otpSent && !signed && !already_signed ? 
                <div className="d-grid gap-2">
                    <button className="btn btn-dark" type="submit" onClick={sendOTP}>Sign Submission</button>
                </div>
            : <></>
        }       
        {otpSent && !signed  && !already_signed ?
            <>
            <form onSubmit={sign}>
                <div className="card py-5 px-5 otp-card fade show" style={{backgroundColor:"#f9f9f9"}}>
                    <h4 className="m-0">Sign Submission</h4>
                    <br/>
                    <p>I <strong>{complainant_name}</strong> Police Constable No. <strong>{complainant_regnum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge.</p>

                    <h6 className="mobile-text mt-3">Enter the Confirmation Code sent to your email. </h6>
                    <div className="mt-1">

                                    <div className="">
                                        <input
                                            type="text"
                                            name="otpCode"
                                            placeholder="******"
                                            style={{ fontSize: "16px", letterSpacing: '7px', textAlign: 'center', maxWidth:"200px" }}
                                            className="px-2 py-1 fs-3 mt-1 mb-2 stretched-text-input form-control otp-input"
                                            maxLength={6}
                                            value={signOTP}
                                            onChange={signOTPChange}
                                            minLength={6}
                                            pattern="\d{6}"
                                        />

                                        <div className="text-center"><button type="submit" className="btn btn-md btn-primary float-start" >Sign Now</button></div>


                                    </div>

                        {/* <input type="text" className="form-control otp-input" placeholder="  ###### " value={signOTP} onChange={signOTPChange} />
                        <button type="submit" className="btn btn-secondary otp-button" >Verify</button> */}


                    </div>
                    
                </div>
            </form>
            <div className="text-left mt-3">
                <span className="d-block mobile-text">Didn't receive the confirmation code?</span>
                {/* <div className="font-weight-bold text-danger cursor">Resend</div> */}
                <div className="font-weight-bold p-0 mt-0 text-center cursor">
                    <button onClick={(e) => handleResendSigningOTP(e, complainant_email)} className="btn btn-sm p-0 btn-link float-start">Resend</button>
                </div>
            </div>
            </>
            : <></>
        }

        { signed || already_signed?

            <div className="signature-container">
                <div className="signature-format">
                    {/* <!-- Row 1 --> */}
                    <div className="row sig-top">
                        <div className="col-6 col">
                            <div className="logo-placeholder d-flex swf-sign">
                                <span className="swf-e-signed">e-signed on</span> <span className="swf-swif">SWiF</span>
                            </div>
                        </div>
                        <div className="col-6 col">
                            <div className="text-placeholder text-right">{signatureDate.substring(11, 20)}</div>
                            <div className="text-placeholder text-right">{signatureDate.substring(0, 10)}</div>
                            {/* <div className="text-placeholder text-right">[ip address]</div> */}
                        </div>
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
                

        { verified || already_verified?

            <div className="signature-container">
                <div className=" signature-format">
                    {/* <!-- Row 1 --> */}
                    <div className="col-6 col">
                        <div className="logo-placeholder d-flex swf-sign">
                            <span className="swf-e-signed">e-signed on</span> <span className="swf-swif">SWiF</span>
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
                    <>
                        {verifyOtpSent ?
                            <form onSubmit={verify} className="verify">
                                <br/><br/>
                                <div className="card py-5 px-3 otp-card fade show">
                                    <h5 className="m-0">Verify Submission</h5>
                                    <br/>
                                    <span className="mobile-text">Enter the code sent to email </span>
                                    <div className="d-flex flex-row mt-5 otp-row">
                                        <input type="text" className="form-control otp-input" placeholder="  ###### " value={signOTP} onChange={signOTPChange} />
                                        <button type="submit" className="btn btn-secondary otp-button" >Verify</button>
                                    </div>
                                    <div className="text-center mt-5"><span className="d-block mobile-text">Don't receive the code?</span><span className="font-weight-bold text-danger cursor">Resend</span></div>
                                </div>
                            </form>
                            :
                            <div className="d-grid gap-2 verify">
                                <br></br>
                                <button className="btn btn-dark" type="submit" onClick={sendVerifyOTP}>Verify Submission</button>
                            </div>
                        }
                    </>
                }




            </div>   
            
            

            : <></>
        }


    </>)

}