import React from 'react';
import { Form } from 'react-bootstrap';

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  containerClassName = '',
  icon,
  id,
  ...props
}) => {
  const inputId = id || props.name || label;

  return (
    <Form.Group className={`mb-3 ${containerClassName}`}>
      <Form.Label htmlFor={inputId} className="fw-500 pb-2">
        {label}
      </Form.Label>
      <div className="input-group">
        {icon && (
          <span className="input-group-text bg-light border-end-0 rounded-start-2 text-muted">
            {icon}
          </span>
        )}
        <Form.Control
          id={inputId}
          isInvalid={!!error}
          className={`rounded-2 ${icon ? 'border-start-0 rounded-start-0' : ''}`}
          {...(props as any)}
        />
      </div>
      {error && <Form.Control.Feedback type="invalid" className="d-block">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};
