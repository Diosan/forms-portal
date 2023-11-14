import {useEffect, useState} from "react";
import { API_URL} from "../config/api"
import axios from "axios";
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import Form from 'react-jsonschema-form';
import validator from '@rjsf/validator-ajv8';
// import "../assets/Submission.css"

type ComplainantProps = {}

const log = (type: any) => console.log.bind(console, type)

const processForm = (form: any) => {
    console.log('Submitted form data: ', form.formData)
    alert('Hurrah!');
}

export const Complainant = ({}: ComplainantProps) => {

    const [schema, setSchema] = useState({})
    const [UI, setUI] = useState({})

    useEffect(() => {
        axios.get(API_URL + '/schema/complainant')
        .then((response) => {
          setSchema(response.data.schema)
          setUI(response.data.UI)
        })
    }, []);

    return (

        <Form 
            schema={schema}
            uiSchema={UI}
            // @ts-ignore
            validator={validator}
            // onChange={log('changed')}
            onSubmit={processForm}
            onError={log('errors')}
        >
            <div className="progress-buttons">
                <button className="btn btn-secondary" type="submit">Next ❯</button>
            </div>
        </Form>
    )

}

