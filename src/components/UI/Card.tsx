import React from 'react';
import { Card as BSCard, CardProps } from 'react-bootstrap';

interface CustomCardProps extends CardProps {
  children: React.ReactNode;
  title?: string;
}

export const Card: React.FC<CustomCardProps> = ({ title, children, className = '', ...props }) => {
  const defaultClasses = 'border-0 shadow-sm rounded-3';
  
  return (
    <BSCard {...props} className={`${defaultClasses} ${className}`}>
      {title && (
        <BSCard.Header className="bg-white border-0 pb-0">
          <BSCard.Title className="fw-bold text-dark mb-0">{title}</BSCard.Title>
        </BSCard.Header>
      )}
      <BSCard.Body>{children}</BSCard.Body>
    </BSCard>
  );
};
