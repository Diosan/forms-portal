// Import Form and validator from RJSF form despite what documentation says or fails to say
import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import "../assets/Submission.css"
import "../assets/Indictable.css"
// import "../assets/javascript/submission"
import { Step } from "./Step"
import { Complainant } from "./Complainant"
import { Charges } from "./Charges"
import { RequestSignature } from "./RequestSignature"
import { SignIndictment } from "./SignIndictment"
import AuthService from "../services/AuthService"
import { Navigate, useNavigate, useParams } from "react-router-dom"

type IndictableProps = {
  new_submission: boolean
}



const log = (type: any) => console.log.bind(console, type)



export const Indictable = ({new_submission}: IndictableProps) => {

  const navigate = useNavigate()

  const auth = new AuthService

  const [complainantSchema, setComplainantSchema] = useState({})
  const [complainantUI, setComplainantUI] = useState({})

  const [submissionTitleSaved, setSubmissionTitleSaved] = useState(false)
  const [editingSubmissionTitle, setEditingSubmissionTitle] = useState(false)
  const [submissionTitle, setSubmissionTitle] = useState('')
  const [courtDistrict, setCourtDistrict] = useState('')
  const [submissionId, setSubmissionId] = useState(0)

  const [chargeSaved, setChargeSaved] = useState(false)
  const [complainantEmail, setComplainantEmail] = useState('')
  
  const [editable, setEditable] = useState(true)

  const { id } = useParams()

  useEffect( () => {

    (async () => {

      let complainant_form = await axios.get(API_URL + '/schema/indictable_accused')
      setComplainantSchema(complainant_form.data.schema)
      setComplainantUI(complainant_form.data.UI)

      if(!new_submission) { 
        setSubmissionId(parseInt('' + id))   
        let returned_submission = await axios.get(API_URL + '/api/submissions/' + id)
        setSubmissionTitle(returned_submission.data.submission.description)
        setSubmissionTitleSaved(true)
        switch(returned_submission.data.submission.status) {
          case 'signature_requested':
            setEditable(false)
            setCourtDistrict(returned_submission.data.complainant.courtDistrict)
            break
          case 'charge_saved':
            setCourtDistrict(returned_submission.data.complainant.courtDistrict)
            setChargeSaved(true)
            setComplainantEmail('dpp@link868.com')
            break
          default: 
            console.log('Submission: ', returned_submission.data.submission)
            break 
        }
      }

    })()

  }, [])

  const requestSignature = () => {
    setChargeSaved(true)
  }

  const saveComplainant = async (form: any) => {

    let decoded = await auth.decodedToken()

    let submission = {
      submission: {
        description: form.formData.title,
        status: 'started',
        type: 'indictable'
      },
      email: decoded.email

    }

    let created_submission = await axios.post(API_URL + '/api/submissions/indictable', submission)

    console.log('\n\n\n Created submission: ', created_submission.data)

    setSubmissionId(created_submission.data.submission.id)

    let complainant = {
      court: 'High Court',
      courtDistrict: form.formData.courtDistrict,
      firstName: 'DPP',
      lastName: 'Office',
      email: 'dpp@link868.org',
      agency: 'DPP',
      regNum: '',
      submissionId: created_submission.data.submission.id
    }

    setComplainantEmail(complainant.email)

    console.log('Complainant to create: ', complainant);

    let created_complainant = await axios.post(API_URL + '/api/submissions/saveComplainant/', complainant)
    
    setSubmissionTitle(form.formData.title)
    setCourtDistrict(form.formData.courtDistrict)
    setSubmissionTitleSaved(true)

  } 

  return (
    

    
      <>

        { auth.loggedIn() ? 
          <>
            <div className="container">

              <h3 className='page-title'>Indictable Offence { submissionTitleSaved ? '(' + submissionTitle + ')' : '' } </h3><br/>

              <div className="main-area card">
              { !submissionTitleSaved  || editingSubmissionTitle ?
                  <>
                    <Form 
                      schema={complainantSchema}
                      uiSchema={complainantUI}
                      // @ts-ignore
                      validator={validator}
                      onSubmit={saveComplainant}
                      onError={log('errors')}
                    >
                      <button type="submit" className="btn btn-secondary float-end">Save</button>
                    </Form>
                  </>
                : <>
                  <table>
                    <tbody>
                      <tr>
                        <td><label>Court District: </label></td>
                        <td>{courtDistrict}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              }
              </div>

              { submissionTitleSaved ?
                <>
                  <div className="card">
                    <Charges 
                      request_signature={requestSignature} 
                      submission_id={submissionId}
                      editable={editable}
                    />
                  </div>
                </>
                : <></>
              }

              { chargeSaved ?
                  <SignIndictment submission_id={submissionId} complainant_email={complainantEmail} />
                : <></>
              }

            </div>           
          </>
          : 
          <>
          {/* <Navigate to="/" replace={true} /> */}
          </>

        }

 


      </>
    
  )
} 