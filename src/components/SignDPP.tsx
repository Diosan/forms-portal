// Import Form and validator from RJSF form despite what documentation says or fails to say
import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
const API_URL = import.meta.env.VITE_API_URL
import { RootState } from '../store';

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
import { IndictmentOffences } from "./IndictmentOffences"
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

function formatName(data: { firstName: any; lastName: any }) {
    return `${data.firstName} ${data.lastName}`;
}


// Define a type for the individual person object
type Person = {
    firstName: string;
    lastName: string;
    // Add other fields from your JSON data as needed
};

// Define a type for the props of the NameDisplay component
type NameDisplayProps = {
    data: Person[];
};




function NameDisplay({ data }: NameDisplayProps) {
    // Function to generate formatted names
    const generateDisplayText = (data: any, maxNames = 6) => {
        return data.slice(0, maxNames).map((person: any, index: number) => (
            // <div key={index}>{person.firstName} {person.lastName}</div>
            <div style={{ fontSize: "10pt", lineHeight: "18pt" }} key={index}>
                <table>
                    <tr>
                        <td>
                            <span>{person.firstName} </span><br /><span className="fw-normal" style={{ fontSize: "9pt" }}>Accused First Name</span>
                        </td>
                        <td className="mx-2" style={{ paddingLeft: "25px" }}>
                            <span>{person.lastName} </span><br /><span className="fw-normal" style={{ fontSize: "9pt" }}>Accused Last Name</span>
                        </td>
                    </tr>
                    {person.alias && (
                        <tr>
                            <td>
                                <span>otherwise called</span>
                            </td>
                            <td>
                                <span>{person.alias} </span>
                            </td>
                        </tr>
                    )}
                </table>
                {/* {person.firstName} {person.lastName}{index < data.length - 1 && index < maxNames - 1 ? ', ' : ''} */}
            </div>
        ));
    };

    return (
        <div>
            {generateDisplayText(data)}
            {data.length > 6 && <div>and others</div>}
        </div>
    );
}


