import {useEffect, useState} from "react"
import { useAppSelector  } from "../store/store"
import { API_URL} from "../config/api"
import axios from "axios";
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import AccusedList from "./AccusedList"
import Add from "./Add"
import { Provider } from "react-redux"
import { store } from "../store/store"
import AddAccused from "./AddAccused";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';

type ChargesProps = {
    submission_id: number,
    request_signature: any,
    editable: boolean
}

const log = (type: any) => console.log.bind(console, type)

const processForm = (form: any) => {
    console.log('Submitted form data: ', form.formData)
    alert('Hurrah!');
}

export const Charges = ({submission_id, request_signature, editable}: ChargesProps) => {

    const [accusedSchema, setAccusedSchema] = useState({})
    const [accusedUI, setAccusedUI] = useState({})
    const [chargeSchema, setChargeSchema] = useState({})
    const [chargeUI, setChargeUI] = useState({})
    const [accuseds, setAccuseds] = useState<{}[]>([])

    const requestSignature = () => {
        // alert('Performing requestSignature in Charge component')
        request_signature()
    }

    const accusedAdded = (accused: any) => {
        setAccuseds([accused, ...accuseds])
    }



    useEffect(() => {
        axios.get(API_URL + '/schema/accused')
        .then((response) => {
          setAccusedSchema(response.data.schema)
          setAccusedUI(response.data.UI)
        })
    }, []);

    useEffect(() => {
        axios.get(API_URL + '/schema/charge')
        .then((response) => {
          setChargeSchema(response.data.schema)
          setChargeUI(response.data.UI)
        })
    }, []);

    useEffect(() => {
        (async () => {
            // console.log('submission_id in Charges component: ', submission_id)
            let submissions_accuseds = await axios.get(API_URL + '/api/submissions/' + submission_id)
            // console.log('submissions_accuseds: ', submissions_accuseds.data.accuseds)
            setAccuseds(submissions_accuseds.data.accuseds)
            // console.log('accuseds: ', accuseds)
        })();
    }, []);

    return (
        <Provider store={store}>

            {/* <Form 
                schema={accusedSchema}
                uiSchema={accusedUI}
                // @ts-ignore
                validator={validator}
                onSubmit={processForm}
                onError={log('errors')}
            >
                <div className="progress-buttons">
                    <button type="submit">Add Accused</button>
                </div>
            </Form> */}
            <div className="px-2 py-2 d-flex align-items-center" style={{ backgroundColor:"#444", color:"#fff", borderBottom: "1px solid #ddd" }}>
                <h5 className="fw-bold m-0 px-2 flex-grow-1 text-left">Accused and Charges</h5>
                
                <>
                    {/* <a href="#" className="small" onClick={editTitle}>Edit Title</a> */}
                    {/* <button type="button" className="btn btn-primary btn-xs"> */}
                    {/* <button style={{ color: "#fff", textDecoration: "none" }} type="button" className="btn btn-link btn-xs">
                    <FontAwesomeIcon icon={faPencilAlt} />
                    </button> */}

                </>

            </div>

            <AccusedList 
                submission_id={submission_id} 
                request_signature={requestSignature}
                submission_accuseds={accuseds}
                editable={editable} 
            />

            {editable?
                <AddAccused 
                    submission_id={submission_id}
                    accused_added={accusedAdded}                  
                />
              : <></>
            }

            



        </Provider>

    )

}