import React from 'react';
import { Form } from 'remix';
import InputText, { InputTextProps } from './InputText';

interface FormProps {
  submitLabel: string;
  ariaDescribed: string;
  input: Array<InputTextProps>
  onSubmit():any
}

const FormSubscribe = ({ submitLabel, ariaDescribed, input, onSubmit }: FormProps) => {
  return (
    <Form
      method="post"
      aria-describedby={ariaDescribed}
      className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center"
    >
      {input.map((prop) => (
        <InputText
          type={prop?.type}
          label={prop?.label}
          required={prop?.required}
          error={prop?.error}
          icon={prop?.icon}
          helper={prop?.helper}
          name={prop?.name}
          disabled={prop?.disabled}
          square={prop?.square}
          withForceIndications={prop?.withForceIndications}
          placeholder={prop?.placeholder}
          id={`"form-${prop?.label}`}
        />
      ))}

      <button
      onSubmit={onSubmit()}
        className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
        type="submit"
      >
        {submitLabel}
      </button>
    </Form>
  );
};
export default FormSubscribe;
