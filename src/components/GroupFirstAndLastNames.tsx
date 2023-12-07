import React from 'react';
import Form from '@rjsf/core';

const GroupField = ({ properties:any, title }) => (
  <div className={title}>
    {properties.map(prop => prop.content)}
  </div>
);

const fields = {
  layout: GroupField
};

const MyForm = () => (
  <Form 
    schema={yourJsonSchema} 
    uiSchema={yourUiSchema} 
    fields={fields} 
  />
);

export default MyForm;
