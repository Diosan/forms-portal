import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
const DPP_EMAIL = import.meta.env.VITE_DPP_EMAIL
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import '../assets/Submission.css'
import '../assets/Signature.css'
import { exportPDF } from '../utils/pdfUtils';
import { useAppDispatch } from "../store/store"
import { resendSigningOTP } from "../slices/auth";
import { useSelector } from "react-redux"
import { RootState } from '../store';
import { faArrowLeftLong, faPencilAlt, faCheck, faTrash, faTrashCan, faSpinner } from '@fortawesome/free-solid-svg-icons';




type SignIndictmentProps = {
    submission_id: number,
    submissionType: string,
    complainant_email: string,
    complainant_name: string,
    complainant_regnum: string,
    complainant_rank: string,
    already_signed: boolean,
    already_verified: boolean
}

const log = (type: any) => console.log.bind(console, type)


export const ConsentIndictment = ({ submission_id, complainant_email, submissionType, complainant_rank, complainant_name, complainant_regnum, already_signed, already_verified }: SignIndictmentProps) => {

    const id = { submission_id };
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState(false);
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state

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
    const [verifiers, setVerifiers] = useState<{}[]>([])
    const [commissionedEmail, setCommissionedEmail] = useState('')
    const [textReset, settextRest] = useState(`Ddidn't receive the signing code?`)
    const [textCodeResent, setTextCodeResent] = useState(`Signing code has been resent to your registered email address.`)

    const [isFinalSigned, setIsFinalSigned] = useState(false)

    const [showResendLink, setShowResendLink] = useState(true)

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [additionalNotes, setAdditionalNotes] = useState(false)

    const [signingName, setSigningName] = useState('')

    const [oathType, setOathType] = useState('oath')

    const [acknowledged, setAcknowledged] = useState(false)
    const [additionalAcknowledged, setAdditionalAcknowledged] = useState(false)


    const acknowledgedChange = (event: any) => {
        setAcknowledged(event.target.checked);
    }

    const additionalAcknowledgedChange = (event: any) => {
        setAdditionalAcknowledged(event.target.checked);
    }

    const oathTypeChange = (event: any) => {
        setOathType(event.target.value)
    }

    const commisionedChange = (event: any) => {
        setCommissionedEmail(event.target.value)
        console.log('\n\n\n Commisioned changed', commissionedEmail)
        console.log('\n\n\n')
    }

    const signingNameChange = (event: any) => {
        setSigningName(event.target.value)

    }

    const dispatch = useAppDispatch();

    const signOTPChange = (event: any) => {
        console
        setSignOTP(event.target.value)
    }

    const sendOTP = async () => {
        // console.log('\n\n\n complainant_email: ', complainant_email)
        console.log('\n\n\n Sending OTP')
        goToAnchor();
        let signing_name = submissionType == 'INDICTMENT' ? signingName : complainant_name
        let signing_email = submissionType == 'INDICTMENT' ? await localStorage.getItem('email') : complainant_email
        let otp_send = await axios.post(
            API_URL + '/api/submissions/send_otp',
            {
                submission_id: submission_id,
                email: DPP_EMAIL,
                name: 'Director Of Public Prosecutions'
            }
        )
        console.log('otp_send: ', otp_send.data)
        if (otp_send.data.outcome == 'success') {
            setOtpSent(true)
        }
    }

    const reSendOTP = async () => {
        // console.log('\n\n\n complainant_email: ', complainant_email)
        console.log('\n\n\n Sending OTP')
        goToAnchor();
        setShowResendLink(false)

        let otp_send = await axios.post(
            API_URL + '/api/submissions/send_otp',
            {
                submission_id: submission_id,
                email: complainant_email,
                name: complainant_name
            }
        )
        console.log('otp_send: ', otp_send.data)
        if (otp_send.data.outcome == 'success') {
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
        if (otp_send.data.outcome == 'success') {
            setVerifyOtpSent(true)
            setVerifierEmail(otp_send.data.email)
        }
    }

    const goToCompletedSubmission = () => {
        // history.push('/sub/complete', { data: id });
        if(submissionType == 'INDICTMENT') {
            navigate('/ind/complete', { state: { id: submission_id } });
        } else {
            navigate('/sub/complete', { state: { id: submission_id } });
        }
        
    };


    const consent = async (event: any) => {
        event.preventDefault()

        const stylesForPrinting = `

                body {
                font-family: 'Arial', sans-serif;  line-height:1.2rem;
                }
                *{font-size:9pt; line-height:1.2rem}
                    
                    .signature-format {
                        width: 300px;
                        border: 2px solid #000; 
                        padding:5px 10px 7px 10px;
                        background-color:#ebf7ff
                        }
                        
                        .signature-format .col {
                        padding:0px
                        }
                        
                        .swf-e-signed{
                        font-size:.8rem;
                        font-weight:bold;
                        color:#555
                        }
                        .swf-swif{
                        font-size:1rem;
                        font-weight:bold;
                        margin-left:4px;
                        color:#c13127
                        }
                        .swf-sign{
                        display:flex;
                        align-items: center;
                        }
                        
                        .text-placeholder{
                        padding: 0px;
                        font-size:.75rem;
                        margin:0 0 1px 0;
                        text-align:right
                        }
                        .text-placeholder {
                        line-height: 1.2;
                        }
                        
                        .logo-placeholder {
                        margin:3px 0 0 0;
                        text-align:left;
                        }
                        
                        .name-placeholder {
                        line-height: 1.1;
                        font-size:1rem;
                        margin:5px 0;
                        }
                        
                        .hash-placeholder {
                        font-size:.8rem;
                        line-height:.82rem;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        white-space: pre-wrap;
                        word-break: break-all;
                        margin:0
                        }
                    .accused-table {
                        display: flex;
                        flex-direction: column;
                        }
                        
                        .flex-row {
                        display: flex;
                        flex-direction: row;
                        align-items: center; /* Optional, for vertical centering */
                        margin-bottom: 10px; /* Spacing between rows */
                        }
                        
                        .flex-cell {
                        margin-right: 10px; /* Spacing between cells */
                        }
                        
                        .offence-table {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        }
                        
                        .flex-header, .flex-row {
                        display: flex;
                        justify-content: space-between;
                        }
                        
                        .header-cell, .row-cell {
                        flex-grow: 1;
                        text-align: left;
                        padding: 5px; /* Adjust as needed */
                        border-bottom: 1px solid #ddd; /* For a line under each row */
                        }
                        
                        .flex-header {
                        background-color: #f9f9f9; /* Optional, for header background */
                        font-weight: bold; /* Optional, for header font styling */
                        }
                        
                        .sig-top{
                        padding:0 10px
                        }
                        
                        
                        
                        .swf-container{
                            border-radius: 5px;
                            max-width: 900px;
                            padding: 20px 40px;
                            margin: 30px 30px 30px 300px;
                            flex-grow: 1;
                        }
                        
                        .left-column {
                        box-shadow: 5px 0 5px -5px rgba(0, 0, 0, 0.2); /* Small shadow on the right */
                        }
                        
                        
                        .btn-xs {
                        padding: .25rem .5rem;
                        font-size: .875rem;
                        line-height: 1.2;
                        border-radius: .2rem;
                        }
                        
                        
                        #container-pdf{
                        width:700px;
                        padding:10px 50px 10px 20px;
                        }
                        
                        
                        
                        .form-control, .form-select{
                            border-radius:0;
                            color:#000;
                        }
                        
                        .rjsf #root {
                            /* max-width: 1280px; */
                            width: 100%;
                            margin: 0;
                            padding: 20px;
                            text-align: center;
                            background-color: #fff;
                            /* display:flex;
                            flex-wrap: wrap;
                            gap:30px; */
                            color: #000;
                            
                        
                        }
                        
                        
                        
                        .swf-flex-container fieldset {
                            /* max-width: 1280px; */
                            width: 100%;
                            margin: 0;
                            text-align: center;
                            background-color: #fff;
                            display:flex;
                            flex-wrap: wrap;
                            gap:10%;
                            color: #000;
                        }
                        .swf-flex-container fieldset .form-group{
                            /* max-width: 1280px; */
                            width: 45%;
                        }
                        
                        .sw-col-a{
                            flex: 0 0 200px; /* This sets the left column to a fixed width of 200px */
                            max-width: 200px;
                        }
                        
                        .sw-col-b{
                        flex-grow: 1; /* This allows the right column to take up the remaining space */
                            text-align: left; /* Aligns text to the left */
                        }
                        
                        
                        .flex-container {
                            /* display: flex; */
                            justify-content: space-between;
                        }
                        
                        .flex-item {
                            flex: 1 1 50%;
                        }
                        
                        .group-submission{
                            padding:15px;
                        }
                        
                        .swf-step{
                            padding:10px;
                            color:#000;
                            font-weight: bold;
                            height:100%
                        }
                        
                        .swf-step-1 {
                            padding: 10px;
                            color: #000;
                            font-weight: bold;
                            position: absolute;
                            right:0;
                            z-index:1000;
                            top: 0;
                            height: 100%;
                        }
                        
                        .accused-card .rjsf{
                            padding:0;
                        }
                        
                        .accused-index{
                        position:absolute; 
                        max-width:200px;
                        min-width:100px;
                        font-weight:bold;
                        font-size:.9rem;
                        background-color:#feeee1;
                        border:2px solid #f5c59e;
                        color:#333;
                        padding:5px 15px;
                        top:-10px; right:-15px
                        }
                        
                        .accused-card .rjsf #root{
                            padding:0;
                        }
                        
                        .add-charge .rjsf #root{
                        background-color:transparent;
                        
                        }
                        .add-charge .rjsf {
                            margin-bottom: 10px;
                            margin-top:20px;
                        }
                        
                        #root__title{
                            font-weight:bold;
                        }
                        #root__description{
                            font-size: 18px;
                        }

                    .accused-table td {
                    padding-right: 0;
                    }

                    .offence-table th {
                    padding: 3px 5px;
                    }

                    .offence-table td {
                    padding: 3px 5px;
                    border: 1px solid #555;
                    }

                    .swf-tbl,
                    #pdf-container .flex-header,
                    .pdf-head {
                    gap: 10px;
                    }
                    .swf-tbl {
                    }
                    .swf-tbl .flex-row,
                    .pdf-head .header-cell {
                    border-right: 1px solid #555;
                    margin-bottom: 0;
                    padding-bottom: 4px;
                    }

                    .swf-tbl .flex-row.last,
                    .pdf-head .header-cell.last {
                    border-right: transparent;
                    }

                    .swf-tbl .flex-row.first,
                    .header-cell.first {
                    border-left: 1px solid #555;
                    padding: 5px 5px 5px 10px;
                    }
                    .swf-tbl {
                    border-bottom: 1px solid #555;
                    border-right: 1px solid #555;
                    }

                    .pdf-head {
                    border-top: 1px solid #555;
                    border-bottom: 1px solid #555;
                    align-items: center;
                    justify-content: center;
                    border-right: 1px solid #555;
                    }

                    .header-cell {
                    border-bottom: transparent;
                    }
                    #regForm {
                    background-color: #f1f1f1;
                    margin: 50px auto;
                    width: 100%;
                    min-width: 300px;
                }
                .rjsf {
                    margin-bottom: 50px;
                }
                
                .form-group {
                    text-align: left;
                }
                
                
                
                .form-control {
                    margin-bottom: 20px;
                }
                
                .progress-buttons {
                    text-align: right;
                }
                
                .rjsf{
                    padding:10px 20px;
                }
                
                .next-button {
                    margin-left: 5px;
                }
                
                .control-label {
                    font-weight: bold;
                }
                
                .accused-card {
                    margin-bottom: 30px;
                }
                
                .add-charge fieldset {
                width: 70%;
                }
                
                .control-label {
                    color: #444;
                }
                
                .submissions-container {
                    background-color: #f1f1f1;
                    padding: 50px 100px;
                }
                
                .submission-card {
                    margin-bottom: 20px !important;
                }
                
                .new-submission-btn {
                    margin-bottom: 50px;
                }
                
                .submissions-title {
                    margin: 40px 0;
                }
                
                .complainant-details {
                    width: 700px;
                    text-align: left;
                }
                
                .complainant-details label {
                    font-weight: bold;
                }
                
                .signature-frame {
                    border: 3px solid #444;
                    padding: 40px;
                }
                
                `

        try {
            const element = document.getElementById("container-pdf");
            if (!element) {
                throw new Error('Element not found.');
            }
            const htmlContent = element.outerHTML;


            let signing_email = submissionType == 'INDICTMENT' ? await localStorage.getItem('email') : complainant_email
            let signing_type = submissionType == 'INDICTMENT' ? 'indictment' : 'complaint'
            
            axios.post(`${API_URL}/api/submissions/sign_submission`,
                {
                    submission_id: submission_id,
                    email: signing_email,
                    otp: signOTP,
                    html: htmlContent,
                    type: signing_type
                })
                .then(response => {
                    console.log(response || "")
                    if (response.data.outcome == 'success') {
                        setSigned(true)
                        goToCompletedSubmission();
                    } else {
                        alert('Verification failed. Try again');
                        return
                    }

                })
                .catch(error => {
                    console.error('Error server:', error);
                });
        } catch (error) {
            console.error('Error', error);
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

        if (verified.data.outcome == 'success') {

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
            let submission = await axios.get(API_URL + '/api/submissions/' + submission_id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            })
            if (submission.data.outcome == "error") {
                console.log('Not allowed')
            } else {
                // console.log('\n\n\n complainant_email: ', complainant_email)
                let the_email = await complainant_email
                // console.log('\n\n\n the_email: ', the_email)
                console.log('\n\n\n Checking for additional notes: ', submission.data.submission)
                if (submission.data.submission.additionalNotes == null) {
                    console.log('addtionalNotes is null')
                    setAdditionalNotes(false)
                } else {
                    console.log('addtionalNotes is NOT null')
                    setAdditionalNotes(true)
                }

                if (submission.data.submission.status == 'final') {
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

                if (submission.data.submission.status == 'final') {
                    setIsFinalSigned(true)
                }

                let returned_verifiers = await axios.get(API_URL + '/api/submissions/verifiers/1')

                let verifs = returned_verifiers.data.verifiers;
                await setVerifiers([...verifs, ...verifiers])
                // verifs.map(async (verif: any) => {
                //     console.log('\n verif: ', verif)
                //     setVerifiers([verif, ...verifiers])
                //     // console.log('\n verifiers: ', verifiers)
                // })

                // console.log('\n\n\n verifs: ', verifs)
                // console.log('\n\n\n')

                // await setVerifiers([...verifiers, ...verifs])

                // console.log('\n\n\n verifiers: ', verifiers)
                // console.log('\n\n\n')

                // console.log('\n\n\n retreived signature: ', signature.data)

            }






        })();
    }, [refreshTrigger])



    const handleResendSigningOTP = (event: any, email: string) => {
        dispatch(resendSigningOTP({ email }) as any)
    }

    const goToAnchor = () => {
        setTimeout(() => {
            console.log('Anchor');
            const anchorElement = document.getElementById('anchorSign');
            if (anchorElement) {
                anchorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300); // 500 milliseconds delay
    }

    const handleCheckboxChange = (event: any) => {
        setIsChecked(event.target.checked);
    };




    return (

        <div id="acnhor-sign" style={{ border: "10px solid #eee", backgroundColor: "#f9f9f9", padding: "20px", margin: "25px 0 0 0" }} >



            {/* {!otpSent && signed ? */}
            {!otpSent && !signed && !already_signed && !isFinalSigned ?
                <>
                    
                    <h5 className="m-0 text-center fw-bold">DIRECTOR OF PUBLIC PROSECUTIONS</h5>

                </>
                : <>
                    {!isFinalSigned ?
                        <h5 className="m-0 mb-3 text-center fw-bold">Enter Signing Code</h5>
                        :
                        <>
                            <div style={{ fontSize: "20px", fontWeight: "bold" }} className="m-0 mb-3 text-left fw-bold">Signed</div>
                        </>
                    }

                </>
            }



            {!otpSent && !signed && !already_signed && !isFinalSigned ?

                <div className="" style={{ width:"100%", maxWidth:"400px", display: "block", margin: "15px auto"}} >
                    <div className="mt-3 mb-3" style={{maxWidth:"250px", margin:"0 auto"}}>
                        <button className="btn btn-primary" style={{ width: "200px" }} type="submit" onClick={sendOTP}>Request Consent Code</button>
                    </div>
                </div>

                : <></>
            }


            {otpSent && !signed && !already_signed ?
                <>


                    <form onSubmit={consent}>
                        <div className="" style={{}}>
                            <br />

                            <div className="text-center mb-2" style={{ fontSize: "11pt", margin: "0 20px" }}>
                                A <strong>Signinig code</strong> has been sent to your registered email address. Please enter the code into the box below to authenticate and complete the signing process..
                            </div>
                            <div className="text-center mb-4">
                                <div style={{ display: "block", margin: "0 auto", width: "200px" }}><input
                                    type="text"
                                    name="otpCode"
                                    placeholder="******"
                                    style={{ fontSize: "16px", letterSpacing: '7px', textAlign: 'center', maxWidth: "200px" }}
                                    className="px-2 py-1 fs-3 mt-1 mb-2 stretched-text-input form-control otp-input"
                                    maxLength={6}
                                    value={signOTP}
                                    onChange={signOTPChange}
                                    minLength={6}
                                    pattern="\d{6}"
                                />
                                </div>



                                <div className="text-center m-1"><button type="submit" className="btn btn-md btn-primary" >Sign and Submit</button></div>


                            </div>



                        </div>
                    </form>
                    <div className="text-center fs-6 mt-0">
                        {showResendLink ?
                            <><span className="mobile-text">{textReset}</span><span><button onClick={reSendOTP} className="btn btn-md btn-link" >Click to resend</button></span></>
                            : <>
                                <><span style={{ color: "#0d6efd" }} className="mobile-text">{textCodeResent}</span></>
                            </>
                        }
                    </div>
                </>
                : <></>
            }



            {isFinalSigned || already_signed ?
                <div>


                    <div className="signature-container">
                        <div className=" signature-format" style={{ backgroundColor: "#ebf7ff" }}>
                            {/* <!-- Row 1 --> */}
                            <div style={{ display: "flex" }}>
                                <div className="col-6 col">
                                    <div className="logo-placeholder d-flex swf-sign">
                                        <span className="swf-e-signed">e-signed on</span> <span className="swf-swif">SWiF</span>
                                    </div>
                                </div>
                                <div className="col-6 col">
                                    <div style={{ fontSize: "8pt", textAlign: "right" }} className="text-placeholder text-right">{signatureDate.substring(11, 20)}</div>
                                    <div style={{ fontSize: "8pt", textAlign: "right" }} className="text-placeholder text-right">{signatureDate.substring(0, 10)}</div>
                                    {/* <div className="text-placeholder text-right">[ip address]</div> */}
                                </div>
                            </div>

                            {/* <!-- Row 2 --> */}
                            <div className="col-12 col">
                                <div className="name-placeholder fw-bold  text-left">{signatureName}</div>
                            </div>

                            {/* <!-- Row 3 --> */}
                            <div className="col-12 col">
                                <p className="hash-placeholder text-left" style={{ fontSize: "8pt", lineHeight: "10pt" }}>
                                    {signatureHash}</p>
                            </div>
                        </div>
                    </div>


                    {verified || already_verified ?

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
                        <>
                            {verifyOtpSent ?
                                <form onSubmit={verify} className="verify">
                                    <br /><br />
                                    <div className="card py-5 px-3 otp-card fade show">
                                        <h5 className="m-0">Verify Submission</h5>
                                        <br />




                                        <div className="">
                                            <input
                                                type="text"
                                                name="otpCode"
                                                placeholder="******"
                                                style={{ fontSize: "16px", letterSpacing: '7px', textAlign: 'center', maxWidth: "200px" }}
                                                className="px-2 py-1 fs-3 mt-1 mb-2 stretched-text-input form-control otp-input"
                                                maxLength={6}
                                                value={signOTP}
                                                onChange={signOTPChange}
                                                minLength={6}
                                                pattern="\d{6}"
                                            />

                                            <div className="text-center"><button type="submit" className="btn btn-md btn-primary float-start" >Sign Now</button></div>


                                        </div>

                                    </div>
                                </form>
                                :
                                <div className="d-grid gap-2 verify">
                                </div>
                            }
                        </>
                    }




                </div>



                : <></>
            }
            <div id="anchorSign"></div>

        </div>)

}