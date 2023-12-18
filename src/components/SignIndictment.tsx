import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import '../assets/Submission.css'
import '../assets/Signature.css'
import { exportPDF } from '../utils/pdfUtils';
import { useAppDispatch } from "../store/store"
import { resendSigningOTP } from "../slices/auth";



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


export const SignIndictment = ({ submission_id, complainant_email, submissionType, complainant_rank, complainant_name, complainant_regnum, already_signed, already_verified }: SignIndictmentProps) => {

    
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState(false);

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







    const printPDF = async (submissionId: number) => {

        try {
            const message = await exportPDF('container-pdf', `${API_URL}/api/pdf/puppeteer`, submissionId);
            // alert('Submission successful!');
            navigate(`/sign/${submissionId}`);
        } catch (error) {
            console.log(error)
            alert('Failed to submit the form. Please check your email for confirmation.');
        }
    };


    const [oathType, setOathType] = useState('oath')

    const [acknowledged, setAcknowledged] = useState(false)

    const acknowledgedChange = (event: any) => {
        setAcknowledged(event.target.checked);
    }

    const oathTypeChange = (event: any) => {
        setOathType(event.target.value)
      }

    const commisionedChange = (event: any) => {
        setCommissionedEmail(event.target.value)
        console.log('\n\n\n Commisioned changed', commissionedEmail)
        console.log('\n\n\n')
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

        console.log('\n\n verified: ', verified)

        if (verified.data.outcome == 'success') {
            // alert('Verification Successful');
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

            printPDF(submission_id)
            setSigned(true)

            setRefreshTrigger(oldValue => oldValue + 1);

            await axios.post(
                API_URL + '/api/submissions/update',
                {
                    id: submission_id,
                    status: 'signed'
                }
            ).then(response => {
                setRefreshTrigger(oldValue => oldValue + 1);

                console.log("response from axios")
                console.log(response.data);
                // setTimeout(async () => {
                //     // Refresh the page and submit the submission
                //     await printPDF(submission_id);
                //         setSigned(true);
                //     }, 1000); // Wait for 500 milliseconds
            }) 

            console.log('\n\n\n commissionedEmail: ', commissionedEmail)

        

            //refresh the page and submit the submission

            // printPDF(submission_id)
            // setSigned(true)
            




        } else {
            alert('Verification failed. Try again');
            return verified.data

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
            let submission = await axios.get(API_URL + '/api/submissions/' + submission_id)
            // console.log('\n\n\n complainant_email: ', complainant_email)
            let the_email = await complainant_email
            // console.log('\n\n\n the_email: ', the_email)
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

    const handleCheckboxChange = (event:any) => {
        setIsChecked(event.target.checked);
    };




    return (

        <div id="acnhor-sign" style={{ border: "10px solid #eee", backgroundColor: "#f9f9f9", padding: "20px", margin: "25px 0 0 0" }} >



            {/* {!otpSent && signed ? */}
            {!otpSent && !signed && !already_signed && !isFinalSigned ?
                <>
                    <h5 className="m-0 text-center fw-bold">I'm Ready to Sign</h5>
                
                    {submissionType == 'COMPLAINT WITHOUT OATH' ?
                        <></>
                        :
                        <>
                            {/* <p style={{ fontSize: "10pt", lineHeight:"13pt", margin:"0 20px 10px"  }}>I <strong>{complainantName}</strong> Police Constable No. <strong>{complainantRegNum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge
                            </p> */}
                            {/* <div style={{ margin: "10px 0 0 0", padding: "15px " }}>
                                <p style={{ fontSize: "11pt", lineHeight: "14pt", margin: "0 20px 10px" }}>I <strong>{complainant_name}</strong> {complainant_rank} <strong>{complainant_regnum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge</p>
                            </div> */}
                        </>
                    }


                </>
                : <>
                    {!isFinalSigned  ?
                        <h5 className="m-0 mb-3 text-center fw-bold">Enter Signing Code</h5>
                    :
                    <>
                        <div style={{fontSize:"20px", fontWeight:"bold"}}className="m-0 mb-3 text-left fw-bold">Signed</div>
                    </>
                }

                </>
            }



            {/* <p style={{ fontSize: "10pt", lineHeight:"13pt", margin:"0 20px 10px"  }}>I <strong>{complainantName}</strong> Police Constable No. <strong>{complainantRegNum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge
            </p> */}


            {!isFinalSigned &&
                
                    submissionType == 'COMPLAINT ON OATH' || submissionType == 'COMPLAINT ON OATH REQUESTING WARRANT' ?
                <>
                    <div  style={{width:"200px", margin:"30px auto 20px auto"}}>
                    <select value={oathType} 
                        style={{padding:"5px", width:"200px", fontSize: "20px"}}
                        onChange={oathTypeChange} >
                        <option value="oath">Oath</option>
                        <option value="affirmation">Affirmation</option> 
                    </select>
                    </div>
                    

                    {oathType == 'oath' ?
                        <>
                            <div style={{ margin: "10px 0 0 0", padding: "15px " }}>
                                {/* <p style={{ fontSize: "11pt", lineHeight: "14pt", margin: "0 20px 10px" }}>I <strong>{complainant_name}</strong> {complainant_rank} <strong>{complainant_regnum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge</p> */}
                                
                                <p style={{ fontSize: "11pt", lineHeight: "14pt", margin: "0 20px 10px" }}>
                                    I {complainant_name} {complainant_rank} {complainant_regnum},

                                    solemnly swear that I have signed this complaint on oath and by that I declare that –

                                    

                                    <br/><br/>(i)         I make this [application/complaint] conscientiously, wilfully and honestly having reasonable grounds for believing that the named
                                    accused person or persons has or have committed the offence alleged as stated in the complaint and that the particulars are true to
                                    the best of my knowledge;

                                    <br/><br/>(ii)        I acknowledge this declaration to be an oath that is binding;

                                    <br/><br/>(iii)       I acknowledge that the wilful false affirmation of this declaration is an offence.
                                </p>
                            
                            </div>
                        </>
                        :
                        <>
                            <div style={{ margin: "10px 0 0 0", padding: "15px " }}>
                                {/* <p style={{ fontSize: "11pt", lineHeight: "14pt", margin: "0 20px 10px" }}>I <strong>{complainant_name}</strong> {complainant_rank} <strong>{complainant_regnum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge</p> */}
                                
                                <p style={{ fontSize: "11pt", lineHeight: "14pt", margin: "0 20px 10px" }}>
                                    I {complainant_name} {complainant_rank} {complainant_regnum},

                                    do solemnly, sincerely, and truly affirm, that I have signed this complaint on oath and by that I declare that –

                                    

                                    <br/><br/>(i)          I make this complaint conscientiously, wilfully and honestly having reasonable grounds for believing that the named accused person

or persons has or have committed the offence alleged as stated in the complaint and that the particulars are true to the best of my

knowledge;

                                    <br/><br/>(ii)        I acknowledge this declaration to be an oath that is binding;

                                    <br/><br/>(iii)       I acknowledge that the wilful false swearing of this oath is an offence
                                </p>
                            
                            </div>                        
                        </>
                    }


                </>
                :
                <>
                </>
            
            }

            


            {!isFinalSigned &&
            
                <div style={{ margin: "10px 0 0 0", padding: "15px " }}>
                <p style={{ fontSize: "11pt", lineHeight: "14pt", margin: "0 20px 10px" }}>
                    
                    <div className="form-group field field-boolean">
                        <div className="checkbox">
                            <label>
                                <input value = "test" type="checkbox" onChange={acknowledgedChange} />
                                <span>Summary of evidence is included in appendix A below</span>
                            </label>
                        </div>                            
                    </div>
                        

                </p>
            </div>
            }



            {!otpSent && !signed && !already_signed && !isFinalSigned ?

                <div className="" style={{ display:"block", margin:"15px auto", width:"200px"}} >
                    { acknowledged ?
                        <button className="btn btn-primary" style={{  width:"200px"}}  type="submit" onClick={sendOTP}>Request Signing Code</button>
                        :
                        <button className="btn btn-primary" style={{  width:"200px"}}  type="submit" onClick={sendOTP} disabled>Request Signing Code</button>
                    }
                    
                </div>

                : <></>
            }


            {otpSent && !signed && !already_signed ?
                <>
                    {/* <div className="mb-3">
                <label>Commissioned Officer</label><br/>
                <select className='form-select' value={commissionedEmail} onChange={commisionedChange}>
                    
                    {verifiers.map((verifier: any) => (
                        <option key={verifier.id} value={verifier.email}>{verifier.name}</option>
                    ))} 
                </select>
                </div> */}

                    <form onSubmit={sign}>
                        <div className="" style={{}}>
                            <br />

                            <div className="text-center mb-2" style={{ fontSize: "11pt", margin: "0 20px" }}>
                                A <strong>Signinig code</strong> has been sent to your registered email address. Please enter this code below to authenticate and complete the signing process..
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

                                <div>
                                    {submissionType == 'COMPLAINT WITHOUT OATH' ?
                                        <></>
                                        :
                                        <>
                                        {/* <p style={{ fontSize: "10pt", lineHeight:"13pt", margin:"0 20px 10px"  }}>I <strong>{complainantName}</strong> Police Constable No. <strong>{complainantRegNum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge
                                         </p>
                                         <div style={{ margin: "10px 0 0 0", padding: "10px " }}>
                                             <p style={{ fontSize: "11pt", lineHeight: "14pt", margin: "0 20px 10px" }}>I <strong>{complainant_name}</strong> {complainant_rank} <strong>{complainant_regnum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge
                                             </p>
                                         </div> */}
                                         </>
                                        
                                    }
                                </div>
                                
                                    <div className="text-center m-1"><button type="submit" className="btn btn-md btn-primary" >Sign and Submit</button></div>
                                

                            </div>

                            {/* <span className="mobile-text">Enter the code sent to email </span>
                        <div className="d-flex flex-row mt-5 otp-row">
                            <input type="text" className="form-control otp-input" placeholder="  ###### " value={signOTP} onChange={signOTPChange} />
                            <button type="submit" className="btn btn-secondary otp-button" >Sign And Submit</button>
                        </div> */}

                        </div>
                    </form>
                    <div className="text-center fs-6 mt-0">
                        {showResendLink ?
                            <><span className="mobile-text">{textReset}</span><span><button onClick={reSendOTP} className="btn btn-md btn-link" >Click to resend</button></span></>
                        :<>
                            <><span style={{color:"#0d6efd"}} className="mobile-text">{textCodeResent}</span></>
                        </>
                        }
                    </div>
                </>
                : <></>
            }



            {isFinalSigned || already_signed ?
                <div>


                    {/* <div className="signature-format-complainant">
                        <div className="col-12 col">
                            <div className="logo-placeholder d-flex swf-sign">
                                <span className="swf-e-signed">e-signed on</span> <span className="swf-swif">SWiF</span>
                            </div>
                        </div>
                        <div className="col-12 col">
                            <div className="text-placeholder text-right">{signatureDate.substring(11, 20)}</div>
                            <div className="text-placeholder text-right">{signatureDate.substring(0, 10)}</div>
                            <div className="text-placeholder text-right"></div>
                        </div>

                        <div className="col-12 col">
                            <div className="name-placeholder fw-bold  text-left">{signatureName}</div>
                        </div>

                        <div className="col-12 col">
                            <p className="hash-placeholder text-left">
                                {signatureHash}</p>
                        </div>
                    </div> */}

                    <div className="signature-container">
                        <div className=" signature-format" style={{backgroundColor:"#fff"}}>
                            {/* <!-- Row 1 --> */}
                            <div style={{display:"flex"}}>
                                <div className="col-6 col">
                                <div className="logo-placeholder d-flex swf-sign">
                                    <span className="swf-e-signed">e-signed on</span> <span className="swf-swif">SWiF</span>
                                </div>
                            </div>
                            <div className="col-6 col">
                                <div style={{ fontSize: "8pt", textAlign:"right" }} className="text-placeholder text-right">{signatureDate.substring(11, 20)}</div>
                                <div style={{ fontSize: "8pt", textAlign:"right" }} className="text-placeholder text-right">{signatureDate.substring(0, 10)}</div>
                                {/* <div className="text-placeholder text-right">[ip address]</div> */}
                            </div>
                            </div>

                            {/* <!-- Row 2 --> */}
                            <div className="col-12 col">
                                <div className="name-placeholder fw-bold  text-left">{signatureName}</div>
                            </div>

                            {/* <!-- Row 3 --> */}
                            <div className="col-12 col">
                                <p className="hash-placeholder text-left"   style={{ fontSize: "8pt", lineHeight:"10pt"}}>
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
                                    {/* <button className="btn btn-dark" type="submit" onClick={sendVerifyOTP}>Verify Submission</button> */}
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