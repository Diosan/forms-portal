// Import Form and validator from RJSF form despite what documentation says or fails to say
import { useEffect, useState } from "react"
import { API_URL } from "../config/api"
import axios from "axios"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import "../assets/Submission.css"
import "../assets/Sign.css"
import "../assets/Style.css"
import "../assets/Signature.css"
// import "../assets/javascript/submission"
import { Step } from "./Step"
import { Complainant } from "./Complainant"
import { Charges } from "./Charges"
import { Offences } from "./Offences"
import AuthService from "../services/AuthService"
import { Navigate, useNavigate } from "react-router-dom"
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
    useParams,
} from "react-router-dom"

import { SignIndictment } from "./SignIndictment"
import { exportPDF } from '../utils/pdfUtils';

// import MyDocument from './PrintPdfDocument'; 
// import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';




type SignProps = {}




const log = (type: any) => console.log.bind(console, type)

export const Sign = ({ }: SignProps) => {

    const { id } = useParams()

    const navigate = useNavigate()

    const auth = new AuthService



    const [status, setStatus] = useState('')
    const [complainantName, setComplainantName] = useState('')
    const [complainantAgency, setComplainantAgency] = useState('')
    const [complainantRegNum, setComplainantRegNum] = useState('')
    const [complainantEmail, setComplainantEmail] = useState('')
    const [title, setTitle] = useState('')
    const [accuseds, setAccuseds] = useState([])
    const [offences, setOffences] = useState<{
        id: any
        firstName: any
        lastName: any
        ICCS: any
        dateOfOffence: any
        particulars: any
    }[]>([])

    const signSubmission = () => {
        console.log('Signing form ')
    }

    const currentDate = () => {
        let today = new Date()
        return today.toISOString().split('T')[0]
    }

    useEffect(() => {

        const fetchSubmission = async () => {
            let submission = await axios.get(API_URL + '/api/submissions/' + id)
            // console.log('\n\n\n Submision Status: ', submission.data.submission.status)
            setStatus(submission.data.submission.status)
            setTitle(submission.data.submission.description)
            setComplainantName(submission.data.complainant.firstName + ' ' + submission.data.complainant.lastName)
            setComplainantAgency(submission.data.complainant.agency)
            setComplainantRegNum(submission.data.complainant.regNum)
            setComplainantEmail(submission.data.complainant.email)
            setAccuseds(submission.data.accuseds)
        }


        const fetchCharges = async (accused: any) => {

            let firstName = accused.firstName
            let lastName = accused.lastName

            let charges = await axios.get(API_URL + '/api/accuseds/charges/' + accused.id)

            charges.data.charges.map((charge: any, i: number) => {

                let offence = {
                    id: charge.id,
                    firstName: firstName,
                    lastName: lastName,
                    ICCS: charge.ICCS,
                    dateOfOffence: charge.dateOfOffence,
                    particulars: charge.particulars
                }
                console.log('Adding charge ' + i + ' to offences ', offence)
                setOffences([...offences, offence])
            })

        }

        if (auth.loggedIn()) {

            console.log('\n\n\n You are logged in \n\n\n')
            fetchSubmission()

        } else {

            console.log('\n\n\n You are NOT logged in \n\n\n')
            navigate("/")
        }

    }, [])



    const printPDF = async (event: any, submissionId: number) => {
        event.preventDefault();
        try {
            const message = await exportPDF('container-pdf', `${import.meta.env.VITE_API_URL}/api/pdf/incoming`, submissionId);
            alert(`Submission successful! ${message}`);
        } catch (error) {
            console.log(error)
            alert('Failed to submit the form. Please check your email for confirmation.');
        }
    };

    return (
        <div className="d-flex">



            <div className="container submissions-container" style={{ borderRadius: "5px", maxWidth: "900px", padding: "20px 40px", margin: "30px 30px 30px 300px", flexGrow: 1 }}>

                <button onClick={(e) => {
                    if (id !== undefined) {
                        // Assuming 'id' is a string that needs to be converted to a number
                        const numericId = parseInt(id, 10);
                        if (!isNaN(numericId)) {
                            printPDF(e, numericId);
                        }
                    }
                }}
                >Submit and Convert to PDF</button>



                <div className="fade show">
                    <h4 className='mb-3 fs-4 text-center'> Complaint With Oath ({title})</h4>
                </div>

                <div className="card fade show">
                    <div className="card-body"  id="container-pdf" style={{fontSize:"12px"}}>
                        <h5 className="card-title text-center ">Complainant: The State</h5><br /> <br />

                        <div className="text-left complainant-details">
                            {accuseds.map((accused: any, i: number) => (
                                <div className="accused-table swf-tbl-container" key={accused.id}>
                                    <div className="flex-row">
                                        <div className="flex-cell sw-col-a"><label>Name of Accused: </label></div>
                                        <div className="flex-cell sw-col-b">{i + 1} {accused.firstName} {accused.lastName} <strong>-{accused.adulthood}</strong></div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="flex-cell sw-col-a"><label>ID: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.identification}</div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="flex-cell sw-col-a"><label>Gender Identity: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.gender}</div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="flex-cell sw-col-a"><label>Date Of Birth: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.dateOfBirth}</div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="flex-cell sw-col-a"><label>Address: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.address}</div>
                                    </div>
                                    <div>
                                    <div className="flex-row">
                                        <div className="flex-cell sw-col-a"><label>National of Trinidad and Tobago: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.tntNational ? 'Yes' : 'No'}</div>
                                        <div className="flex-cell sw-col-a"><label>Resident of Trinidad and Tobago: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.tntResident ? 'Yes' : 'No'}</div>
                                    </div>
                                    <div className="flex-row">
                                        <div className="flex-cell sw-col-a"><label>National of another Country: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.otherNational ? 'Yes' : 'No'}</div>
                                        <div className="flex-cell sw-col-a"><label>Resident of another Country: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.otherResident ? 'Yes' : 'No'}</div>
                                    </div>
                                    </div>
                                        
                                    <div className="flex-row">
                                        <div className="flex-cell sw-col-a"><label>Previous Criminal Record: </label></div>
                                        <div className="flex-cell sw-col-b">{accused.previousCriminalRecord}</div>
                                    </div>
                                </div>
                            ))}

                        </div>
                        <br /><br />

                        <h5 className="card-title">Offences</h5><br />
                        <div className="text-left complainant-details">
                            <div className="offence-table">
                                <div className="flex-header pdf-head text-center">
                                    <div className="header-cell text-center first"  style={{width:"16%"}} >Accused<br/>First Name</div>
                                    <div className="header-cell  text-center"  style={{width:"16%"}} >Accused<br/>Last Name</div>
                                    <div className="header-cell  text-center"  style={{width:"15%"}} >ICCS<br/>Code</div>
                                    <div className="header-cell  text-center"  style={{width:"15%"}} >Date of<br/>Offence</div>
                                    <div className="header-cell  text-center last"  style={{width:"35%"}} >Particulars of Offence</div>
                                </div>

                                {/* {offences.map((offence) => (
        <div className="flex-row" key={offence.id}>
            <div className="row-cell">{offence.firstName}</div>
            <div className="row-cell">{offence.lastName}</div>
            <div className="row-cell">{offence.ICCS}</td>
            <div className="row-cell">{offence.dateOfOffence}</div>
            <div className="row-cell">{offence.particulars}</div>
        </div>
    ))} */}

                                {accuseds.map((accused: any) => (
                                    <Offences
                                        first_name={accused.firstName}
                                        last_name={accused.lastName}
                                        accused_id={accused.id}
                                        key={accused.id}
                                    />
                                ))}
                            </div>

                        </div>

                        <br /><br />
                        <div className="text-left complainant-details">
                            
                            {/* <p><strong>{' ' + currentDate()}</strong></p> */}
                            <br /><br /><br />

                            <SignIndictment
                                submission_id={parseInt('' + id)}
                                complainant_regnum={complainantRegNum}
                                complainant_email={complainantEmail}
                                complainant_name={complainantName}
                                already_signed={status == 'signed'}
                                already_verified={status == 'verified'}
                            />

                        </div>

                    </div>



                </div>



            </div>

        </div>
    )

}