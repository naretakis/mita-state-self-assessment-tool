import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * Button component for common actions
 * Uses CMS Design System button classes for consistency
 */
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const baseClass = 'ds-c-button';

  const variantClass = {
    primary: 'ds-c-button--primary',
    secondary: 'ds-c-button--transparent',
    outline: 'ds-c-button--transparent',
  }[variant];

  const classes = [baseClass, variantClass, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      data-testid="button"
    >
      {label}
    </button>
  );
};

export default Button;
