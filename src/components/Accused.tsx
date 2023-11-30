import React, {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import AddCharge from "./AddCharge"
import ChargeList from "./ChargeList"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'

type AccusedProps = {
    accused_id: number
}

const log = (type: any) => console.log.bind(console, type)

const Accused = ({accused_id}: AccusedProps) => {

    const [accusedCharges, setAccusedCharges] = useState<{}[]>([])

    const [chargeSchema, setChargeSchema] = useState({})
    const [chargeUI, setChargeUI] = useState({})
    const [formData, setFormData] = useState({})

    const processForm = async (form: any) => {
        console.log('Submitted form data: ', form.formData)
        // dispatch(addCharge({
        //     accused_id: accused_id,
        //     ICCS: 'ABC123', // form.formData.ICCS,
        //     UNODC: 'XYZ890', // form.formData.UNODC, 
        //     name: form.formData.name,
        //     count: form.formData.count // form.formData.count 
        // }))
        // alert('Hurrah!');
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

    useEffect(() => {
        // console.log('Is component reloading constantly');
        axios.get(API_URL + '/schema/charge')
        .then((response) => {
            setChargeSchema(response.data.schema)
            setChargeUI(response.data.UI)
        })
    }, []);

    useEffect( () => {

        const fetchData = async () => {
            let returned_charges = await axios.get(API_URL + '/api/accuseds/charges/' + accused_id)
            return returned_charges.data.charges
        }

        fetchData()
        .then( returned_accuseds => { 
            setAccusedCharges(returned_accuseds)
            // console.log('returned_accuseds: ', returned_accuseds) 
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
        </>
    )
}

export default Accused

