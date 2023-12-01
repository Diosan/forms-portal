import React, {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import AddCharge from "./AddCharge"
import ChargeList from "./ChargeList"
import PendingList from "./PendingList"

import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'

type AccusedProps = {
    accused_id: number
}

const log = (type: any) => console.log.bind(console, type)

const Accused = ({accused_id}: AccusedProps) => {

    const [accused, setAccused] = useState({})

    const [previousRecord, setPreviousRecord] = useState(false)

    const [accusedCharges, setAccusedCharges] = useState<{}[]>([])

    const [accusedPendings, setAccusedPendings] = useState<{}[]>([])

    const [accusedConvictions, setAccusedConvictions] = useState<{}[]>([])

    const [chargeSchema, setChargeSchema] = useState({})
    const [chargeUI, setChargeUI] = useState({})

    const [pendingSchema, setPendingSchema] = useState({})
    const [pendingUI, setPendingUI] = useState({})

    const [convictionSchema, setConvictionSchema] = useState({})
    const [convictionUI, setConvictionUI] = useState({})

    const [formData, setFormData] = useState({})

    const [pendingFormData, setPendingFormData] = useState({})

    const [convictionFormData, setConvictionFormData] = useState({})

    const processForm = async (form: any) => {
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
            console.log('')
            setPendingSchema(pending_form.data.schema)
            setPendingUI(pending_form.data.UI)
        })
        axios.get(API_URL + '/schema/conviction')
        .then(conviction_form => {
            setConvictionSchema(conviction_form.data.schema)
            setConvictionUI(conviction_form.data.UI)
        })



    }, []);



    useEffect( () => {

        const fetchData = async () => {
            let charges = await axios.get(API_URL + '/api/accuseds/charges/' + accused_id)            
            let accused = await axios.get(API_URL + '/api/accuseds/' + accused_id)
            let pendings = await axios.get(API_URL + '/api/accuseds/pendings/' + accused_id)
            let convictions = await axios.get(API_URL + '/api/accuseds/convictions/' + accused_id)
            if(accused.data.accused.previousCriminalRecord == 'Yes') {
                setPreviousRecord(true)
            }
            
            return { 
                accused: accused.data.accused.previousCriminalRecord,
                charges: charges.data.charges,
                pendings: pendings.data.pendings,
                convictions: convictions.data.convictions
            }
        }

        fetchData()
        .then( data => { 
            setAccusedCharges(data.charges)
            setAccusedPendings(data.pendings)
            setAccusedConvictions(data.convictions)
            setAccused(data.accused)
            
            if(previousRecord) {
                setPreviousRecord(true)
            } 
        })




    },[])

    return (
        <>
            <div className="add-charge">
                {/* <AddCharge accused_id={accused_id} accused_charges={accusedCharges} /> */}
                <Form 
                    schema={chargeSchema}
                    uiSchema={chargeUI}
                    // @ts-ignore
                    validator={validator}
                    formData={formData}
                    onSubmit={processForm}
                    onError={log('errors')}
                >
                    <div className="d-grid gap-2">
                        <button className="btn btn-secondary" type="submit">Add Charge</button>
                    </div>
                </Form>
            </div>

            <ChargeList accused_id={accused_id} accused_charges={accusedCharges} />

            { previousRecord ?
                    <>
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

            
        </>
    )
}

export default Accused

