import React from "react";
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import Form from 'react-jsonschema-form';
import validator from '@rjsf/validator-ajv8';
import '../assets/Step.css'
const API_URL = import.meta.env.VITE_API_URL;

type StepProps = {
    isActive: boolean,
    step: number,
    title: string//,
    // myRef: typeof React.createRef
}

const log = (type: any) => console.log.bind(console, type);

export const Step = ({isActive, step, title}: StepProps) => {

    const formElement = useRef<HTMLFormElement>(null)
    const [schema, setSchema] = useState({})
    const [UI, setUI] = useState({})

    const testRef = () => {
        // alert('Button works')
        formElement.current?.requestSubmit
    }

    useEffect(() => {
        axios.get(`${API_URL}/schema/` + step)
        .then((response) => {
          setSchema(response.data.schema)
          setUI(response.data.UI)
        })
      }, []);

    if (!isActive) { 
        return null
    }

    return (
        <>

            <a id="refSubmit" 
                className="btn btn-success" 
                onClick={testRef} 
            >
                Test Ref ❯
            </a>

            <div className="tab" style={{display: 'block'}}><h5 className="step-title">{title}:</h5>
                {/* <div className="mb-3">
                    <input type="text" className="form-control" id="firstName" placeholder={"First Name " + step} />
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="lastName" placeholder={"Last Name " + step} />
                </div> */}

                {/* <form ref={formElement}>

                </form> */}

                <div className="mb-3 jud-step">
                    <Form 
                        schema={schema}
                        uiSchema={UI}
                        // @ts-ignore
                        ref={formElement}
                        validator={validator}
                        // onChange={log('changed')}
                        onSubmit={log('submitted')}
                        onError={log('errors')} 
                    />
                </div>

            </div>

        </>
    )
}