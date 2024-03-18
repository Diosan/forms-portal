// Import Form and validator from RJSF form despite what documentation says or fails to say
import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import { useSelector } from "react-redux"

import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import "../assets/Submission.css"
import "../assets/Sign.css"
import "../assets/Signature.css"
import "../assets/Style.css"
// import "../assets/javascript/submission"
import { Step } from "./Step"
import { Complainant } from "./Complainant"
import { Charges } from "./Charges"
import { Offences } from "./Offences"
import { PrivateOffences } from "./PrivateOffences"
import { Pending } from "./Pending"
import { Convictions } from "./Convictions"
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
import { Signatures } from "./Signatures"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../store';



type SignProps = {}



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
    const generateDisplayText = (data:any, maxNames = 6) => {
        return data.slice(0, maxNames).map((person:any, index:number) => (
            // <div key={index}>{person.firstName} {person.lastName}</div>
            <div style={{fontSize:"12pt", lineHeight:"18pt"}}  key={index}>
                {person.firstName} {person.lastName}{index < data.length - 1 && index < maxNames - 1 ? ' ' : ''}
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




const log = (type: any) => console.log.bind(console, type)

export const PrivateView = ({ }: SignProps) => {

    const { id } = useParams()

    const navigate = useNavigate()

    const auth = new AuthService

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
    const [complainantPhone, setComplainantPhone] = useState('')
    const [complainantStation, setComplainantStation] = useState('')
    const [summaryOfEvidence, setSummaryOfEvidence] = useState('')

    const [additionalNotes, setAdditionalNotes] = useState('')
    const [matterType, setMatterType] = useState('')
    const [accusedNames, setAccusedNames] = useState('')
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
        console.log('View form ')
    }

    const currentDate = () => {
        let today = new Date()
        return today.toISOString().split('T')[0]
    }

    useEffect(() => {

        const fetchSubmission = async () => {
            let submission = await axios.get(API_URL + '/api/submissions/' + id,
            { method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
             })
            console.log('\n\n\n Submision Status: ', submission.data)
            setStatus(submission.data.submission.status)
            setTitle(submission.data.submission.description)
            setComplainantName(submission.data.complainant.firstName + ' ' + submission.data.complainant.lastName)
            setComplainantFirstName(submission.data.complainant.firstName)
            setComplainantLastName(submission.data.complainant.lastName)
            setComplainantAgency(submission.data.complainant.agency)
            setComplainantRegNum(submission.data.complainant.regNum)
            setComplainantEmail(submission.data.complainant.email)
            setComplainantPhone(submission.data.complainant.phone)
            setCourt(submission.data.complainant.court)
            setDistrict(submission.data.complainant.courtDistrict)
            setAccuseds(submission.data.accuseds)
            setMatterType(submission.data.submission.matterType)
            setComplainantRank(submission.data.complainant.rank)
            setComplainantStation(submission.data.complainant.unit)
            setSummaryOfEvidence(submission?.data?.submission?.summaryOfEvidence || "")
            setAdditionalNotes(submission?.data?.submission?.additionalNotes || "")



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
            case 'private_adult':
                    setSubmissionType('PRIVATE COMPLAINT')
                    break;
            case 'private_institution':
                setSubmissionType('PRIVATE COMPLAINT')
                break;
            case 'private_child':
                setSubmissionType('PRIVATE COMPLAINT')
                break;
            default:
                setSubmissionType('COMPLAINT ON OATH')
            }
        }


        // const fetchCharges = async (accused: any) => {
        //     let firstName = accused.firstName
        //     let lastName = accused.lastName

        //     let charges = await axios.get(API_URL + '/api/accuseds/charges/' + accused.id)

        //     charges.data.charges.map((charge: any, i: number) => {

        //         let offence = {
        //             id: charge.id,
        //             firstName: firstName,
        //             lastName: lastName,
        //             ICCS: charge.ICCS,
        //             dateOfOffence: charge.dateOfOffence,
        //             particulars: charge.particulars
        //         }
        //         console.log('Adding charge ' + i + ' to offences ', offence)
        //         setOffences([...offences, offence])
        //     })

        // }


        if (auth.loggedIn()) {

            console.log('\n\n\n You are logged in \n\n\n')
            fetchSubmission()


        } else {

            console.log('\n\n\n You are NOT logged in \n\n\n')
            navigate("/")
        }

    }, [])

    return (
        <div className="d-flex container-pdf">



            <div className="container submissions-container" style={{ borderRadius: "5px", maxWidth: "900px", padding: "20px 40px", margin: "30px 30px 30px 300px", flexGrow: 1 }}>
            
            { submissionType != 'COMPLAINT ON OATH WITH CONSENT' ?
                <h6 className='mb-4' style={{color:"blue"}}>An email with instructions to sign this submission <br/>
                has been sent to the complainant's email address.</h6>
                :
                <h6 className='mb-4' style={{color:"blue"}}>Your request for consent on this submission <br/>
                has been sent.</h6>
            }

            


                {/* <div className="fade show">
                    <h4 className='mb-3'> Complaint With Oath ({title})</h4>
                </div> */}

                <div className="px-2 py-2 d-flex align-items-center swf-content" style={{ backgroundColor: "#333", color: "#fff" }}>
                    <div className="row" style={{ maxWidth: "200px", margin: "0 auto", color: "#fff", textDecoration: "none" }} >
                        <a style={{ color: "#fff", textDecoration: "none" }} href="/submissions" className="m-0 btn-link new-submission-btn float-start">
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                        </a>
                    </div>
                    <h5 className="fw-bold mx-3 mb-0 flex-grow-1"> {submissionType} </h5>

                </div>




                <div className="swf-content card fade show" style={{borderRadius:"0"}}>
                    <div className="card-body">
                        <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "11pt", lineHeight: "12pt" }}>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "9pt" }}>REPUBLIC OF TRINIDAD AND TOBAGO</div>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "13pt" }}>{submissionType}</div>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "10pt" }}>IN THE {court.toUpperCase()} OF JUSTICE</div>
                            <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "10pt" }}>CRIMINAL DIVISION {"("} {district.toUpperCase()} {")"} </div>
                            {/* <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "9pt", marginTop: "20px", marginBottom: "20px" }}>Matter Type: {matterType}</div> */}
                        </div>


                        <table width={"700px"}
                            style={{ marginBottom: "10px", textAlign: "center" }}>
                            <tbody>

                                <tr>
                                    <td><div style={{ fontSize: "10pt", fontWeight: "bold", lineHeight: "13pt", margin: "0 0 0" }}>The State<br />V</div></td>
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

                                    {/* <td style={{}}><label>Complainant Rank: </label>
                                        <div style={{ marginBottom: "10px" }}>{complainantRank}</div>
                                    </td> */}
                                </tr>
                                <tr>
                                    {/* <td style={{}}><label>Complainant Regimental #</label>
                                        <div style={{ marginBottom: "10px" }}>{complainantRegNum}</div></td> */}

                                    <td style={{}}><label>Complainant Email Address: </label>
                                        <div style={{ marginBottom: "10px" }}>{complainantEmail}</div>
                                    </td>

                                    <td style={{}}><label>Complainant Phone: </label>
                                        <div style={{ marginBottom: "10px" }}>{complainantPhone}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="text-left complainant-details">
                            {accuseds.map((accused: any, i: number) => (
                                <div key={i}>
                                    <div style={{ fontWeight: "bold", padding: "3px 5px", fontSize: "10pt", marginBottom: "10px", backgroundColor: "#eee", width: "700px", textAlign: "left" }}>Accused Number {i + 1}  Information</div>


                                    <table width={"700px"} className="accused-table" key={accused.id}
                                        style={{ marginBottom: "10px" }}>
                                        <tbody style={{ fontSize: "10pt", }}>
                                            <tr>
                                                <td style={{ width: "160px" }}><label>Name of Accused: </label></td>
                                                <td colSpan={3}>{i + 1} {accused.firstName}{accused.middleName == null ? '' : ' ' + accused.middleName} {accused.lastName} <strong>- {accused.adulthood}.</strong></td>
                                            </tr>
                                            {accused.alias == null ? 
                                                <></>
                                                :
                                                <tr>
                                                    <td style={{ width: "160px" }}><label>Alias: </label></td>
                                                    <td colSpan={3}>{i + 1} {accused.alias}</td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>


                                    <table width={"700px"} className="accused-table" key={accused.id}
                                        style={{ marginBottom: "10px" }}>
                                        <tbody style={{ fontSize: "9.5pt", }}>
                                            { accused.identification == null ? <></> :
                                                <tr>
                                                    <td><label>ID: </label></td>
                                                    <td>{accused.identification}</td>
                                                    <td><label>ID Type: </label></td>
                                                    <td>{accused.identificationType}</td>
                                                </tr>                                                
                                            }

                                            <tr>

                                            </tr>

                                            <tr>
                                                { accused.dateOfBirth == null ? <></> :
                                                    <>
                                                        <td><label>Date Of Birth: </label></td>
                                                        <td>{accused.dateOfBirth}</td>                                                    
                                                    </>
                                                }
                                                { accused.aproximateAge == null ? <></> :
                                                    <>
                                                        <td><label>Aproximate Age: </label></td>
                                                        <td>{accused.aproximateAge}</td>                                                    
                                                    </>
                                                }
                                            </tr>
                                            <tr>
                                                { accused.gender == null ? <></> :
                                                    <>
                                                        <td><label>Gender Identity: </label></td>
                                                        <td>{accused.gender}</td>                                                    
                                                    </>
                                                }  
                                                { accused.email == null ? <></> :
                                                    <>
                                                        <td><label>Email: </label></td>
                                                        <td>{accused.email}</td>                                                    
                                                    </>
                                                }                                               
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

                                            {/* <tr>
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
                                            </tr> */}
                                            {/* <tr>
                                                <td><label>Previous Criminal Record: </label></td>
                                                <td>{accused.previousCriminalRecord}</td>
                                            </tr> */}
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
                                        <div key={i}>
                                            <PrivateOffences
                                                first_name={accused.firstName}
                                                last_name={accused.lastName}
                                                accused_id={accused.id}
                                                key={i}
                                            />


                                           
                                        </div>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        {/* <div style={{ fontWeight: "bold", padding: "3px 5px", fontSize: "10pt", marginBottom: "10px", backgroundColor: "#eee", width: "700px", textAlign: "left" }}>
                            Summary of Evidence
                        </div>
                        <div className="text-left mb-3">
                            {summaryOfEvidence}
                        </div> */}

                        <div className="mt-2" style={{ fontWeight: "bold", padding: "3px 5px", fontSize: "10pt", marginBottom: "10px", backgroundColor: "#eee", width: "700px", textAlign: "left" }}>
                            Additional Notes
                        </div>
                        <div className="text-left mb-3">
                            {additionalNotes}
                        </div>
                        




                        
                       




                        {/* <div className="text-left complainant-details">
                            {accuseds.map((accused: any, i: number) => (
                                <table className="accused-table" key={accused.id}>
                                    <tbody>
                                        <tr>
                                            <td><label>Name of Accused: </label></td>
                                            <td>{i + 1} {accused.firstName} {accused.lastName} <strong>-{accused.adulthood}</strong></td>
                                        </tr>
                                        <tr>
                                            <td><label>ID: </label></td>
                                            <td>{accused.identification}</td>
                                        </tr>
                                        <tr>
                                            <td><label>Gender Identity: </label></td>
                                            <td>{accused.gender}</td>
                                        </tr>
                                        <tr>
                                            <td><label>Date Of Birth: </label></td>
                                            <td>{accused.dateOfBirth}</td>
                                        </tr>
                                        <tr>
                                            <td><label>Address: </label></td>
                                            <td>{accused.address}</td>
                                        </tr>
                                        <tr><td><br /></td></tr>
                                        <tr><td></td></tr>
                                        <tr>
                                            <td><label>National of Trinidad and Tobago: </label></td>
                                            <td>{accused.tntNational ? 'Yes' : 'No'}</td>
                                            <td><label>Resident of Trinidad and Tobago: </label></td>
                                            <td>{accused.tntResident ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td><label>National of another Country: </label></td>
                                            <td>{accused.otherNational ? 'Yes' : 'No'}</td>
                                            <td><label>Resident of another Country: </label></td>
                                            <td>{accused.otherResident ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td><label>Previous Criminal Record: </label></td>
                                            <td>{accused.previousCriminalRecord}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}

                        </div> */}
                       

                    </div>



                </div>



            </div>

        </div>
    )

}