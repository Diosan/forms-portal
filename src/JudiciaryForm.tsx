import * as React from 'react';
import Form from 'react-jsonschema-form';
import { JSONSchema7 } from "json-schema";
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

type JudiciaryBoardProps = {}

const schema: RJSFSchema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
  },
}

const log = (type: any) => console.log.bind(console, type);

export const JudiciaryForm = ({}: JudiciaryBoardProps) => {
  return (
    <>
      <h3>Judiciary Form</h3>
      <Form 
        schema={schema}
        validator={validator}
        onChange={log('changed')}
        onSubmit={log('submitted')}
        onError={log('errors')} 
      />
    </>
  )
} 