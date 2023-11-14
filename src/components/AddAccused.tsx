import React, { useRef, useEffect, useState } from "react"
import { addPerson } from "../store/features/personSlice"
import { useAppDispatch } from "../store/store"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import { API_URL} from "../config/api"
import axios from "axios";

const log = (type: any) => console.log.bind(console, type)



const AddAccused = () => {
  const name = useRef<string>("");
  const dispatch = useAppDispatch();

  const processForm = (form: any) => {
    console.log('Submitted form data: ', form.formData)
    dispatch(addPerson({ name: form.formData.firstName + ' ' + form.formData.lastName }))
    alert('Hurrah!');
  }

  const [accusedSchema, setAccusedSchema] = useState({})
  const [accusedUI, setAccusedUI] = useState({})
  const [chargeSchema, setChargeSchema] = useState({})
  const [chargeUI, setChargeUI] = useState({})

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
        onSubmit={processForm}
        onError={log('errors')}
    >
        <div className="progress-buttons">
            <button type="submit">Add Accused</button>
        </div>
    </Form>


  );
};

export default AddAccused;