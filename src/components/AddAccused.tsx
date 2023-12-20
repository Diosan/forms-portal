import React, { useRef, useEffect, useState } from "react"
import { addAccused } from "../store/features/accusedSlice"
import { useAppDispatch } from "../store/store"
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import '../assets/Accused.css'
import { Navigate, useNavigate, useParams } from "react-router-dom"

type AddAccusedProps = {
  submission_id: number,
  accused_added: any
}



const log = (type: any) => console.log.bind(console, type)



const AddAccused = ({submission_id, accused_added}: AddAccusedProps) => {

  const navigate = useNavigate()
   
  const name = useRef<string>("")
  const dispatch = useAppDispatch();

  const processForm = async (form: any) => {
    goToAnchor();
    console.log('Submitted form data: ', form.formData)
    dispatch(addAccused({ 
        name: form.formData.firstName + ' ' + form.formData.lastName,
        address: form.formData.address 
    }))
    // alert('Hurrah!');
    setFormData({})

    let accused = {
      firstName: form.formData.firstName,
      lastName: form.formData.lastName,
      middleName: form.formData.middleName,
      address: '',
      addressLine1: form.formData.addressLine1,
      addressLine2: form.formData.addressLine2,
      addressLine3: form.formData.addressLine3,
      cityTown: form.formData.cityTown,
      postalCode: form.formData.postalCode,
      communityCode: form.formData.communityCode,
      countryCode: form.formData.countryCode,
      countryName: form.formData.countryCode,
      submissionId: submission_id,
      email: form.formData.email,
      dateOfBirth: form.formData.dateOfBirth,
      aproximateAge: form.formData.aproximateAge,
      gender: form.formData.gender,
      adulthood: form.formData.adulthood,
      tntNational: form.formData.tntNational,
      tntResident: form.formData.tntResident,
      otherNational: form.formData.otherNational,
      otherResident: form.formData.otherResident,
      otherNationalCountry: '',
      otherResidentCountry: '',
      identification: form.formData.identification,
      identificationType: form.formData.identificationType,
      previousCriminalRecord: form.formData.previousCriminalRecord,
      relatedMatters: form.formData.relatedMatters,
      alias: form.formData.alias
    }

    await axios.post(API_URL + '/api/submissions/save_accused', accused)
    .then((response) => {

      switch(response.data.outcome) {
        case 'success':
          console.log('Accused successfully saved', response.data.accused)
          console.log('Redirection to submissions view with id ' + submission_id)
          // navigate('/submission/' + submission_id)
          // window.location.reload()
          accused_added(response.data.accused)      
          break
        case 'error':
          console.log('Error saving accused')
          break
        default:
          console.log('Unknown accused save outcome')
          break
      }

    })
    
  }
  const [accusedSchema, setAccusedSchema] = useState({})
  const [accusedUI, setAccusedUI] = useState({})
  const [chargeSchema, setChargeSchema] = useState({})
  const [chargeUI, setChargeUI] = useState({})
  const [formData, setFormData] = useState({})

    useEffect(() => {
        axios.get(API_URL + '/schema/accused')
        .then((response) => {
          console.log(response.data)
        setAccusedSchema(response.data.schema)
        setAccusedUI(response.data.UI)
        })
    }, []);

    const goToAnchor = () => {
      setTimeout(() => {
          console.log('Anchor');
          const anchorElement = document.getElementById('anchorAccusedCharges');
          if (anchorElement) {
              anchorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }, 300); // 500 milliseconds delay
  }

    // useEffect(() => {
    //     axios.get(API_URL + '/schema/charge')
    //     .then((response) => {
    //         setChargeSchema(response.data.schema)
    //         setChargeUI(response.data.UI)
    //     })
    // }, []);  

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
