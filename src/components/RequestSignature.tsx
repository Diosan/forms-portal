import { useEffect, useState } from "react"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck, faTrash, faTrashCan, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { countCharge, deleteCharge } from '../slices/charge';
import { useAppDispatch } from '../store';


type RequestSignatureProps = {
    submission_id: number,
    complainant_email: string
}

const log = (type: any) => console.log.bind(console, type)


export const RequestSignature = ({ submission_id, complainant_email }: RequestSignatureProps) => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch(); // Now you have the dispatch function


    const [summarySchema, setSummarySchema] = useState({})
    const [summaryUI, setSummaryUI] = useState({})
    const [loading, setLoading] = useState(false)
    const [indictment, setIndictment] = useState(false)

    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state
    const count = useSelector((state: RootState) => state.charge?.charge_count); // Using optional chaining

    const [formData, setFormData] = useState({
        summaryOfEvidence: "",
        additionalNotes: ""
    })    

    const requestSignature = async ( form: any) => {

        if(!indictment) {
            setFormData({
                summaryOfEvidence: form.formData.summaryOfEvidence,
                additionalNotes: form.formData.additionalNotes
            })
        }


        if (confirm('Click OK if you are sure you are ready to request a signature') == true) {

            setLoading(true);

            if(!indictment) {

                let submissionForRequest = await axios.post(
                    API_URL + '/api/submissions/update/',
                    {
                        id: submission_id,
                        summaryOfEvidence: form.formData.summaryOfEvidence,
                        additionalNotes: form.formData.additionalNotes
                    }
                )

                try {
                    let requestResult = await axios.post(
                        API_URL + '/api/submissions/request_signature',
                        {
                            submission_id: submission_id,
                            complainant_email: complainant_email
                        }
                    )

                    if (requestResult.data.outcome == 'success') {
                        navigate('/view/' + submission_id)
                    } else {
                        console.log('There was an error requesting signature')
                    }
                } catch (err) {
                    setLoading(false)
                    throw new Error('Unable to request signature')
                }

            } else {

                let submissionForRequest = await axios.post(
                    API_URL + '/api/submissions/update/',
                    {
                        id: submission_id,
                        summaryOfEvidence: '-',
                        additionalNotes: ''
                    }
                )
                navigate('/indictment/sign/' + submission_id)
                setLoading(false);

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

    // useEffect(() => {

    //     const getSubmission = async () => {
    //         let submission = await axios.get(
    //             API_URL + '/api/submissions/' + submission_id,
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': 'Bearer ' + token
    //                 }
    //             }
    //         )
    //         console.log('Fetched submission: ', submission.data.submission)
    //         setIndictment(submission.data.submission.type == 'indictment')

    //     }

    //     getSubmission()

    // }, [])

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
            // console.log('indictment variable being set to: ', submission.data.submission.type == 'indictment')
            // setIndictment(submission.data.submission.type == 'indictment')
            setIndictment(submission?.data?.submission?.type == 'indictment')

        }

        getSubmission()

    }, [])

    useEffect(() => {
        // console.log('The charge count has changed:', count);
        // console.log("counting in accused: ",  count)
        console.log("counting in request signature: ",  count)

      }, [count]);

    return (
        <div className="px-1 mt-2 summ" >

            {indictment ?
                <>
                    <br/>
                    <button className="btn btn-primary" type="submit" disabled={loading} onClick={requestSignature}>
                        {loading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                &nbsp;Please wait...
                            </>
                        ) : (
                            "Ready to Sign"
                        )}
                        
                    </button>
                    <br/><br/>                
                </> 

                :
                <Form
                schema={summarySchema}
                uiSchema={summaryUI}
                // @ts-ignore
                validator={validator}
                formData={formData}
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
            }            

        </div>


    )

}