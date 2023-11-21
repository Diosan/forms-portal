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
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
    useParams,
  } from "react-router-dom"

type SignProps = {}


const log = (type: any) => console.log.bind(console, type)

export const Sign = ({}: SignProps) => {

    const { id } = useParams()

    

    const [submission, setSubmission] = useState({})

    useEffect(() => {
    //   alert('Passed URL ID is ' + id)
      axios.get(API_URL + '/api/submissions' + id)
      .then((response) => {
        // setSchema(response.data.schema)
        // setUI(response.data.UI)
      })
    }, []);

    return (
        <>

            <div className="container">

                <div id="regForm" className="fade show">
                    <h3 className='page-title'> Complaint With Oath</h3>
                </div>

                <div className="card fade show">
                    <div className="card-body">
                    <h5 className="card-title">Complainant</h5><br/> <br/>
                    <div className="text-left complainant-details">
                        <label>Name:</label> 
                        <br/><label>Agency:</label> 
                        <br/><label>Regimental Number:</label> 
                        <br/><label>Email:</label> 
                        <br/><br/><br/><a className="btn btn-secondary float-end" >Sign</a>
                    </div>
                    
                    </div>
                </div>

            </div>
        
        </>
    )

}