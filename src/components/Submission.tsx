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
  const saveTitle = (event: any) => {
    event.preventDefault()

    let submission = {
      title: submissionTitle
    }

    // axios.post(API_URL + '/api/submissions', submission)
    // .then((response) => {

    //   switch(response.data.outcome) {
    //     case 'success':
    //       break
    //     case 'error':
    //       break
    //     default:
    //       break
    //   }

    // })

    setSubmissionTitleSaved(true)
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


                { !submissionTitleSaved ? <></> : <Complainant />}

                { !submissionTitleSaved ? <></> : <Charges />}
                

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