import {useEffect, useState} from "react"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'

type RequestSignatureProps = {
    submission_id: number,
    complainant_email: string
}

const log = (type: any) => console.log.bind(console, type)


export const RequestSignature = ({submission_id, complainant_email}:RequestSignatureProps) => {

    const navigate = useNavigate()

    const [summarySchema, setSummarySchema] = useState({})
    const [summaryUI, setSummaryUI] = useState({})

    const requestSignature = async (form: any) => {

        if (confirm('Click OK if you are sure you are ready to request a signature') == true) {
            
            let submissionForRequest = await axios.post(
                API_URL + '/api/submissions/update/',
                { id: submission_id, summaryOfEvidence: form.formData.summaryOfEvidence}
            )           
            
            let requestResult = await axios.post(
                API_URL + '/api/submissions/request_signature', 
                {
                    submission_id: submission_id,
                    complainant_email: complainant_email
                }
            )

            if(requestResult.data.outcome == 'success') {
                navigate('/view/' + submission_id)
            }

        }

    }

    useEffect(() => {

        const getForm = async () => {
            let summaryForm = await axios.get(API_URL + '/schema/summary')
            setSummarySchema(summaryForm.data.schema)
            setSummaryUI(summaryForm.data.UI)
        }

        getForm()

    },[])

    return (
        <div className="px-1 mt-2"   style={{ backgroundColor:"#fff" }}>

            <Form 
                schema={summarySchema}
                uiSchema={summaryUI}
                // @ts-ignore
                validator={validator}
                onSubmit={requestSignature}
                onError={log('errors')}
            >
            <div className="">
                <button className="btn btn-primary" type="submit">Ready to Sign</button>
            </div>
            </Form>
            



        </div>


    )

}