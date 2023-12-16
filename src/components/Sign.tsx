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



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';


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
    const [court, setCourt] = useState('')
    const [district, setDistrict] = useState('')
    const [submissionType, setSubmissionType] = useState('')

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
            setCourt(submission.data.complainant.court)
            setDistrict(submission.data.complainant.courtDistrict)
            setAccuseds(submission.data.accuseds)
            switch(submission.data.submission.type) {
                case 'complaint_with_oath':
                  setSubmissionType('COMPLAINT ON OATH')
                  break;
                case 'complaint_without_oath':
                  setSubmissionType('COMPLAINT WITHOUT OATH')
                  break;
                default:
                  setSubmissionType('COMPLAINT ON OATH')
            }
            
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



    const printPDF = async (event:any, submissionId:number) => {
        event.preventDefault();
        try {
          const message = await exportPDF('container-pdf', `https://swif.ttlawcourts.org/api/pdf/puppeteer`, submissionId);
          alert(`Submission successful! ${message}`);
        } catch (error) {
            console.log(error)
            alert('Failed to submit the form. Please check your email for confirmation.');
        }
      };

    return (
        <div className="d-flex container-pdf">



            <div className="container submissions-container" style={{ borderRadius: "5px", maxWidth: "900px", padding: "20px 40px", margin: "30px 30px 30px 300px", flexGrow: 1 }}>

            {/* <button onClick={(e) => {
                if (id !== undefined) {
                    // Assuming 'id' is a string that needs to be converted to a number
                    const numericId = parseInt(id, 10);
                    if (!isNaN(numericId)) {
                        printPDF(e, numericId);
                    }
                }
            }}
            >Submit and Convert to PDF</button> */}

            

                {/* <div className="fade show">
                    <h4 className='mb-3'> Complaint With Oath ({title})</h4>
                </div> */}

<div className="px-2 py-2 d-flex align-items-center" style={{ backgroundColor: "#333", color: "#fff" }}>
                  <div className="row" style={{ maxWidth: "200px", margin: "0 auto", color: "#fff", textDecoration: "none" }} >
                    <a style={{ color: "#fff", textDecoration: "none" }} href="/submissions" className="m-0 btn-link new-submission-btn float-start">
                      <FontAwesomeIcon icon={faArrowLeftLong} />
                    </a>
                  </div>
                  <h5 className="fw-bold mx-3 mb-0 flex-grow-1"> {submissionType} </h5>

                </div>

                <div className="card fade show">
                    <div className="card-body">
                        <div  style={{textAlign:"left", fontWeight:"bold", fontSize:"11pt", lineHeight:"12pt"}}>
                            <div  style={{textAlign:"left", fontWeight:"bold", fontSize:"9pt"}}>REPUBLIC OF TRINIDAD AND TOBAGO</div>
                            <div  style={{textAlign:"left", fontWeight:"bold", fontSize:"13pt"}}>{submissionType}</div>
                            <div  style={{textAlign:"left", fontWeight:"bold", fontSize:"10pt"}}>IN THE {court.toUpperCase()} OF JUSTICE</div>
                            <div  style={{textAlign:"left", fontWeight:"bold", fontSize:"10pt"}}>CRIMINAL DIVISION {district.toUpperCase()}</div>
                            <div  style={{textAlign:"left", fontWeight:"bold", fontSize:"9pt", marginTop:"20px", marginBottom:"20px"}}>Matter Type: </div>
                        </div>
                        {/* <h5 className="card-title">Complainant: The State</h5><br /> <br /> */}

                        <div className="text-left complainant-details">
                            {accuseds.map((accused: any, i: number) => (
                                <table width={"700px"} className="accused-table" key={accused.id}  
                                style={{borderBottom:"1px solid #999", marginBottom:"10px"}}>
                                    <tbody>

                                        <tr>
                                            <td  colSpan={4}><label  style={{borderBottom:"2px solid #000"}}>Accused {i + 1}</label></td>
                                        </tr>
                                        <tr>
                                            <td style={{width:"200px"}}><label>Name of Accused: </label></td>
                                            <td colSpan={3}>{i + 1} {accused.firstName} {accused.lastName} <strong>-{accused.adulthood}</strong></td>
                                        </tr>
                                        <tr>
                                            <td><label>ID: </label></td>
                                            <td>{accused.identification}</td>
                                            <td><label>Gender Identity: </label></td>
                                            <td>{accused.gender}</td>
                                        </tr>
                                        <tr>
                                           
                                        </tr>
                                        <tr>
                                            <td><label>Date Of Birth: </label></td>
                                            <td>{accused.dateOfBirth}</td>
                                        </tr>
                                        <tr>
                                            <td><label>Address: </label></td>
                                            <td colSpan={3}>{accused.address}</td>
                                        </tr>
                                
                                        <tr>
                                            <td style={{width:"300px"}}><label>National of Trinidad and Tobago: </label></td>
                                            <td style={{width:"100px"}}>{accused.tntNational ? 'Yes' : 'No'}</td>
                                            <td style={{width:"300px"}}><label>Resident of Trinidad and Tobago: </label></td>
                                            <td>{accused.tntResident ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td><label>National of another Country: </label></td>
                                            <td>{accused.otherNational ? 'Yes' : 'No'}</td>
                                            <td style={{width:"250px"}}><label>Resident of another Country: </label></td>
                                            <td>{accused.otherResident ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td><label>Previous Criminal Record: </label></td>
                                            <td>{accused.previousCriminalRecord}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}

                        </div>

                        <h5 className="card-title"  style={{fontSize:"13pt", fontWeight:"bold", marginTop:"20px", textAlign:"center"}}>Offences</h5><br />
                        <div className="text-left complainant-details" style={{}}>
                            <table className="offence-table" width={"700px"}>
                                <thead>
                                    <tr>
                                        <th style={{width:"120px"}}>Accused</th>
                                        <th style={{width:"100px"}}>ICCS<br/>Code</th>
                                        <th style={{width:"100px"}}>Name of<br/>Offence</th>
                                        <th style={{width:"100px"}}>Date of<br/>Offence</th>
                                        <th style={{width:"260px"}}>Particulars of Offence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* { offences.map((offence) => (
                                        
                                            <tr key={offence.id}>
                                                <td>{offence.firstName}</td>
                                                <td>{offence.lastName}</td>
                                                <td>{offence.ICCS}</td>
                                                <td>{offence.dateOfOffence}</td>
                                                <td>{offence.particulars}</td>
                                            </tr>                                        
                                       
                                    ))} */}
                                    {accuseds.map((accused: any) => (
                                        <Offences
                                            first_name={accused.firstName}
                                            last_name={accused.lastName}
                                            accused_id={accused.id}
                                            key={accused.id}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <br /><br />
                        <div className="text-left complainant-details">

                            {submissionType == 'COMPLAINT WITHOUT OATH' ?
                                <></>
                                :
                                <p>I <strong>{complainantName}</strong> Police Constable No. <strong>{complainantRegNum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge
                                </p>
                            }

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