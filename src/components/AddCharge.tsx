import React, { useRef, useEffect, useState } from "react"
import { addCharge } from "../store/features/accusedSlice"
import { useAppDispatch } from "../store/store"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import { API_URL} from "../config/api"
import axios from "axios"

type ChargeProps = {
    accused_id: number
}

const log = (type: any) => console.log.bind(console, type)

const AddCharge = ({accused_id}: ChargeProps) => {
  const name = useRef<string>("")
  const dispatch = useAppDispatch();

  const processForm = async (form: any) => {
    console.log('Submitted form data: ', form.formData)
    dispatch(addCharge({
        accused_id: accused_id,
        ICCS: 'ABC123', // form.formData.ICCS,
        UNODC: 'XYZ890', // form.formData.UNODC, 
        name: form.formData.name,
        count: form.formData.count // form.formData.count 
    }))
    // alert('Hurrah!');
    setFormData({})

    let charge = {
      name: form.formData.name,
      ICCS: 'ABC123', 
      UNODC: 'XYZ890',
      counts: form.formData.count,
      accusedId: accused_id,
      particulars: form.formData.particulars
    }
    console.log('Charge: ', charge)

    await axios.post(API_URL + '/api/accuseds/charges', charge, 
    { withCredentials: true })
    .then((response) => {

      switch(response.data.outcome) {
        case 'success':
          console.log('Charge successfully saved', response.data.charge)          
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


  const [chargeSchema, setChargeSchema] = useState({})
  const [chargeUI, setChargeUI] = useState({})
  const [formData, setFormData] = useState({})


    useEffect(() => {
        console.log('Is component reloading constantly');
        axios.get(API_URL + '/schema/charge', { withCredentials: true })
        .then((response) => {
            setChargeSchema(response.data.schema)
            setChargeUI(response.data.UI)
        })
    }, []);  

  return (


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


  );
};

export default AddCharge;