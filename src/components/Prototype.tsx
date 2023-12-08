import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import '../assets/Submission.css'
import AuthService from "../services/AuthService"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';


type NotPoliceProps = {
    new_submission: boolean
}

const log = (type: any) => console.log.bind(console, type)


export const NotPolice = ({ new_submission }:NotPoliceProps) => {

    const navigate = useNavigate()

    const auth = new AuthService

    const { id } = useParams()

    const [submissionId, setSubmissionId] = useState(0)
    const [submissionTitle, setSubmissionTitle] = useState('')
    const [submissionTitleSaved, setSubmissionTitleSaved] = useState(false)
    const [editingSubmissionTitle, setEditingSubmissionTitle] = useState(false)

    const submissionTitleChange = (event: any) => {
        setSubmissionTitle(event.target.value)
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
            uid: decoded.id
            }
            console.log('Submission is : ', submission)
            await axios.post(API_URL + '/api/submissions/update_title', submission)
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
            uid: decoded.id
            }
            axios.post(API_URL + '/api/submissions', submission)
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

    const editTitle = () => {
    setEditingSubmissionTitle(true)
    }

  

    useEffect(() => {
        (async () => {
          if (!new_submission) {
            setSubmissionId(parseInt('' + id))
            let returned_submission = await axios.get(API_URL + '/api/submissions/' + id)
          } else {

          }
        })
    }, []);

    return (

        <div className="d-flex">

            {auth.loggedIn() ?
                    <>
                        <div className="swf-container container"
                            style={{ borderRadius: "5px", maxWidth: "900px", padding: "20px 40px", margin: "10px 30px 30px 300px", flexGrow: 1 }}
                        >

                            <div id="regForm" className="fade show m-0 py-0">
                                <div>
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
                                            <label className="control-label fs-6">
                                                Edit Submission Title
                                            </label>

                                            <div className="d-flex mt-2">
                                                <input
                                                className="form-control fs-5 mt-0 mb-0 flex-grow-1"
                                                type="text"
                                                value={submissionTitle}
                                                onChange={submissionTitleChange}
                                                />
                                                <button
                                                type="submit"
                                                className="btn btn-md btn-light ms-1" // Use btn-light for a button with no background
                                                >
                                                <i className="text-gray">
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </i>
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
                            </div>

                        </div>
                        
                    </>
                
                : 
                    <>
                        <h3>You are NOT logged in</h3>
                    </>
            }


        </div>
        
    )


}
