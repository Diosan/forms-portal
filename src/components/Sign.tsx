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
// import "../assets/Bail.css"
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
            <div style={{ fontSize: "12pt", lineHeight: "18pt" }} key={index}>
                {person.firstName} {person.lastName}{index < data.length - 1 && index < maxNames - 1 ? ', ' : ''}
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


export const Sign = ({ }: SignProps) => {

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

                if(submission.data.outcome == "error"){
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
            setAccuseds(submission.data.accuseds)

            console.log(submission.data.accuseds.length)

            const formattedNames = submission.data.accuseds.map((item: any, index: any) => formatName(item));




            // if (submission.data.accuseds.length === 0) {
            //     return ''; // Return an empty string if the array is empty.
            // }

            // if (submission.data.accuseds.length <= 2) {
            //     // If there are 3 or fewer array members, concatenate their names with commas.
            //     if (submission.data.accuseds.length == 2) {
            //         const names = submission.data.accuseds.map((item: any) => `${item.firstName} ${item.lastName}`);
            //         setAccusedNames(names.join('and '))
            //     } else {
            //         const names = submission.data.accuseds.map((item: any) => `${item.firstName} ${item.lastName}`);
            //         setAccusedNames(names.join(' '))
            //     }
            //     // return names.join(', ');
            // } else {
            //     // If there are more than 3 array members, concatenate the names of the first 3 with commas,
            //     // then add "and other" for the remaining members.
            //     const namesOfFirstThree = submission.data.accuseds.slice(0, 3).map((item: any) => `${item.firstName} ${item.lastName}`);
            //     const remainingCount = submission.data.accuseds.length - 3;
            //     setAccusedNames(`${namesOfFirstThree.join(', ')} and ${remainingCount} other${remainingCount > 1 ? 's' : ''}`)
            //     // return `${namesOfFirstThree.join(', ')} and ${remainingCount} other${remainingCount > 1 ? 's' : ''}`;
            // }



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
                case 'complaint_with_consent':
                    setSubmissionType('COMPLAINT ON OATH WITH CONSENT')
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
                        <h5 className='mb-1' style={{color:"blue"}}><strong>Please review this submission carefully. </strong></h5>
                        <h6 className='mb-4' style={{color:"blue", lineHeight:"1.4rem"}}>After ensuring accuracy, select the necessary box(es) at the end<br/>
                        and click '<strong>Request Signing Code</strong>' to continue.</h6>
                    </>
                ) : status === "final" ? (
                    <h5 className='mb-3' style={{color:"blue"}}><strong>Signed Submission</strong></h5>
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
                        <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "11pt", lineHeight: "12pt" }}>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "9pt" }}>REPUBLIC OF TRINIDAD AND TOBAGO</div>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "13pt" }}>{submissionType}</div>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "10pt" }}>IN THE {court.toUpperCase()} OF JUSTICE</div>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "10pt" }}>CRIMINAL DIVISION {"("} {district.toUpperCase()} {")"} </div>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "9pt", marginTop: "20px", marginBottom: "20px" }}>Matter Type: {matterType}</div>
                        </div>

                        <table width={"700px"}
                            style={{ marginBottom: "10px", textAlign: "center" }}>
                            <tbody>

                                <tr>
                                    <td><div style={{ fontSize: "12pt", fontWeight: "bold", lineHeight: "13pt", margin: "0 0 0" }}>The State<br />V</div></td>
                                </tr>

                                <tr style={{ textAlign: "center" }}>
                                    <td><div style={{ fontSize: "10pt", fontWeight: "bold", lineHeight: "13pt", margin: "0 0 10px" }}>

                                        {/* {accusedNames} */}
                                        <NameDisplay data={accuseds} />

                                    </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div style={{ fontWeight: "bold", padding: "3px 5px", fontSize: "10pt", marginBottom: "10px", backgroundColor: "#eee", width: "700px", textAlign: "left" }}>Complainant Information</div>

                        <table width={"700px"}
                            style={{ marginBottom: "10px", textAlign: "left", fontSize: "9pt" }}>
                            <tbody>
                                <tr>
                                    <td style={{}}><label>Complainant First Name: </label>
                                        <div style={{ marginBottom: "10px" }}>{complainantFirstName}</div>
                                    </td>


                                    <td style={{}}><label>Complainant Last Name: </label>
                                        <div style={{ marginBottom: "10px" }}>{complainantLastName}</div>
                                    </td>

                                    <td style={{}}><label>Complainant Rank: </label>
                                        <div style={{ marginBottom: "10px" }}>{complainantRank}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{}}><label>Complainant Regimental #</label>
                                        <div style={{ marginBottom: "10px" }}>{complainantRegNum}</div></td>

                                    <td style={{}}><label>Complainant Email Address: </label>
                                        <div style={{ marginBottom: "10px" }}>{complainantEmail}</div>
                                    </td>

                                    <td style={{}}><label>Complainant Station: </label>
                                        <div style={{ marginBottom: "10px" }}>{complainantStation}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* <h5 className="card-title">Complainant: The State</h5><br /> <br /> */}

                        <div className="text-left complainant-details">
                            {accuseds.map((accused: any, i: number) => (
                                <div key={accused.id}>
                                    <div style={{ fontWeight: "bold", padding: "3px 5px", fontSize: "10pt", marginBottom: "10px", backgroundColor: "#eee", width: "700px", textAlign: "left" }}>Accused Number {i + 1}  Information</div>


                                    <table width={"700px"} className="accused-table" 
                                        style={{ marginBottom: "10px" }}>
                                        <tbody style={{ fontSize: "10pt", }}>
                                            <tr>
                                                <td style={{ width: "160px" }}><label>Name of Accused: </label></td>
                                                <td colSpan={3}>{i + 1} {accused.firstName} {accused.lastName} <strong>- {accused.adulthood}.</strong></td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: "160px" }}><label>Alias: </label></td>
                                                <td colSpan={3}>{i + 1} {accused.alias}</td>
                                            </tr>
                                        </tbody>
                                    </table>


                                    <table width={"700px"} className="accused-table"
                                        style={{ marginBottom: "10px" }}>
                                        <tbody style={{ fontSize: "9.5pt", }}>
                                            <tr>
                                                <td><label>ID: </label></td>
                                                <td>{accused.identification}</td>
                                                <td><label>ID Type: </label></td>
                                                <td>{accused.identificationType}</td>
                                            </tr>
                                            <tr>

                                            </tr>
                                            <tr>
                                                <td><label>Date Of Birth: </label></td>
                                                <td>{accused.dateOfBirth}</td>
                                                <td><label>Gender Identity: </label></td>
                                                <td>{accused.gender}</td>
                                            </tr>
                                            <tr>
                                                <td><label>Address: </label></td>
                                                <td colSpan={3}>{accused.addressLine1}
                                                    {accused.addressLine2 == null ? <></> : <>{', ' + accused.addressLine2}</>}
                                                    {accused.addressLine3 == null ? <></> : <>{', ' + accused.addressLine3}</>}
                                                    {accused.cityTown == null ? <></> : <>{', ' + accused.cityTown}</>}
                                                    {accused.postalCode == null ? <></> : <>{', ' + accused.postalCode}</>}
                                                    {accused.communityCode == null ? <></> : <>{', ' + accused.communityCode}</>}
                                                    {accused.countryName == null ? <></> : <>{', ' + accused.countryName}</>}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style={{ width: "280px" }}><label>National of Trinidad and Tobago: </label></td>
                                                <td style={{ width: "160px" }}>{accused.tntNational ? 'Yes' : 'No'}</td>
                                                <td style={{ width: "300px" }}><label>Resident of Trinidad and Tobago: </label></td>
                                                <td style={{ width: "160px" }}>{accused.tntResident ? 'Yes' : 'No'}</td>
                                            </tr>
                                            <tr>
                                                <td><label>National of another Country: </label></td>
                                                <td>{accused.otherNational ? 'Yes' : 'No'}</td>
                                                <td style={{ width: "250px" }}><label>Resident of another Country: </label></td>
                                                <td>{accused.otherResident ? 'Yes' : 'No'}</td>
                                            </tr>
                                            <tr>
                                                <td><label>Previous Criminal Record: </label></td>
                                                <td>{accused.previousCriminalRecord}</td>
                                                <td style={accused.bailStatus == 'Bail granted by Justice of Peace' ? {color: '#800000', fontWeight: 'bold'} : { }} ><label  >Bail Status: </label></td>
                                                <td style={accused.bailStatus == 'Bail granted by Justice of Peace' ? {color: '#800000',  fontWeight: 'bold'} : { }} >{accused.bailStatus}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))}

                        </div>

                        <div style={{ fontWeight: "bold", padding: "3px 5px", fontSize: "10pt", marginBottom: "10px", backgroundColor: "#eee", width: "700px", textAlign: "left" }}>Offences</div>






                        <div className="text-left complainant-details" style={{}}>
                            <table className="" width={"700px"}>
                                {/* <thead>
                                    <tr>
                                        <th style={{ width: "120px" }}>Accused</th>
                                        <th style={{ width: "100px" }}>ICCS<br />Code</th>
                                        <th style={{ width: "100px" }}>Name of<br />Offence</th>
                                        <th style={{ width: "100px" }}>Date of<br />Offence</th>
                                        <th style={{ width: "260px" }}>Particulars of Offence</th>
                                    </tr>
                                </thead> */}
                                <tbody>

                                    {accuseds.map((accused: any, i: number) => (
                                        <Offences
                                            first_name={accused.firstName}
                                            last_name={accused.lastName}
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
                            width: "750px",
                            maxWidth: "750px",
                            padding: "10px 50px 10px 20px"
                        }}>



                        {/* <p><strong>{' ' + currentDate()}</strong></p> */}

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