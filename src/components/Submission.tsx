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
import AuthService from "../services/AuthService"
import { Navigate, useNavigate } from "react-router-dom"

type SubmissionProps = {}

type submissionStep = {
  id: number,
  title: string
}

const log = (type: any) => console.log.bind(console, type)

const processForm = (form: any) => {
  console.log('Submitted form data: ', form.formData)
  alert('Hurrah!');
}


export const Submission = ({}: SubmissionProps) => {

  const navigate = useNavigate()

  const auth = new AuthService


  const [submissionTitle, setSubmissionTitle] = useState('')
  const [submissionTitleSaved, setSubmissionTitleSaved] = useState(false)
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

    setSubmissionTitleSaved(true)
  }

  const saveComplainant = async (event: any) => {
    event.preventDefault()

    

    let complainant = {
      agency: "TTPS",
      firstName: complainantFirstName,
      lastName: complainantLastName,
      email: complainantEmail,
      regNum: complainantRegNum,
      submissionId: submissionId
    }

    console.log('Saving complainant: ', complainant)

    await axios.post(API_URL + '/api/submissions/saveComplainant', complainant)
    .then((response) => {

      switch(response.data.outcome) {
        case 'success':
          console.log('Complainant successfully saved')
          setSubmissionStatus('complainant_saved')
          break
        case 'error':
          console.log('Error saving complainant')
          break
        default:
          console.log('Unknown complainant save outcome')
          break
      }

    })

    console.log('Complainant saved ?')

  }

  const editTitle = () => {
    setSubmissionTitleSaved(false)
  }

  const [schema, setSchema] = useState({})
  const [UI, setUI] = useState({})

  const [currentStep, setCurrentStep] = useState(1)

  const submissionSteps: submissionStep[] = [
    {id: 1, title: 'Step 1'},
    {id: 2, title: 'Step 2'},
    {id: 3, title: 'Step 3'},
    {id: 4, title: 'Step 4'}
  ]

  // const submissionSteps = [1,2,3,4,5]

  const nextStep = () => {
    if (currentStep < submissionSteps.length) setCurrentStep(currentStep + 1)
  }

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

  return (
    // Typescript schema assignment error does not prevent porper operation of RJSF form

    
      <>

        { auth.loggedIn() ? 
          <>
            <div className="container">


              <div id="regForm" className="fade show">

                <br />
                <h3 className='page-title'> Complaint With Oath { submissionTitleSaved ? '(' + submissionTitle + ')' : '' } </h3>
                { !submissionTitleSaved ?
                  <></>
                  : <>
                    <a href="#" className="float-end" onClick={editTitle}>Edit</a>
                  </>
                }
                             
                <br /> <br />

                { !submissionTitleSaved ? 
                  <>
                    <form onSubmit={saveTitle} >
                      <fieldset>
                        <div className="form-group field field-string">
                          <label className="control-label">
                            Submission Title
                          </label>
                          <input className="form-control" type="text" value={submissionTitle} onChange={submissionTitleChange} />
                        </div>
                        <button type="submit" className="btn btn-secondary float-end">Save</button>
                      </fieldset>
                    </form><br/><br/>
                  </>
                  : <></>
                }

                {submissionStatus == 'started' ?
                  <>
                    <div className="card fade show">
                      <form onSubmit={saveComplainant}>

                        <div className="mb-3">
                            <select className='form-select' id="agency" value={complainantAgency} onChange={complainantAgencyChange} placeholder="Select your agency">
                                <option>Select complainant agency</option>
                                <option value="TTPS">TTPS (Trinidad & Tobago Police Service)</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="regName" value={complainantRegNum} onChange={complainantRegNumberChange} placeholder="Agency ID" required />
                        </div>                    
                        <div className="mb-3">
                            <input type="text" className="form-control" id="firstName" value={complainantFirstName} onChange={complainantFirstNameChange} placeholder="First Name" required />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="lastName" value={complainantLastName} onChange={complainantLastNameChange} placeholder="Last Name" required />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" id="email1" value={complainantEmail} onChange={complainantEmailChange} placeholder="email" required />
                        </div>

                        {/* <div className="d-grid gap-2"> */}
                            <button type="submit" className="btn btn-secondary float-end" >Save</button>
                        {/* </div> */}
    

                      </form>
                    </div>                  
                  </>
                  : <>
                    <div className="card fade show">
                      <div className="card-body">
                        <h5 className="card-title">Complainant</h5>
                      </div>
                    </div>
                  </>            
                }




                {/* { !submissionTitleSaved ? <></> : <Complainant />} */}

                {/* { !submissionTitleSaved ? <></> : <Charges />} */}
                

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