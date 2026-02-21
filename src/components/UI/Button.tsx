import React from 'react';
import { Button as BSButton, ButtonProps as BSButtonProps } from 'react-bootstrap';

interface ButtonProps extends Omit<BSButtonProps, 'children'> {
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ loading, disabled, children, ...props }) => {
  return (
    <BSButton {...props} disabled={disabled || loading}>
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </BSButton>
  );
};
