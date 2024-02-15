import { useEffect, useState } from "react"
import "../assets/Submission.css"
import "../assets/Style.css"
import { Charges } from "./Charges"
import { RequestSignature } from "./RequestSignature"
import AuthService from "../services/AuthService"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux";
import { RootState } from "../store"
import axios from "axios";
import dotenv from "dotenv"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faQuestionCircle, faPencilAlt, faCheck, faAngleDoubleRight, faAngleDoubleLeft, faExpand, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip'

type SetComplainantProps = {
    submission_id: number,
    adult_only: string,
    complainant_added: any,
    complainant_saved: boolean,
    saved_complainant: any
}

export const SetComplainant = ({submission_id, adult_only, complainant_added, complainant_saved, saved_complainant}: SetComplainantProps) => {

    const API_URL = import.meta.env.VITE_API_URL

    const auth = new AuthService

    const authenticate = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = authenticate

    const [complainantAgency, setComplainantAgency] = useState('')
    const [complainantFirstName, setComplainantFirstName] = useState('')
    const [complainantLastName, setComplainantLastName] = useState('')
    const [complainantEmail, setComplainantEmail] = useState('')
    const [complainantRegNum, setComplainantRegNum] = useState('')
    const [complainantRank, setComplainantRank] = useState('')
    const [complainantUnit, setComplainantUnit] = useState('')
    const [complainantCourtDistrict, setComplainantCourtDistrict] = useState('')
    const [complainantCourt, setComplainantCourt] = useState('High Court')


    
    const complainantCourtDistrictChange = (event: any) => {
    setComplainantCourtDistrict(event.target.value)
    }
    
    //   // const complainantCourtChange = (event: any) => {
    //   //   setComplainantCourt(event.target.value)
    //   // }
    

    
    const complainantAgencyChange = (event: any) => {
    setComplainantAgency(event.target.value)
    }

    const complainantRegNumberChange = (event: any) => {
    setComplainantRegNum(event.target.value)
    }

    const complainantRankChange = (event: any) => {
    setComplainantRank(event.target.value)
    }

    const complainantUnitChange = (event: any) => {
    setComplainantUnit(event.target.value)
    }

    const complainantFirstNameChange = (event: any) => {
    setComplainantFirstName(event.target.value)
    }

    const complainantLastNameChange = (event: any) => {
    setComplainantLastName(event.target.value)
    }

    const complainantEmailChange = (event: any) => {
    setComplainantEmail(event.target.value)
    }

    useEffect(() => {
        
        (async () => {
            
            let decoded = await auth.decodedToken()
            console.log('\n\n\n Decoded token: ', decoded)
            if(complainant_saved) {
                console.log('\n\n\n Setting saved complainant details: ', saved_complainant)
                setComplainantFirstName(saved_complainant.complainantFirstName)
                setComplainantLastName(saved_complainant.complainantLastName)
                setComplainantAgency(saved_complainant.complainantAgency)
                setComplainantCourtDistrict(saved_complainant.complainantCourtDistrict)
                setComplainantRegNum(saved_complainant.complainantRegNum)
                setComplainantRank(saved_complainant.complainantRank)
                setComplainantUnit(saved_complainant.complainantUnit)
                setComplainantEmail(saved_complainant.complainantEmail)
            } else {
                console.log('\n\n\n Setting users default agency: ', decoded.agency.toUpperCase())
                setComplainantAgency(decoded.agency.toUpperCase())
            }
        })()

    }, [])



    const saveComplainant = async (event: any) => {
        event.preventDefault()

        let complainant = {
          agency: complainantAgency,
          court: complainantCourt,
          courtDistrict: complainantCourtDistrict,
          firstName: complainantFirstName,
          lastName: complainantLastName,
          email: complainantEmail,
          regNum: complainantRegNum,
          rank: complainantRank,
          unit: complainantUnit,
          submissionId: submission_id
        }

        console.log('Complainant being sent to server: ', complainant);

        if (!complainant_saved) {
            await axios.post(API_URL + '/api/submissions/saveComplainant', complainant,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                }
              })
            .then((response) => {
                complainant_added(response.data.complainant)
            })
        } else {
            await axios.post(API_URL + '/api/submissions/update_complainant', complainant, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            })
            .then((response) => {
                console.log('\n\n\n Edited complainant details: ', response.data)

                complainant_added(complainant)

            })
        }

    }

    return (

            <form onSubmit={saveComplainant} className="m-3">

                {/* <div className="mb-3">
                    <select className='form-select' id="court" value={complainantCourt} onChange={complainantCourtChange} placeholder="Select your agency" required>
                        <option>Select court</option>
                        <option value="High Court">High Court</option>
                        <option value="District Court">District Court</option>
                    </select>
                    </div> */}

                <div className="mb-3">
                <select className='form-select' id="court-district" value={complainantCourtDistrict} onChange={complainantCourtDistrictChange} placeholder="Select your agency" required>
                    <option>Select court location</option>
                    {adult_only == 'adult' || adult_only == 'both' ?
                    <>
                        <option value="Criminal Court - North Trinidad">Criminal Court - North Trinidad</option>
                        <option value="Criminal Court - South Trinidad">Criminal Court - South Trinidad</option>
                        <option value="Criminal Court - Tobago">Criminal Court - Tobago</option>
                    </>
                    :
                    <>
                        <option value="Children Court - North Trinidad">Children Court - North Trinidad</option>
                        <option value="Children Court - South Trinidad">Children Court - South Trinidad</option>
                        <option value="Children Court - Tobago">Children Court - Tobago</option>
                    </>
                    }


                </select>
                </div>

                <div className="mb-3">
                {/* <select className='form-select' id="agency" value={complainantAgency} onChange={complainantAgencyChange} placeholder="Select your agency" required>
                    <option>Select complainant agency</option>
                    <option value="TTPS">TTPS (Trinidad & Tobago Police Service)</option>
                    <option value="DPP">DPP (Director Of Public Prosections)</option>
                    <option value="PRISONS">Prisons (Trinidad & Tobago Prison Service)</option> 
                    <option value="CUSTOMS">Customs (Ministry of Finance - Customs and Excise Division)</option>
                    <option value="IRD">IRD (Ministry of Finance, Inland Revenue)</option>
                </select> */}
                </div>
                <div className="mb-3">
                <input type="text" className="form-control" id="regName" value={complainantRegNum} onChange={complainantRegNumberChange} placeholder="Regimental number" required />
                </div>
                <div className="mb-3">
                <input type="text" className="form-control" id="rank" value={complainantRank} onChange={complainantRankChange} placeholder="Rank" />
                </div>
                <div className="mb-3">
                <input type="text" className="form-control" id="unit" value={complainantUnit} onChange={complainantUnitChange} placeholder="Station/Unit" />
                </div>
                <div className="mb-3">
                <input type="text" className="form-control" id="firstName" value={complainantFirstName} onChange={complainantFirstNameChange} placeholder="First Name" required />
                </div>
                <div className="mb-3">
                <input type="text" className="form-control" id="lastName" value={complainantLastName} onChange={complainantLastNameChange} placeholder="Last Name" required />
                </div>
                <div className="mb-3">
                <input type="email" className="form-control" id="email1" value={complainantEmail} onChange={complainantEmailChange} placeholder="Email Address" required />
                </div>

                {/* <div className="d-grid gap-2"> */}
                {/* <button type="submit" className="btn btn-md btn-primary float-end" >Save</button> */}
                <button
                type="submit"
                className="btn btn-md btn-primary ms-1 float-end" // Use btn-light for a button with no background
                >
                {/* <i className="text-gray">
                        <FontAwesomeIcon icon={faCheck} />
                        </i>  */}
                Save and Continue
                </button>
                {/* </div> */}


            </form>



    )


}