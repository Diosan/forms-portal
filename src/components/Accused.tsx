import React, {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import AddCharge from "./AddCharge"
import ChargeList from "./ChargeList"
import PendingList from "./PendingList"

import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faPencilAlt, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';


type AccusedProps = {
    accused_id: number,
    request_signature: any,
    editable: boolean 
}



const log = (type: any) => console.log.bind(console, type)

const Accused = ({accused_id, request_signature, editable}: AccusedProps) => {

    const { submission_id } = useParams()

    const navigate = useNavigate()

    const [accused, setAccused] = useState({})

    const [previousRecord, setPreviousRecord] = useState(false)

    const [relatedMatters, setRelatedMatters] = useState(false)

    const [accusedCharges, setAccusedCharges] = useState<{}[]>([])

    const [accusedPendings, setAccusedPendings] = useState<{}[]>([])

    const [accusedRelateds, setAccusedRelateds] = useState<{}[]>([])

    const [accusedConvictions, setAccusedConvictions] = useState<{}[]>([])

    const [chargeSchema, setChargeSchema] = useState({})
    const [chargeUI, setChargeUI] = useState({})

    const [pendingSchema, setPendingSchema] = useState({})
    const [pendingUI, setPendingUI] = useState({})

    const [convictionSchema, setConvictionSchema] = useState({})
    const [convictionUI, setConvictionUI] = useState({})

    const [relatedSchema, setRelatedSchema] = useState({})
    const [relatedUI, setRelatedUI] = useState({})

    const [formData, setFormData] = useState({})

    const [pendingFormData, setPendingFormData] = useState({})

    const [convictionFormData, setConvictionFormData] = useState({})

    const [relatedFormData, setRelatedFormData] = useState({})

    const [showAddNewCharge, setShowAddNewCharge] = useState(false)

    const [codes, setCodes] = useState<{}[]>([])

    const addNewCharge = async () => {
        setShowAddNewCharge(true)
    }



    const processForm = async (form: any) => {

        setShowAddNewCharge(false)

        console.log('Submitted form data: ', form.formData)

        setFormData({})
    
        let charge = {
          name: form.formData.name,
          ICCS: 'ABC123', 
          UNODC: 'XYZ890',
          counts: form.formData.count,
          accusedId: accused_id,
          dateOfOffence: form.formData.dateOfOffence,
          particulars: form.formData.particulars
        }
    
        await axios.post(API_URL + '/api/accuseds/charges', charge)
        .then((response) => {
    
          switch(response.data.outcome) {
            case 'success':
              console.log('Charge successfully saved', response.data.charge)
              setAccusedCharges([response.data.charge, ...accusedCharges]) //response.data.charge
            //   navigate('/submission/' + submission_id)
            //   window.location.reload()   
              request_signature()        
              break
            case 'error':
              console.log('Error saving charge')
              break
            default:
              console.log('Unknown accused save outcome')
              break
          }
    
        })
        
    }


    // const addPending = async (form: any) => {
    //     // console.log('Submitted form data: ', form.formData)

    //     // let pending= {
    //     //     offence: form.formData.offence,
    //     //     dateOfOffence: form.formData.dateOfOffence,
    //     //     accusedId: accused_id
    //     // }

    // }

    const addPending = async (form: any) => {
        console.log('Submitted form data: ', form.formData)

        let pending= {
            offence: form.formData.offence,
            dateOfOffence: form.formData.dateOfOffence,
            accusedId: accused_id
        }

        await axios.post(API_URL + '/api/accuseds/pendings', pending)
        .then((response) => {
    
            switch(response.data.outcome) {
              case 'success':
                console.log('Pending successfully saved', response.data.pending)
                setAccusedPendings([response.data.pending, ...accusedPendings]) //response.data.charge          
                break
              case 'error':
                console.log('Error saving pending')
                break
              default:
                console.log('Unknown pending save outcome')
                break
            }
      
        })


    }


    const addRelated = async (form: any) => {
        console.log('Submitted form data: ', form.formData)

        let related= {
            offence: form.formData.offence,
            dateOfOffence: form.formData.dateOfOffence,
            accusedId: accused_id
        }

        await axios.post(API_URL + '/api/accuseds/relateds', related)
        .then((response) => {
    
            switch(response.data.outcome) {
              case 'success':
                console.log('Pending successfully saved', response.data.related)
                setAccusedRelateds([response.data.related, ...accusedRelateds]) //response.data.charge          
                break
              case 'error':
                console.log('Error saving pending')
                break
              default:
                console.log('Unknown pending save outcome')
                break
            }
      
        })


    }


    // const addConviction = async (form: any) => {}

    const addConviction = async (form: any) => {
        console.log('Submitted form data: ', form.formData)

        let conviction= {
            offence: form.formData.offence,
            dateOfOffence: form.formData.dateOfOffence,
            sentence: form.formData.sentence,
            accusedId: accused_id
        }

        await axios.post(API_URL + '/api/accuseds/convictions', conviction)
        .then((response) => {
    
            switch(response.data.outcome) {
              case 'success':
                console.log('Pending successfully saved', response.data.conviction)
                setAccusedConvictions([response.data.conviction, ...accusedConvictions]) //response.data.charge          
                break
              case 'error':
                console.log('Error saving conviction')
                break
              default:
                console.log('Unknown conviction save outcome')
                break
            }
      
        })        
    }

    useEffect(() => {
        // console.log('Is component reloading constantly');
        axios.get(API_URL + '/schema/charge')
        .then((response) => {
            setChargeSchema(response.data.schema)
            setChargeUI(response.data.UI)
        });

        axios.get(API_URL + '/schema/pending')
        .then(pending_form => {
            setPendingSchema(pending_form.data.schema)
            setPendingUI(pending_form.data.UI)
        })
        axios.get(API_URL + '/schema/conviction')
        .then(conviction_form => {
            setConvictionSchema(conviction_form.data.schema)
            setConvictionUI(conviction_form.data.UI)
        })
        axios.get(API_URL + '/schema/related_matter')
        .then(conviction_form => {
            setRelatedSchema(conviction_form.data.schema)
            setRelatedUI(conviction_form.data.UI)
        })



    }, []);



    useEffect( () => {

        const fetchData = async () => {
            let charges = await axios.get(API_URL + '/api/accuseds/charges/' + accused_id)            
            let accused = await axios.get(API_URL + '/api/accuseds/' + accused_id)
            let pendings = await axios.get(API_URL + '/api/accuseds/pendings/' + accused_id)
            let convictions = await axios.get(API_URL + '/api/accuseds/convictions/' + accused_id)
            let relateds = await axios.get(API_URL + '/api/accuseds/relateds/' + accused_id)
            if(accused.data.accused.previousCriminalRecord == 'Yes') {
                setPreviousRecord(true)
            }
            
            return { 
                accused: accused.data.accused.previousCriminalRecord,
                charges: charges.data.charges,
                pendings: pendings.data.pendings,
                convictions: convictions.data.convictions,
                relateds: relateds.data.relateds
            }
        }

        fetchData()
        .then( data => { 
            setAccusedCharges(data.charges)
            setAccusedPendings(data.pendings)
            setAccusedConvictions(data.convictions)
            setAccusedRelateds(data.relateds)
            setAccused(data.accused)
            
            if(previousRecord) {
                setPreviousRecord(true)
            } 
        })




    },[])


    useEffect(() => {
        (async () => {
            let returned_codes = await axios.get(API_URL + '/api/submissions/codes/1')
            setCodes(returned_codes.data.charge_codes)
        })();
    }, []);

    return (
        <>
            


            <ChargeList accused_id={accused_id} accused_charges={accusedCharges} />

            {   previousRecord ?
                    <>
                        { editable ?
                            <div className="add-charge">
                                <Form 
                                    schema={pendingSchema}
                                    uiSchema={pendingUI}
                                    // @ts-ignore
                                    validator={validator}
                                    formData={pendingFormData}
                                    onSubmit={addPending}
                                    onError={log('errors')}
                                >
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-secondary" type="submit">Add Pending</button>
                                    </div>
                                </Form> 

                                                    
                            </div>
                            : <></>
                        }

                        <table className="charge-table">
                            <thead>
                                <tr>
                                    <th>Pending Offence</th>
                                    <th>Date Of Offence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accusedPendings.map((pending: any) => (
                                    <tr key={pending.id}>
                                        <td>{pending.offence}</td>
                                        <td>{pending.dateOfOffence}</td>
                                    </tr>
                                ))} 
                            </tbody>
                        </table>

                        { editable ?
                            <div className="add-charge">
                            <Form 
                                schema={convictionSchema}
                                uiSchema={convictionUI}
                                // @ts-ignore
                                validator={validator}
                                formData={convictionFormData}
                                onSubmit={addConviction}
                                onError={log('errors')}
                            >
                                <div className="d-grid gap-2">
                                    <button className="btn btn-secondary" type="submit">Add Conviction</button>
                                </div>
                            </Form>                        
                            </div>
                            : <></>
                        }

                        <table className="charge-table">
                            <thead>
                                <tr>
                                    <th>Conviction Offence</th>
                                    <th>Date Of Offence</th>
                                    <th>Sentence</th>
                                </tr>
                            </thead>
                            <tbody>
                            {accusedConvictions.map((conviction: any) => (
                                <tr key={conviction.id}>
                                    <td>{conviction.offence}</td>
                                    <td>{conviction.dateOfOffence}</td>
                                    <td>{conviction.sentence}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                : 
                    <></>
            }

            {   relatedMatters ?
                    <>
                        { editable ?
                            <div className="add-charge">
                                <Form 
                                    schema={relatedSchema}
                                    uiSchema={relatedUI}
                                    // @ts-ignore
                                    validator={validator}
                                    formData={pendingFormData}
                                    onSubmit={addRelated}
                                    onError={log('errors')}
                                >
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-secondary" type="submit">Add Pending</button>
                                    </div>
                                </Form> 

                                                    
                            </div>
                            : <></>
                        }

                        <table className="charge-table">
                            <thead>
                                <tr>
                                    <th>Related Offence</th>
                                    <th>Date Of Offence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accusedRelateds.map((related: any) => (
                                    <tr key={related.id}>
                                        <td>{related.offence}</td>
                                        <td>{related.dateOfOffence}</td>
                                    </tr>
                                ))} 
                            </tbody>
                        </table>                        
                    </>
                :
                    <></>
            }

            
            { editable ?
                <div className="add-charge px-4 pt-2 pb-2" style={{backgroundColor:"#eee"}}>
                    {/* <div>Add New Charge</div> */}
                    { !showAddNewCharge && 
                        <button className="btn btn-link btn-xs" 
                        style={{  textDecoration: "none" }} onClick={addNewCharge} 
                        type="button">
                            <FontAwesomeIcon icon={faPlus} /> New Charge
                        </button>
                    }

                    {/* <AddCharge accused_id={accused_id} accused_charges={accusedCharges} /> */}
                    { showAddNewCharge &&

                        <>  
                            <br/><br/>
                            <div className="form-group field field-string">                  
                                    <label className="control-label">Charge Code</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        list="fruitlist" />
                                    <datalist id="fruitlist">
                                        {codes.map((code:any) => (
                                            <option value={code.UNODC} key={code.id}>
                                                {code.name}
                                            </option>
                                        ))}
                                    </datalist>
                                
                            </div>

                            <Form 
                                schema={chargeSchema}
                                uiSchema={chargeUI}
                                // @ts-ignore
                                validator={validator}
                                formData={formData}
                                onSubmit={processForm}
                                onError={log('errors')}
                            >
                                <div className="">
                                    <button className="btn btn-secondary" type="submit">Save Charge</button>
                                </div>
                            </Form>
                        </> 
                    }           
                </div>
                : <></>
            }

        </>
    )
}

export default Accused

