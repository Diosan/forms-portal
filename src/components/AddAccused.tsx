import React, { useRef, useEffect, useState } from "react"
import { addAccused } from "../store/features/accusedSlice"
import { useAppDispatch } from "../store/store"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import { API_URL} from "../config/api"
import axios from "axios"

type AddAccusedProps = {
  submission_id: number
}

const log = (type: any) => console.log.bind(console, type)


const AddAccused = ({submission_id}: AddAccusedProps) => {
  const name = useRef<string>("")
  const dispatch = useAppDispatch();

  const processForm = (form: any) => {
    console.log('Submitted form data: ', form.formData)
    dispatch(addAccused({ 
        name: form.formData.firstName + ' ' + form.formData.lastName,
        address: form.formData.address 
    }))
    // alert('Hurrah!');
    setFormData({})
    
  }

  const [accusedSchema, setAccusedSchema] = useState({})
  const [accusedUI, setAccusedUI] = useState({})
  const [chargeSchema, setChargeSchema] = useState({})
  const [chargeUI, setChargeUI] = useState({})
  const [formData, setFormData] = useState({})

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

  return (
    // <div className="border rounded-md p-2 shadow-md m-2">
    //   <label htmlFor="">Person Name:</label>
    //   <input
    //     className="border rounded-md p-2 mx-2"
    //     onChange={(e) => (name.current = e.target.value)}
    //   />
    //   <button
    //     onClick={() => dispatch(addPerson({ name: name.current }))}
    //     className="bg-violet-500  text-white rounded-md px-4 py-2 cursor-pointer hover:bg-violet-600 active:bg-violet-700"
    //   >
    //     Add
    //   </button>
    // </div>

    <Form 
        schema={accusedSchema}
        uiSchema={accusedUI}
        // @ts-ignore
        validator={validator}
        formData={formData}
        onSubmit={processForm}
        onError={log('errors')}
    >
        <div className="d-grid gap-2">
            <button className="btn btn-secondary" type="submit">Add Accused</button>
        </div>
    </Form>


  );
};

export default AddAccused;