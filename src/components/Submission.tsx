// Import Form and validator from RJSF form despite what documentation says or fails to say
import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import "../assets/Submission.css"
// import "../assets/javascript/submission"
import { Step } from "./Step"
import { Complainant } from "./Complainant"
import { Charges } from "./Charges"
import { RequestSignature } from "./RequestSignature"
import AuthService from "../services/AuthService"
import { Navigate, useNavigate, useParams } from "react-router-dom"

type SubmissionProps = {
  new_submission: boolean
}

type submissionStep = {
  id: number
  // ,
  // title: string
}

const log = (type: any) => console.log.bind(console, type)




export const Submission = ({new_submission}: SubmissionProps) => {

  const requestSignature = () => {
    // alert('Performing requestSignature in Submission component')
    setChargeSaved(true)
  }

  const navigate = useNavigate()

  const auth = new AuthService

  const [editable, setEditable] = useState(true)

  const [submissionTitle, setSubmissionTitle] = useState('')
  const [submissionTitleSaved, setSubmissionTitleSaved] = useState(false)
  const [editingSubmissionTitle, setEditingSubmissionTitle] = useState(false)
  const [submissionComplainantSaved, setSubmissionComplainantSaved] = useState(false)
  const submissionTitleChange = (event: any) => {
    setSubmissionTitle(event.target.value)
  }

  const [submissionId, setSubmissionId] = useState(0)

  const [submissionStatus, setSubmissionStatus] = useState('started')

  const [complainantAgency, setComplainantAgency] = useState('')
  const [complainantFirstName, setComplainantFirstName] = useState('')
  const [complainantLastName, setComplainantLastName] = useState('')
  const [complainantEmail, setComplainantEmail] = useState('')
  const [complainantRegNum, setComplainantRegNum] = useState('')
  const [complainantCourtDistrict, setComplainantCourtDistrict] = useState('')
  const [complainantCourt, setComplainantCourt] = useState('')
  const [editingSubmissionComplainant, setEditingSubmissionComplainant] = useState(false)

  const [chargeSaved, setChargeSaved] = useState(false)

  const complainantCourtDistrictChange = (event: any) => {
    setComplainantCourtDistrict(event.target.value)
  }

  const complainantCourtChange = (event: any) => {
    setComplainantCourt(event.target.value)
  }

  const complainantAgencyChange = (event: any) => {
    setComplainantAgency(event.target.value)
  }

  const complainantRegNumberChange = (event: any) => {
      setComplainantRegNum(event.target.value)
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



    if(submissionTitleSaved) {
      console.log('submissionId is ' + submissionId)
      let submission = {
        id: submissionId,
        title: submissionTitle,
        email: decoded.email
      }
      console.log('Submission is : ', submission)
      await axios.post(API_URL + '/api/submissions/update_title', submission)
      .then((response) => {

        console.log('Posted update to submission title')
  
        switch(response.data.outcome) {
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
        email: decoded.email
      }
      axios.post(API_URL + '/api/submissions', submission)
      .then((response) => {
  
        switch(response.data.outcome) {
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
      submissionId: submissionId
    }

    console.log('Complainant being sent to server: ', complainant);    

    if(!submissionComplainantSaved) {
      await axios.post(API_URL + '/api/submissions/saveComplainant', complainant)
      .then((response) => {
  
        switch(response.data.outcome) {
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
      await axios.post(API_URL + '/api/submissions/update_complainant', complainant)
      .then((response) => {
  
        switch(response.data.outcome) {
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

  // const submissionSteps: submissionStep[] = [
  //   {id: 1, title: 'Step 1'},
  //   {id: 2, title: 'Step 2'},
  //   {id: 3, title: 'Step 3'},
  //   {id: 4, title: 'Step 4'}
  // ]

  // const submissionSteps = [1,2,3,4,5]

  // const nextStep = () => {
  //   if (currentStep < submissionSteps.length) setCurrentStep(currentStep + 1)
  // }

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const finishSubmission = () => {

  }
  
  // useEffect(() => {
  //   axios.get(API_URL + '/schema/main')
  //   .then((response) => {
  //     setSchema(response.data.schema)
  //     setUI(response.data.UI)
  //   })
  // }, []);

  const { id } = useParams()

  useEffect( () => {
    (async () => {
      if(!new_submission) { 
        setSubmissionId(parseInt('' + id))   
        let returned_submission = await axios.get(API_URL + '/api/submissions/' + id)
        // console.log('Returned submission: ', returned_submission.data)
        setSubmissionTitle(returned_submission.data.submission.description)
        setSubmissionTitleSaved(true)

        switch(returned_submission.data.submission.status) {
          case 'complainant_saved':
            // console.log('Returned Complainant: ', returned_submission.data.complainant) 
            setSubmissionComplainantSaved(true)
            setComplainantFirstName(returned_submission.data.complainant.firstName)
            setComplainantLastName(returned_submission.data.complainant.lastName)
            setComplainantAgency(returned_submission.data.complainant.agency)
            setComplainantCourt(returned_submission.data.complainant.court)
            setComplainantCourtDistrict(returned_submission.data.complainant.courtDistrict)
            setComplainantRegNum(returned_submission.data.complainant.regNum)
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
              setComplainantEmail(returned_submission.data.complainant.email)
              setChargeSaved(true)
              break
          default: 
            console.log('Submission: ', returned_submission.data.submission)
            break 
        }

        // if(returned_submission.data.submission.status == 'complainant_saved') {
        //   setSubmissionComplainantSaved(true)
        //   setComplainantFirstName(returned_submission.data.complainant.firstName)
        //   setComplainantLastName(returned_submission.data.complainant.lastName)
        //   setComplainantAgency(returned_submission.data.complainant.agency)
        //   setComplainantRegNum(returned_submission.data.complainant.regNum)
        //   setComplainantEmail(returned_submission.data.complainant.email)
        // } else {
        //   console.log('Submission: ', returned_submission.data.submission)
        // }

      }
    })();
  }, [id, new_submission, submissionTitle, editingSubmissionTitle]);

  return (
    // Typescript schema assignment error does not prevent porper operation of RJSF form

    
      <>

        { auth.loggedIn() ? 
          <>
            <div className="swf-container container">


              <div id="regForm" className="fade show">

                <br />
                <h3 className='page-title'> Complaint With Oath { submissionTitleSaved ? '(' + submissionTitle + ')' : '' } </h3>
                { !submissionTitleSaved || editingSubmissionTitle ?
                    <></>
                    : <>
                      <a href="#" className="float-end" onClick={editTitle}>Edit</a>
                    </>
                }
                             
                <br /> <br />

                { !submissionTitleSaved  || editingSubmissionTitle ? 
                    <>
                      <form onSubmit={saveTitle} >
                        <fieldset>
                          <div className="form-group field field-string">
                            <label className="control-label fs-5">
                              Submission Title
                            </label>
                            <input className="form-control fs-5 mt-2" type="text" value={submissionTitle} onChange={submissionTitleChange} />
                          </div>
                          <button type="submit" className="btn btn-lg btn-primary float-end">Save</button>
                        </fieldset>
                      </form><br/><br/>
                    </>
                    : <></>
                }

                

                { submissionTitleSaved ?
                    <>

                      {(!submissionComplainantSaved || editingSubmissionComplainant) && editable ?
                        <>
                          <div className="card fade show">

                            <form onSubmit={saveComplainant}>

                              <div className="mb-3">
                                  <select className='form-select' id="court" value={complainantCourt} onChange={complainantCourtChange} placeholder="Select your agency" required>
                                      <option>Select court</option>
                                      <option value="High Court">High Court</option>
                                      <option value="District Court">District Court</option>
                                  </select>
                              </div>

                              <div className="mb-3">
                                  <select className='form-select' id="court-district" value={complainantCourtDistrict} onChange={complainantCourtDistrictChange} placeholder="Select your agency" required>
                                      <option>Select court district</option>
                                      <option value="North Trinidad">North Trinidad</option>
                                      <option value="South Trinidad">South Trinidad</option>
                                      <option value="Tobago">Tobago</option>
                                  </select>
                              </div>

                              <div className="mb-3">
                                  <select className='form-select' id="agency" value={complainantAgency} onChange={complainantAgencyChange} placeholder="Select your agency" required>
                                      <option>Select complainant agency</option>
                                      <option value="TTPS">TTPS (Trinidad & Tobago Police Service)</option>
                                  </select>
                              </div>
                              <div className="mb-3">
                                  <input type="text" className="fs-5 form-control" id="regName" value={complainantRegNum} onChange={complainantRegNumberChange} placeholder="Agency ID" required />
                              </div>                    
                              <div className="mb-3">
                                  <input type="text" className="fs-5 form-control" id="firstName" value={complainantFirstName} onChange={complainantFirstNameChange} placeholder="First Name" required />
                              </div>
                              <div className="mb-3">
                                  <input type="text" className="fs-5 form-control" id="lastName" value={complainantLastName} onChange={complainantLastNameChange} placeholder="Last Name" required />
                              </div>
                              <div className="mb-3">
                                  <input type="email" className="fs-5 form-control" id="email1" value={complainantEmail} onChange={complainantEmailChange} placeholder="Email" required />
                              </div>

                              {/* <div className="d-grid gap-2"> */}
                                  <button type="submit" className="btn btn-lg btn-primary float-end" >Save</button>
                              {/* </div> */}


                            </form>

                          </div>
                          <br/><br/> 
                        </>
                        : <></>
                      }

                      { submissionComplainantSaved && !editingSubmissionComplainant ?
                        <>
                          <div className="card fade show">
                            <div className="fade show">
                              <a href="#" className="float-end" onClick={editComplainant}>Edit</a>
                            </div> 
                            <div className="card-body">
                              <h5 className="card-title">Complainant</h5><br/>
                              <div className="text-left complainant-details">
                                <label>Name:</label> {complainantFirstName + ' ' + complainantLastName}
                                <br/><label>Agency:</label> {complainantAgency}
                                <br/><label>Court:</label> {complainantCourt}
                                <br/><label>Court District:</label> {complainantCourtDistrict}
                                <br/><label>Regimental Number:</label> {complainantRegNum}
                                <br/><label>Email:</label> {complainantEmail}
                              </div>
                              
                            </div>
                          </div>
                          <br /> <br />
                        </>
                        : <></>
                      }
                  
                    </>
                    : <></>            
                }


                {/* { !submissionTitleSaved ? <></> : <Complainant />} */}

                { !submissionComplainantSaved ? 
                  <></> 
                  : 
                  <Charges 
                    submission_id={submissionId} 
                    request_signature={requestSignature}
                    editable={editable} 
                  />}
                
                { chargeSaved ?
                    <RequestSignature submission_id={submissionId} complainant_email={complainantEmail} />
                  : <></>
                }
                

                  {/* <Complainant /> */}

                  {/* <Form 
                      schema={schema}
                      uiSchema={UI}
                      // @ts-ignore
                      validator={validator}
                      // onChange={log('changed')}
                      onSubmit={processForm}
                      onError={log('errors')}
                  >
                        <div className="progress-buttons">
                          <button className="btn btn-secondary" type="submit">Next ❯</button>
                        </div>
                  </Form> */}


                {/* {submissionSteps.map((step) => <Step isActive={step.id == currentStep} step={step.id} title={step.title} key={step.id} /> )} */}

                

                {/* <div style={{overflow:'auto'}}>
                    <div style={{float:'right'}}>
                      {currentStep > 1 ? <a id="prevBtn" className="btn btn-secondary" onClick={previousStep} >❮ Previous</a>  : ''  }
                      {currentStep < submissionSteps.length 
                        ? <a id="nextBtn" className="btn btn-secondary" onClick={nextStep} >Next ❯</a> 
                        : <a id="nextBtn" className="btn btn-success" onClick={finishSubmission} >Finish ❯</a>}                        
                      
                    </div>
                </div> */}

                    
                {/* <div style={{textAlign:'center', marginTop:'20px'}}>

                    {submissionSteps.map(step => {
                      if (step.id == currentStep) {
                        return <span className="step active" key={step.id}></span>
                      }
                      return <span className="step" key={step.id}></span> 
                    })}

                </div> */}

              </div>

            </div>           
          </>
          : <Navigate to="/" replace={true} />
        }

 


      </>
    
  )
} 