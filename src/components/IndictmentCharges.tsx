import {useEffect, useState} from "react"
import { useAppSelector  } from "../store/store"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios";
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import IndictmentAccusedList from "./IndictmentAccusedList"
// import AccusedList from "./AccusedList"
import { useSelector } from "react-redux"
import Add from "./Add"
import { Provider } from "react-redux"
import { store } from "../store"
import IndictmentAddAccused from "./IndictmentAddAccused"
// import AddAccused from "./AddAccused"
import { useAppDispatch } from '../store'
import { setAccused, removeAccused, addAccused } from '../slices/accused';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import Accused from "./Accused";
import { RootState } from "../store";
import AuthService from "../services/AuthService"



type ChargesProps = {
    submission_id: number,
    request_signature: any,
    editable: boolean,
    hasAccused: any,
    preliminary_completed: boolean
}

interface Accused {
    id: number;
}

const log = (type: any) => console.log.bind(console, type)



export const IndictmentCharges = ({submission_id, request_signature, editable, hasAccused, preliminary_completed}: ChargesProps) => {

    const [accusedSchema, setAccusedSchema] = useState({})
    const [accusedUI, setAccusedUI] = useState({})
    const [chargeSchema, setChargeSchema] = useState({})
    const [chargeUI, setChargeUI] = useState({})
    const [accuseds, setAccuseds] = useState<Accused[]>([]);
    const state = useSelector((state: RootState) => state.auth);
    const { isLoggedIn, otpRequired, token, isVerified } = state

    const [showAddAccused, setShowAddAccused] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const dispatch = useAppDispatch(); // Now you have the dispatch function

    const toggleAddAccused = () => {
        setShowAddAccused(true);
        setShowAddForm(true)
    };

    const [type, setType] = useState('')
    const [accusedSaved, setAccusedSaved] = useState(false)

    const requestSignature = () => {
        // alert('Performing requestSignature in Charge component')
        request_signature()
    }

    const accusedAdded = (accused: any) => {
        setAccuseds([accused, ...accuseds])
        //dispatch_async(dispatch
        dispatch(addAccused(accused));

        if(type == 'indictment') {
            setAccusedSaved(true)
        } 
    }

    const handleAccusedRemoved = (removedAccusedId:number) => {
        setAccuseds(accuseds.filter((accused:Accused) => accused.id !== removedAccusedId));
        dispatch(removeAccused(removedAccusedId));
    };

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
            let submissions_accuseds = await axios.get(API_URL + '/api/submissions/' + submission_id,
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            console.log('submissions_accuseds: ', submissions_accuseds.data.accuseds)
            setAccuseds(submissions_accuseds?.data?.accuseds || []);
            const numAccused:any = submissions_accuseds?.data?.accuseds
            //update the parent component
            if(numAccused.length > 0 ){hasAccused(true)}else{hasAccused(false)} 
        })();
    }, []);

    useEffect(() => {
        (async () => {
            let submission = await axios.get(API_URL + "/api/submissions/" + submission_id,
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            setType(submission.data.submission.type);
            setAccuseds(submission?.data?.accuseds || []);
            const numAccused:any = submission?.data?.accuseds
            //update the parent component ---
            if(numAccused.length > 0 ){hasAccused(true)}else{hasAccused(false)} 
            
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
            <div id="anchorAccusedCharges" className="px-2 py-2 d-flex align-items-center" style={{ backgroundColor:"#444", color:"#fff", borderBottom: "1px solid #ddd" }}>
                <h5 className="fw-bold m-0 px-2 flex-grow-1 text-left">Accused and Charges</h5>
                
                <>
                    {/* <a href="#" className="small" onClick={editTitle}>Edit Title</a> */}
                    {/* <button type="button" className="btn btn-primary btn-xs"> */}
                    {/* <button style={{ color: "#fff", textDecoration: "none" }} type="button" className="btn btn-link btn-xs">
                    <FontAwesomeIcon icon={faPencilAlt} />
                    </button> */}

                </>

            </div>

            <IndictmentAccusedList 
                submission_id={submission_id} 
                request_signature={requestSignature}
                submission_accuseds={accuseds}
                editable={editable} 
                onAccusedRemoved={handleAccusedRemoved} 
            />

            {/* {editable && !accusedSaved ?
                <> */}
                    {/* { (showAddForm ) ? (
                        <AddAccused 
                        submission_id={submission_id}
                        accused_added={accusedAdded} 
                        />               
                    ):(
                        <>
                        <button className="my-4" onClick={toggleAddAccused}>Add an Accused</button>
                        </>

                    )} */}
                    <>
                        <IndictmentAddAccused
                        submission_id={submission_id}
                        accused_added={accusedAdded}
                        preliminary_completed={preliminary_completed}
                        />               
                </>
                {/* </>
              : <></>
            } */}

            



        </Provider>

    )

}