// Import Form and validator from RJSF form despite what documentation says or fails to say
import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import "../assets/Submission.css"
import "../assets/Sign.css"
// import "../assets/javascript/submission"
import { Step } from "./Step"
import { Complainant } from "./Complainant"
import { Charges } from "./Charges"
import AuthService from "../services/AuthService"
import { Navigate, useNavigate } from "react-router-dom"
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
    useParams,
  } from "react-router-dom"

type SignProps = {}


const log = (type: any) => console.log.bind(console, type)

export const Sign = ({}: SignProps) => {

    const { id } = useParams()

    const navigate = useNavigate()

    const auth = new AuthService

    

    const [submission, setSubmission] = useState({})
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
      
        if(auth.loggedIn()) {
            axios.get(API_URL + '/api/submissions/' + id)
            .then((response) => {
                // console.log('Fetched submission: ', response.data)
                setTitle(response.data.submission.description)
                setComplainantName(response.data.complainant.firstName + ' ' + response.data.complainant.lastName)
                setComplainantAgency(response.data.complainant.agency)
                setComplainantRegNum(response.data.complainant.regNum)
                setComplainantEmail(response.data.complainant.email)
                setAccuseds(response.data.accuseds)
                response.data.accuseds.map((accused: any) => {
                    // console.log('getting offences for accused')
                    let firstName = accused.firstName
                    let lastName = accused.lastName
                    axios.get(API_URL + '/api/accuseds/charges/' + accused.id)
                    .then((charges_response) => {
                        charges_response.data.charges.map((charge: any) => {
                            // console.log('Adding offence to array')
                            let offence = {
                                id: charge.id,
                                firstName: firstName,
                                lastName: lastName,
                                ICCS: charge.ICCS,
                                dateOfOffence: charge.dateOfOffence,
                                particulars: charge.particulars
                            }
                            setOffences([...offences, offence])
                        })

                    })
                })
            })
        } else {
            navigate("/")
        }
    }, []);

    return (
        <>

            <div className="container">

                <div id="regForm" className="fade show">
                    <h3 className='page-title'> Complaint With Oath ({title})</h3>
                </div>

                <div className="card fade show">
                    <div className="card-body">
                        <h5 className="card-title">Complainant: The State</h5><br/> <br/>

                        <div className="text-left complainant-details">
                            { accuseds.map((accused: any, i: number) => (
                                <table className="accused-table" key={accused.id}>
                                    <tbody>
                                        <tr>
                                            <td><label>Name of Accused: </label></td>
                                            <td>{i+1} {accused.firstName} {accused.lastName} <strong>-{accused.adulthood}</strong></td>
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
                                        <tr><td><br/></td></tr>
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

                        </div>
                        <br/><br/>
                        
                        <h5 className="card-title">Offences</h5><br/>
                        <div className="text-left complainant-details">
                            <table className="offence-table" >
                                <thead>
                                    <tr>
                                        <th>Accused First Name</th>
                                        <th>Accused Last Name</th>
                                        <th>ICCS Code</th>
                                        <th>Date Of Offence</th>
                                        <th>Particulars Of Offence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { offences.map((offence) => (
                                        
                                            <tr key={offence.id}>
                                                <td>{offence.firstName}</td>
                                                <td>{offence.lastName}</td>
                                                <td>{offence.ICCS}</td>
                                                <td>{offence.dateOfOffence}</td>
                                                <td>{offence.particulars}</td>
                                            </tr>                                        
                                       
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <br/><br/>
                        <div className="text-left complainant-details">
                            <p>I <strong>{complainantName}</strong> Police Constable No. <strong>{complainantRegNum}</strong>, hereby swear by affixing my signature to this declaration, that I make this complaint conscientiously having reasonable grounds for believing that  the named accused person has committed the offence alleged and stated in the complaint and that the particulars are true to the best of my knowledge
                            </p>
                            <p><strong>{' ' + currentDate() }</strong></p>
                            <br/><br/><br/><a className="btn btn-secondary float-end" onClick={signSubmission} >Sign</a>
                        </div>
                    
                    </div>



                </div>



            </div>
        
        </>
    )

}