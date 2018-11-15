import React from 'react';
import { TextField } from '@material-ui/core';
import { Field } from 'formik';

export default function VTextField(props) {
  return <Field component={VTextFieldInner} {...props} />;
}

function VTextFieldInner({ field, form: { touched, errors }, ...props }) {
  return (
    <TextField
      {...field}
      {...props}
      error={touched[field.name] && !!errors[field.name]}
      helperText={touched[field.name] && errors[field.name]}
    />
  );
}
