// Import Form and validator from RJSF form despite what documentation says or fails to say
import Form from 'react-jsonschema-form';
import validator from '@rjsf/validator-ajv8';

type JudiciaryBoardProps = {}

const schema = {
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
    // Typescript schema assignment error does not prevent porper operation of RJSF form
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