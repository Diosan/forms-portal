// Import Form and validator from RJSF form despite what documentation says or fails to say
import {useEffect, useState} from "react";
import axios from "axios";
import "../assets/Submission.css"
import "../assets/javascript/submission"
import { Step } from "./Step";
 

type SubmissionProps = {}

type submissionStep = {
  id: number,
  title: string
}


export const Submission = ({}: SubmissionProps) => {

  const [schema, setSchema] = useState({});

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
  
  useEffect(() => {
    axios.get('http://localhost:3000/schema')
    .then((response) => {
      setSchema(response.data)
    })
  }, []);

  return (
    // Typescript schema assignment error does not prevent porper operation of RJSF form
    <>



          <div className="container">


                <div id="regForm">

                  <br />
                  <h3 className='page-title'>Complaint Without Oath</h3>             
                  <br /> <br />

                  {submissionSteps.map((step) => <Step isActive={step.id == currentStep} step={step.id} title={step.title} /> )}

                  

                  <div style={{overflow:'auto'}}>
                      <div style={{float:'right'}}>
                        {currentStep > 1 ? <a id="prevBtn" className="btn btn-secondary" onClick={previousStep} >❮ Previous</a>  : ''  }
                        {currentStep < submissionSteps.length 
                          ? <a id="nextBtn" className="btn btn-secondary" onClick={nextStep} >Next ❯</a> 
                          : <a id="nextBtn" className="btn btn-success" onClick={finishSubmission} >Finish ❯</a>}                        
                        
                      </div>
                  </div>

                      
                  <div style={{textAlign:'center', marginTop:'20px'}}>

                      {submissionSteps.map(step => {
                        if (step.id == currentStep) {
                          return <span className="step active"></span>
                        }
                        return <span className="step"></span> 
                      })}

                  </div>

                </div>

          </div>  


    </>
  )
} 