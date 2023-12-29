// Import Form and validator from RJSF form despite what documentation says or fails to say
import { useEffect, useState } from "react"
import "../assets/Submission.css"
import "../assets/Style.css"
import { Tooltip } from 'react-tooltip'
import { Charges } from "./Charges"
import { RequestSignature } from "./RequestSignature"
import AuthService from "../services/AuthService"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "axios";
import dotenv from "dotenv"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faQuestionCircle, faPencilAlt, faCheck, faAngleDoubleRight, faAngleDoubleLeft, faExpand, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { countCharge, deleteCharge } from '../slices/charge';

type SubmissionProps = {
  new_submission: boolean
}

type submissionStep = {
  id: number
  // ,
  // title: string
}

const log = (type: any) => console.log.bind(console, type)

export const Submission = ({ new_submission }: SubmissionProps) => {

  const requestSignature = () => {
    // alert('Performing requestSignature in Submission component')
    setChargeSaved(true)
  }

  const API_URL = import.meta.env.VITE_API_URL

  const auth = new AuthService

  const count = useSelector((state: RootState) => state.charge.charge_count);

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const authenticate = useSelector((state: RootState) => state.auth);
  const accuseds = useSelector((state: RootState) => state.accused.accused);
  const accusedCount = useSelector((state: RootState) => state.accused.count);
  const charge_count = useSelector((state: RootState) => state.charge.charge_count);
  // const state = useSelector((state: RootState) => state);

  // console.log(useSelector((state: RootState) => state.charge))





  const { isLoggedIn, otpRequired, token, isVerified } = authenticate
  const [changePassword, setChangePassword] = useState(false);

  const [editable, setEditable] = useState(true)

  const [submissionTitle, setSubmissionTitle] = useState('')
  const [submissionTitleSaved, setSubmissionTitleSaved] = useState(false)
  const [editingSubmissionTitle, setEditingSubmissionTitle] = useState(false)
  const [submissionComplainantSaved, setSubmissionComplainantSaved] = useState(false)
  const submissionTitleChange = (event: any) => {
    // console.log(event.target.value)
    setSubmissionTitle(event.target.value)
  }

  const [submissionId, setSubmissionId] = useState(0)
  const [submissionStatus, setSubmissionStatus] = useState('started')
  const [complainantAgency, setComplainantAgency] = useState('')
  const [complainantFirstName, setComplainantFirstName] = useState('')
  const [complainantLastName, setComplainantLastName] = useState('')
  const [complainantEmail, setComplainantEmail] = useState('')
  const [complainantRegNum, setComplainantRegNum] = useState('')
  const [complainantRank, setComplainantRank] = useState('')
  const [complainantUnit, setComplainantUnit] = useState('')
  const [complainantCourtDistrict, setComplainantCourtDistrict] = useState('')
  const [complainantCourt, setComplainantCourt] = useState('High Court')
  const [editingSubmissionComplainant, setEditingSubmissionComplainant] = useState(false)
  const [hasAccused, setHasAccused] = useState(false)

  const [chargeSaved, setChargeSaved] = useState(false)
  const accusedList = useSelector((state: RootState) => state.accused.accused);

  // State to track the active section

  // Event handlers for buttons
  const handleSectionChange = (section: any) => {
    console.log(section)
    setVisibleSections(prevState => ({
      complainant: false,
      accused: false,
      summary: false,
      all: false,
      [section]: true,
    }));
  };

  const [visibleSections, setVisibleSections] = useState({
    complainant: true,
    accused: false,
    summary: false,
    all: false,
  });

  // Function to make all sections visible
  const handleShowAllSections = () => {
    setVisibleSections({
      complainant: true,
      accused: true,
      summary: true,
      all: true,
    });
  };



  const [matterType, setMatterType] = useState('Indictable')
  const [adultOnly, setAdultOnly] = useState('adult')

  const matterTypeChange = (event: any) => {
    setMatterType(event.target.value)
  }

  const adultOnlyChange = (event: any) => {
    setAdultOnly(event.target.value)
  }

  const complainantCourtDistrictChange = (event: any) => {
    setComplainantCourtDistrict(event.target.value)
  }

  // const complainantCourtChange = (event: any) => {
  //   setComplainantCourt(event.target.value)
  // }

  const checkHasAccused = (areThereAccused: boolean) => {
    setHasAccused(areThereAccused);
    console.log("Are there accused: ", areThereAccused)
  };

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

  const saveTitle = async (event: any) => {
    event.preventDefault()

    // console.log('Before decoding token')
    let decoded = await auth.decodedToken()
    console.log(decoded)

    if (submissionTitleSaved) {
      console.log('submissionId is ' + submissionId)
      let submission = {
        id: submissionId,
        title: submissionTitle,
        email: decoded.email,
        userId: decoded.id,
        type: 'complaint_with_oath'
      }
      console.log('Submission is : ', submission)
      await axios.post(API_URL + '/api/submissions/update_title', submission,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
        .then((response) => {

          console.log('Posted update to submission title')

          switch (response.data.outcome) {
            case 'success':
              console.log('Successfully updated submission title. Response Data : ', response.data);
              setEditingSubmissionTitle(false)
              break
            case 'error':
              console.log('Error updating submission title')
              break
            default:
              console.log('Unknown outcome updating submission title')
              break
          }

        })
      // .catch((error) => {
      //   console.log('Error posting update to submission title', error)
      // })

    } else {
      let submission = {
        title: submissionTitle,
        email: decoded.email,
        userId: decoded.id,
        matterType: matterType,
        adultOnly: adultOnly,
        type: 'complaint_with_oath'
      }
      axios.post(API_URL + '/api/submissions', submission, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
        .then((response) => {

          switch (response.data.outcome) {
            case 'success':
              console.log('Successfully saved Title. Response Data : ', response.data);
              setSubmissionId(response.data.submission_id)
              break
            case 'error':
              break
            default:
              break
          }

        })
    }


    setSubmissionTitleSaved(true)
  }

  const saveComplainant = async (event: any) => {
    event.preventDefault()



    let complainant = {
      agency: "TTPS",
      court: complainantCourt,
      courtDistrict: complainantCourtDistrict,
      firstName: complainantFirstName,
      lastName: complainantLastName,
      email: complainantEmail,
      regNum: complainantRegNum,
      rank: complainantRank,
      unit: complainantUnit,
      submissionId: submissionId
    }

    console.log('Complainant being sent to server: ', complainant);

    if (!submissionComplainantSaved) {
      await axios.post(API_URL + '/api/submissions/saveComplainant', complainant,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
        .then((response) => {

          switch (response.data.outcome) {
            case 'success':
              console.log('Complainant successfully saved')
              setSubmissionComplainantSaved(true)
              break
            case 'error':
              console.log('Error saving complainant')
              break
            default:
              console.log('Unknown complainant save outcome')
              break
          }

        })
    } else {
      await axios.post(API_URL + '/api/submissions/update_complainant', complainant, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
        .then((response) => {

          switch (response.data.outcome) {
            case 'success':
              console.log('Complainant successfully updated')
              setEditingSubmissionComplainant(false)
              break
            case 'error':
              console.log('Error updating complainant')
              break
            default:
              console.log('Unknown complainant update outcome')
              break
          }

        })
    }



    // console.log('Complainant saved ?')

  }

  const editTitle = () => {
    setEditingSubmissionTitle(true)
  }

  const editComplainant = () => {
    setEditingSubmissionComplainant(true)
  }

  const [schema, setSchema] = useState({})
  const [UI, setUI] = useState({})

  const [currentStep, setCurrentStep] = useState(1)



  const previousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const finishSubmission = () => {

  }

  const { id } = useParams()

  useEffect(() => {
    (async () => {
      if (!new_submission) {
        setSubmissionId(parseInt('' + id))
        let returned_submission = await axios.get(API_URL + '/api/submissions/' + id, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
        console.log('Returned submission: ', returned_submission.data)
        if (returned_submission?.data?.submission?.status == 'final') {
          navigate(`/sign/${id}`)
        }


        setSubmissionTitle(returned_submission.data.submission.description)
        setSubmissionTitleSaved(true)

        switch (returned_submission.data.submission.status) {
          case 'complainant_saved':
            // console.log('Returned Complainant: ', returned_submission.data.complainant) 
            setSubmissionComplainantSaved(true)
            setComplainantFirstName(returned_submission.data.complainant.firstName)
            setComplainantLastName(returned_submission.data.complainant.lastName)
            setComplainantAgency(returned_submission.data.complainant.agency)
            setComplainantCourt(returned_submission.data.complainant.court)
            setComplainantCourtDistrict(returned_submission.data.complainant.courtDistrict)
            setComplainantRegNum(returned_submission.data.complainant.regNum)
            setComplainantRank(returned_submission.data.complainant.rank)
            setComplainantUnit(returned_submission.data.complainant.unit)
            setComplainantEmail(returned_submission.data.complainant.email)
            break
          case 'charge_saved':
            setSubmissionComplainantSaved(true)
            setComplainantFirstName(returned_submission.data.complainant.firstName)
            setComplainantLastName(returned_submission.data.complainant.lastName)
            setComplainantAgency(returned_submission.data.complainant.agency)
            setComplainantCourt(returned_submission.data.complainant.court)
            setComplainantCourtDistrict(returned_submission.data.complainant.courtDistrict)
            setComplainantRegNum(returned_submission.data.complainant.regNum)
            setComplainantRank(returned_submission.data.complainant.rank)
            setComplainantUnit(returned_submission.data.complainant.unit)
            setComplainantEmail(returned_submission.data.complainant.email)
            setChargeSaved(true)
            break
          case 'signature_requested':
            setEditable(false)
            setSubmissionComplainantSaved(true)
            setComplainantFirstName(returned_submission.data.complainant.firstName)
            setComplainantLastName(returned_submission.data.complainant.lastName)
            setComplainantAgency(returned_submission.data.complainant.agency)
            setComplainantCourt(returned_submission.data.complainant.court)
            setComplainantCourtDistrict(returned_submission.data.complainant.courtDistrict)
            setComplainantRegNum(returned_submission.data.complainant.regNum)
            setComplainantRank(returned_submission.data.complainant.rank)
            setComplainantUnit(returned_submission.data.complainant.unit)
            setComplainantEmail(returned_submission.data.complainant.email)
            setChargeSaved(true)
            break
          default:
            console.log('Submission: ', returned_submission.data.complainant)
            break
        }


        setSubmissionComplainantSaved(true)
        setComplainantFirstName(returned_submission.data.complainant.firstName)
        setComplainantLastName(returned_submission.data.complainant.lastName)
        setComplainantAgency(returned_submission.data.complainant.agency)
        setComplainantRank(returned_submission.data.complainant.rank)
        setComplainantUnit(returned_submission.data.complainant.unit)
        setComplainantRegNum(returned_submission.data.complainant.regNum)
        setComplainantEmail(returned_submission.data.complainant.email)

        console.log('Complainant: ', returned_submission.data.complainant)

      }
    })();
  }, [id, new_submission, editingSubmissionTitle]);

  const goToAnchor = () => {
    setTimeout(() => {
      console.log('Anchor');
      const anchorElement = document.getElementById('anchorSign');
      if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300); // 500 milliseconds delay
  }

  // useEffect to track changes in accusedList
  useEffect(() => {
    console.log("chargesCount: ", count)
    if (count > 0) {
      setHasAccused(true)
      console.log('accused count: ', accusedCount, 'charges count: ', count);
    }
    else {
      setHasAccused(false)
      console.log('Accused list is empty.');
    }
  }, [accusedCount, count]);

  useEffect(() => {
    console.log('The charge Count has changed:', count);
  }, [accusedCount]);






  return (
    // Typescript schema assignment error does not prevent porper operation of RJSF form


    <div className="d-flex">



      {auth.loggedIn() ?
        <>
          <div className="swf-container container"
            style={{ borderRadius: "5px", maxWidth: "800px", padding: "20px 40px", margin: "10px 30px 30px 220px", flexGrow: 1 }}
          >


            <div id="regForm" className="fade show m-0 py-0">
              <div>

                <div>
                  {/* Displaying the count of accused */}
                  {/* <p>Number of Charges: {count}</p> */}

                  {/* rest of your component */}
                </div>

                <div className="container p-0 mb-3">
                  <div className="row">
                    <div className="col col-10 d-flex justify-content-start">
                      <button className="btn btn-link me-2" onClick={() => handleSectionChange('complainant')}>Complainant</button>
                      <button className="btn btn-link" onClick={() => handleSectionChange('accused')}>
                        <i className="fa fa-expand"></i> <FontAwesomeIcon icon={faAngleDoubleRight} />
                      </button>
                      <button className="btn btn-link me-2" onClick={() => handleSectionChange('accused')}>Accuseds & Charges</button>
                      <button className="btn btn-link" onClick={() => handleSectionChange('summary')}>
                        <i className="fa fa-expand"></i> <FontAwesomeIcon icon={faAngleDoubleRight} />
                      </button>
                      <button className="btn btn-link" onClick={() => handleSectionChange('summary')}>Summary of Evidence</button>

                    </div>
                    <div className="col col-2 d-flex justify-content-end">
                      <button className="btn btn-link" onClick={handleShowAllSections}>
                        <i className="fa fa-expand"></i> <FontAwesomeIcon icon={faExpandArrowsAlt} />
                      </button>
                    </div>
                  </div>
                </div>





                <div className="px-2 py-2 d-flex align-items-center" style={{ backgroundColor: "#333", color: "#fff" }}>
                  <div className="row" style={{ maxWidth: "200px", margin: "0 auto", color: "#fff", textDecoration: "none" }} >
                    <a style={{ color: "#fff", textDecoration: "none" }} href="/submissions" className="m-0 btn-link new-submission-btn float-start">
                      <FontAwesomeIcon icon={faArrowLeftLong} />
                    </a>
                  </div>
                  <h5 className="fw-bold mx-3 mb-0 flex-grow-1">Complaint With Oath {submissionTitleSaved ? '(' + submissionTitle + ')' : ''}</h5>
                  {!submissionTitleSaved || editingSubmissionTitle ?
                    <></>
                    : <>
                      {/* <a href="#" className="small" onClick={editTitle}>Edit Title</a> */}
                      <button style={{ color: "#fff", textDecoration: "none" }} onClick={editTitle} type="button" className="btn btn-link btn-xs">
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>

                    </>
                  }
                </div>
                {!submissionTitleSaved || editingSubmissionTitle ?
                  <div className="mb-3 px-3 pt-2" style={{ backgroundColor: "#ddd", color: "#222" }}>
                    <form onSubmit={saveTitle} >
                      <fieldset>
                        <div className="form-group field field-string">



                          <Tooltip style={{ maxWidth: "200px" }} id="my-tooltip" />


                          <label id="" className="control-label fs-6">
                            In house reference <a
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content="Enter a short description that helps you quickly identify this submission (Eg. John Doe, Dec 13 2023)"
                              data-tooltip-place="top"
                            >
                              <FontAwesomeIcon icon={faQuestionCircle} />
                            </a>
                          </label>

                          <div className=" mt-2">
                            <input
                              className="form-control fs-5 mt-0 mb-0 flex-grow-1"
                              type="text"
                              value={submissionTitle}
                              onChange={submissionTitleChange}
                            />
                            {!submissionTitleSaved ?
                              <>
                                <label className="control-label fs-6  my-2">
                                  Category Of Accused
                                </label>
                                <select className='form-select fs-5 mt-0 mb-0 flex-grow-1' id="adultOnly" value={adultOnly} onChange={adultOnlyChange} placeholder="Select your agency" required>
                                  <option value="adult">Adult only</option>
                                  <option value="child">Child only</option>
                                  <option value="both">Both</option>
                                </select>
                                <label className="control-label fs-6 my-2">
                                  Matter Type
                                </label>
                                <select className='form-select fs-5 mt-0 mb-0 flex-grow-1' id="matterType" value={matterType} onChange={matterTypeChange} placeholder="Select your agency" required>
                                  <option>Select matter type</option>
                                  <option value="Indictable">Indictable</option>
                                  <option value="Summary">Summary</option>
                                  <option value="Either-way">Either-way</option>
                                  <option value="Indictable with Summary">Indictable with Summary</option>
                                  <option value="Indictable with Either-way">Indictable with Either-way</option>
                                </select>
                              </>
                              : <></>
                            }
                            <button
                              type="submit"
                              className="btn btn-md btn-dark ms-1  my-2 mt-3" // Use btn-light for a button with no background
                            >
                              <i className="text-gray">
                                <FontAwesomeIcon icon={faCheck} />
                              </i> Continue
                            </button>
                          </div>


                          {/* <input className="form-control fs-5 mt-2" type="text" value={submissionTitle} onChange={submissionTitleChange} /> */}
                        </div>
                        {/* <button type="submit" className="btn btn-sm btn-primary float-end">Save</button> */}
                      </fieldset>
                    </form><br />
                  </div>
                  : <></>
                }

              </div>



              <div className="px-2 py-3" style={{ backgroundColor: "#fff", color: "#222" }}>

                <div id="swf-complainant" style={{ display: visibleSections.complainant || visibleSections.all ? 'block' : 'none' }}>
                  {submissionTitleSaved ?
                    <div>

                      {(!submissionComplainantSaved || editingSubmissionComplainant) && editable ?
                        <div>

                          <div className="card fade show m-3" style={{ border: "none", backgroundColor: "#ddd" }} >
                            <h4 className="text-center mt-3 mb-1">Complainant Information</h4>
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
                                  {adultOnly == 'adult' || adultOnly == 'both' ?
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
                                <select className='form-select' id="agency" value={complainantAgency} onChange={complainantAgencyChange} placeholder="Select your agency" required>
                                  <option>Select complainant agency</option>
                                  <option value="TTPS">TTPS (Trinidad & Tobago Police Service)</option>
                                </select>
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

                          </div>

                        </div>



                        : <></>
                      }

                      {submissionComplainantSaved && !editingSubmissionComplainant ?
                        <>

                          <div className="card fade show p-2" style={{ border: "none" }}>
                            {/* <div className="fade show">
                                  <a href="#" className="float-end" onClick={editComplainant}>Edit</a>
                                </div> */}


                            <div className="px-2 py-2 d-flex align-items-center" style={{ backgroundColor: "#444", color: "#fff", borderBottom: "1px solid #ddd" }}>
                              <h5 className="fw-bold m-0 px-2 flex-grow-1 text-left">Complainant Information</h5>
                              {!submissionTitleSaved || editingSubmissionTitle ?
                                <></>
                                : <>
                                  {/* <a href="#" className="small" onClick={editTitle}>Edit Title</a> */}
                                  {/* <button type="button" className="btn btn-primary btn-xs"> */}
                                  <button style={{ color: "#fff", textDecoration: "none" }} onClick={editComplainant} type="button" className="btn btn-link btn-xs">
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                  </button>

                                </>
                              }
                            </div>


                            <div className="card-body" style={{ border: "1px solid #ddd", backgroundColor: "#eee" }}>
                              <div className="text-left complainant-details mt-2">
                                <label>Name:</label> {complainantFirstName + ' ' + complainantLastName}
                                <br /><label>Agency:</label> {complainantAgency}
                                <br /><label>Court:</label> {complainantCourt}
                                <br /><label>Court District:</label> {complainantCourtDistrict}
                                <br /><label>Regimental Number:</label> {complainantRegNum}
                                <br /><label>Rank:</label> {complainantRank}
                                <br /><label>Station/Unit:</label> {complainantUnit}
                                <br /><label>Email:</label> {complainantEmail}
                              </div>

                            </div>
                            <div className="d-flex justify-content-end mt-3">
                              <button className="btn btn-link me-2 px-0" onClick={() => handleSectionChange('accused')}>
                                Next: Accuseds & Charges <i className="fa fa-expand"></i> <FontAwesomeIcon icon={faAngleDoubleRight} /></button>
                            </div>



                          </div>
                        </>
                        : <></>
                      }

                    </div>
                    : <></>
                  }

                </div>


                <div id="swf-accused" style={{ display: visibleSections.accused || visibleSections.all ? 'block' : 'none' }}>

                  {!submissionComplainantSaved ?
                    <></>
                    :
                    <div className="p-2" style={{ backgroundColor: "#fff" }}>
                      <Charges
                        submission_id={submissionId}
                        request_signature={requestSignature}
                        hasAccused={checkHasAccused}
                        editable={editable}
                      />
                    </div>
                  }

                  <div className="container p-0 mb-3">
                    <div className="row">
                      <div className="col col-6 d-flex justify-content-start">
                        <button className="btn btn-link me-2" onClick={() => handleSectionChange('complainant')}>
                          <i className="fa fa-expand"></i> <FontAwesomeIcon icon={faAngleDoubleLeft} />Complainant</button>
                      </div>
                      <div className="col col-6 d-flex justify-content-end">
                        <button className="btn btn-link" onClick={() => handleSectionChange('summary')}>
                          Next: Summary of Evidence <i className="fa fa-expand"></i> <FontAwesomeIcon icon={faAngleDoubleRight} /></button>
                      </div>
                    </div>
                  </div>
                </div>



                <div id="swf-summary" style={{ display: visibleSections.summary || visibleSections.all ? 'block' : 'none' }}>

                  {(hasAccused && charge_count > 0) ?
                    <div className="" style={{ backgroundColor: "#fff", border: "10px solid #eee", borderRadius: "none!important" }}>
                      <h5 className="fw-bold m-0 mt-4 mb-2 px-2 flex-grow-1 text-center">Summary of Evidence</h5>
                      <RequestSignature submission_id={submissionId} complainant_email={complainantEmail} />
                    </div>
                    : <></>
                  }
                </div>



              </div>



            </div>

          </div>
        </>
        : <Navigate to="/" replace={true} />
      }




    </div>

  )
} 