export const SignDPP = ({ }: SignProps) => {

    const { id } = useParams()

    const navigate = useNavigate()

    const auth = new AuthService

    const maxNamesPerLine = 6;
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state

    const [status, setStatus] = useState('')
    const [complainantName, setComplainantName] = useState('')
    const [complainantFirstName, setComplainantFirstName] = useState('')
    const [complainantLastName, setComplainantLastName] = useState('')
    const [complainantAgency, setComplainantAgency] = useState('')
    const [complainantRegNum, setComplainantRegNum] = useState('')
    const [complainantRank, setComplainantRank] = useState('')
    const [complainantEmail, setComplainantEmail] = useState('')
    const [complainantStation, setComplainantStation] = useState('')
    const [alias, setAccusedAlias] = useState('')
    const [matterType, setMatterType] = useState('')
    const [title, setTitle] = useState('')
    const [accuseds, setAccuseds] = useState([])
    const [accusedNames, setAccusedNames] = useState('')
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
    const [relatedMatters, setRelatedMatters] = useState(false)
    const [previousCases, setPreviousCases] = useState('')

    const signSubmission = () => {
        console.log('Signing form ')
    }

    const currentDate = () => {
        let today = new Date()
        return today.toISOString().split('T')[0]
    }

    useEffect(() => {

        const fetchSubmission = async () => {
            await axios.get(API_URL + '/api/submissions/' + id,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                }).then(submission => {

                    if (submission.data.outcome == "error") {
                        navigate("/submissions")
                    }
                    console.log("Submission")
                    console.log(submission.data.outcome)


                    console.log(submission.data.submission.status)
                    setStatus(submission.data.submission.status)
                    setTitle(submission.data.submission.description)
                    setComplainantName(submission.data.complainant.firstName + ' ' + submission.data.complainant.lastName)
                    setComplainantFirstName(submission.data.complainant.firstName)
                    setComplainantLastName(submission.data.complainant.lastName)
                    setComplainantAgency(submission.data.complainant.agency)
                    setComplainantRegNum(submission.data.complainant.regNum)
                    setComplainantEmail(submission.data.complainant.email)
                    setComplainantRank(submission.data.complainant.rank)
                    setComplainantStation(submission.data.complainant.unit)
                    setCourt(submission.data.complainant.court)
                    setMatterType(submission.data.submission.matterType)
                    setDistrict(submission.data.complainant.courtDistrict)
                    setAccusedAlias(submission?.data?.accuseds || "")
                    setAccuseds(submission.data.accuseds)

                    console.log(submission.data.accuseds)

                    const formattedNames = submission.data.accuseds.map((item: any, index: any) => formatName(item));






                    // Your provided array of accused
                    const accusedArray = submission.data.accuseds;
                    // Extract the first and last names of up to 3 accused individuals
                    let accusedNames = accusedArray.slice(0, 3).map((accused: { firstName: any; lastName: any }) => `${accused.firstName} ${accused.lastName}`).join(', ');

                    // Add "and" before the last accused if there are more than one accused
                    if (accusedArray.length > 1) {
                        const lastIndex = accusedArray.length - 1;
                        accusedNames = `${accusedNames.slice(0, accusedNames.lastIndexOf(','))}, and ${accusedNames.slice(accusedNames.lastIndexOf(',') + 2)}`;
                    }
                    setAccusedNames(accusedNames)

                    console.log('Setting submission type')

                    switch (submission.data.submission.type) {
                        case 'complaint_with_oath':
                            setSubmissionType('COMPLAINT ON OATH')
                            break;
                        case 'complaint_without_oath':
                            setSubmissionType('COMPLAINT WITHOUT OATH')
                            break;
                        case 'complaint_without_oath_summons':
                            setSubmissionType('COMPLAINT WITHOUT OATH REQUESTING SUMMONS')
                            break;
                        case 'complaint_with_oath_warrant':
                            setSubmissionType('COMPLAINT ON OATH REQUESTING WARRANT')
                            break;
                        case 'indictment':
                            setSubmissionType('INDICTMENT')
                            break;
                        case 'indictment_preliminary_completed':
                                setSubmissionType('INDICTMENT PRELIMINARY INQUIRY COMPLETE')
                                break;
                        default:
                            setSubmissionType('COMPLAINT ON OATH')
                    }

                }).catch(err => {
                    console.group(err)
                    navigate("/submissions")
                })


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

        const fetchPrevious = async () => {
            await axios.get(API_URL + '/api/submissions/previous/' + id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            }).then(previous => {
                setRelatedMatters(true)
                setPreviousCases(previous.data.cases)
                console.log('\n\n\n --------- PREVIOUS --------- \n\n')
                console.log(previous)
                console.log('\n\n --------- END PREVIOUS --------- \n\n\n')
            })
        }

        if (auth.loggedIn()) {

            console.log('\n\n\n You are logged in \n\n\n')
            fetchSubmission()
            fetchPrevious()

        } else {

            console.log('\n\n\n You are NOT logged in \n\n\n')
            navigate("/")
        }

    }, [])



    const printPDF = async (event: any, submissionId: number) => {
        event.preventDefault();
        try {
            const message = await exportPDF('container-pdf', `${API_URL}/api/pdf/puppeteer`, submissionId);
            alert(`Submission successful!`);
        } catch (error) {
            // console.log(error)
            alert('SUbmission failed. Please try again.');
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
                >Test</button> */}



                {/* <div className="fade show">
                    <h4 className='mb-3'> Complaint With Oath ({title})</h4>
                </div> */}
                {status === "charge_saved" ? (
                    <>
                        <h5 className='mb-1' style={{ color: "blue" }}><strong>Please review this submission carefully. </strong></h5>
                        <h6 className='mb-4' style={{ color: "blue", lineHeight: "1.4rem" }}>After ensuring accuracy, select the necessary box(es) at the end<br />
                            and click '<strong>Request Signing Code</strong>' to continue.</h6>
                    </>
                ) : status === "final" ? (
                    <h5 className='mb-3' style={{ color: "blue" }}><strong>Signed Submission</strong></h5>
                ) : null
                }


                <div className="px-2 py-2 d-flex align-items-center" style={{ backgroundColor: "#333", color: "#fff" }}>
                    <div className="row" style={{ maxWidth: "200px", margin: "0 auto", color: "#fff", textDecoration: "none" }} >
                        <a style={{ color: "#fff", textDecoration: "none" }} href="/submissions" className="m-0 btn-link new-submission-btn float-start">
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                        </a>
                    </div>
                    <h5 className="fw-bold mx-3 mb-0 flex-grow-1"> {submissionType} </h5>

                </div>

                <div className="card fade show">
                    <div id="container-pdf" className="card-body">


                        <table width={"700px"}
                            style={{ marginBottom: "10px", textAlign: "left" }}>
                            <tbody>

                                <tr>
                                    <td><div style={{ fontSize: "12pt", fontWeight: "bold", lineHeight: "13pt", margin: "0 0 0" }}>The State V</div></td>
                                    <td><div style={{ fontSize: "12pt", fontWeight: "bold", lineHeight: "13pt", margin: "0 0 0" }}><NameDisplay data={accuseds} /></div></td>

                                </tr>


                            </tbody>
                        </table>

                        <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "11pt", lineHeight: "12pt", borderBottom: "1px solid #666", marginBottom:"15px"  }}>
                            {/* <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "9pt" }}>REPUBLIC OF TRINIDAD AND TOBAGO</div> */}
                            {/* <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "13pt" }}>{submissionType}</div> */}
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "10pt" }}>IN THE {court.toUpperCase()} OF JUSTICE</div>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "10pt" }}>CRIMINAL DIVISION {"("} {district.toUpperCase()} {")"} </div>
                            {/* <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "9pt", marginTop: "20px", marginBottom: "20px" }}>Matter Type: {matterType}</div> */}
                            <p> INDICTMENT BY THE DIRECTOR OF PUBLIC PROSECUTIONS {submissionType == 'INDICTMENT PRELIMINARY INQUIRY COMPLETE' ? '(PRELIMINARY INQUIRY COMPLETED)' : ''} </p>

                        </div>

                        { !relatedMatters ? <></>
                            :
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "11pt", lineHeight: "12pt", marginBottom:"15px", paddingBottom:"5px" }}>
                                Originating Case No(s): {previousCases}
                            </div>
                        }











                        

                        {/* <div style={{ fontWeight: "bold", padding: "3px 5px", fontSize: "10pt", marginBottom: "10px", backgroundColor: "#eee", width: "700px", textAlign: "left" }}>Offences</div> */}


                        <div className="text-left complainant-details" style={{}}>
                            <table className="" width={"650px"}>
                                <tbody>

                                    {accuseds.map((accused: any, i: number) => (
                                        <IndictmentOffences
                                            first_name={accused.firstName}
                                            last_name={accused.lastName}
                                            alias={accused.alias || ""}
                                            accused_id={accused.id}
                                            key={i}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>








                    </div>

                    {/* SIGNING BOX */}
                    <div className="text-left complainant-details"
                        style={{
                            width: "720px",
                            maxWidth: "750px",
                            padding: "10px 50px 10px 20px"
                        }}>

                        <div id="anchorSign"></div>
                        <SignIndictment
                            submission_id={parseInt('' + id)}
                            complainant_regnum={complainantRegNum}
                            complainant_rank={complainantRank}
                            complainant_email={complainantEmail}
                            complainant_name={complainantName}
                            already_signed={status == "signed"}
                            submissionType={submissionType}
                            already_verified={status == 'verified'}
                        />

                    </div>
                    {/* end of signing box */}



                </div>



            </div>

        </div>
    )

}