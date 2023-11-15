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



          <div className="container">


                <div id="regForm">

                  <br />
                  <h3 className='page-title'> Complaint With Oath </h3>             
                  <br /> <br />

                    <Charges />

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
  )
} 