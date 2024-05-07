import cx from 'classnames';
import { ReactNode } from 'react';
import s from './Button.module.scss';

export enum ButtonVariants {
  DISABLED = 'disabled',
  DARK = 'dark',
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariants;
}

const Button = ({
  variant = ButtonVariants.PRIMARY,
  className,
  children,
  ...props
}: ButtonProps) => {
  const buttonStyles = cx(
    {
      [s.button]: true,
      [s.disabled]: variant === ButtonVariants.DISABLED,
      [s.dark]: variant === ButtonVariants.DARK,
      [s.secondary]: variant === ButtonVariants.SECONDARY
    },
    className
  );
  return (
    <button className={buttonStyles} {...props}>
      {children}
    </button>
  );
};

export default Button;
