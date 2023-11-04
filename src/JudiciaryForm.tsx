// Import Form and validator from RJSF form despite what documentation says or fails to say
import {useEffect, useState} from "react";
import Form from 'react-jsonschema-form';
import validator from '@rjsf/validator-ajv8';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { Header } from "./Header";
 

type JudiciaryBoardProps = {}






const log = (type: any) => console.log.bind(console, type);

export const JudiciaryForm = ({}: JudiciaryBoardProps) => {

  const [schema, setSchema] = useState({});
  
  useEffect(() => {
    axios.get('http://localhost:3000/schema')
    .then((response) => {
      console.log(response.data);
      setSchema(response.data);
    })
  }, []);

  return (
    // Typescript schema assignment error does not prevent porper operation of RJSF form
    <>
      <Form 
        schema={schema}
        validator={validator}
        // onChange={log('changed')}
        onSubmit={log('submitted')}
        onError={log('errors')} 
      />
    </>
  )
} 