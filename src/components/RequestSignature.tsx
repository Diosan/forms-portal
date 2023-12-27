import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck, faTrash, faTrashCan, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux";
import { RootState } from "../store";

type RequestSignatureProps = {
    submission_id: number,
    complainant_email: string
}

const log = (type: any) => console.log.bind(console, type)


export const RequestSignature = ({ submission_id, complainant_email }: RequestSignatureProps) => {

    const navigate = useNavigate()

    const [summarySchema, setSummarySchema] = useState({})
    const [summaryUI, setSummaryUI] = useState({})
    const [loading, setLoading] = useState(false)
    const [indictment, setIndictment] = useState(false)

    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state


    const requestSignature = async ( form: any) => {

        if (confirm('Click OK if you are sure you are ready to request a signature') == true) {

            setLoading(true);

            if(indictment) {
                let submissionForRequest = await axios.post(
                    API_URL + '/api/submissions/update/',
                    {
                        id: submission_id,
                        summaryOfEvidence: form.formData.summaryOfEvidence,
                        additionalNotes: form.formData.additionalNotes
                    }
                )

                let requestResult = await axios.post(
                    API_URL + '/api/submissions/request_signature',
                    {
                        submission_id: submission_id,
                        complainant_email: complainant_email
                    }
                )

                if (requestResult.data.outcome == 'success') {
                    navigate('/view/' + submission_id)
                }
            } else {
                navigate('/sign/' + submission_id)
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

    }, [])

    useEffect(() => {

        const getSubmission = async () => {
            let submission = await axios.get(
                API_URL + '/api/submissions/' + submission_id,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
            )
            console.log('Fetched submission: ', submission.data.submission)
            setIndictment(submission.data.submission.type == 'indictment')

        }

        getSubmission()

    }, [])

    return (
        <div className="px-1 mt-2 summ" >

            <Form
                schema={summarySchema}
                uiSchema={summaryUI}
                // @ts-ignore
                validator={validator}
                onSubmit={requestSignature}
                onError={log('errors')}
            >
                <div className="">
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                &nbsp;Please wait...
                            </>
                        ) : (
                            "Ready to Sign"
                        )}
                        
                    </button>
                </div>
            </Form>




        </div>


    )

}