import {useEffect, useState} from "react";
import axios from "axios";
import Form from 'react-jsonschema-form';
import validator from '@rjsf/validator-ajv8';
import '../assets/Step.css'

type StepProps = {
    isActive: boolean,
    step: number,
    title: string
}

const log = (type: any) => console.log.bind(console, type);

export const Step = ({isActive, step, title}: StepProps) => {

    const [schema, setSchema] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3000/schema')
        .then((response) => {
          setSchema(response.data)
        })
      }, []);

    if (!isActive) { 
        return null
    }

    return (
        <>


            <div className="tab" style={{display: 'block'}}><h5 className="step-title">{title}:</h5>
                {/* <div className="mb-3">
                    <input type="text" className="form-control" id="firstName" placeholder={"First Name " + step} />
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="lastName" placeholder={"Last Name " + step} />
                </div> */}

                <div className="mb-3 jud-step">
                    <Form 
                        schema={schema}
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