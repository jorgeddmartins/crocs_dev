import { ReactNode } from 'react';
import s from './FormInputCheckbox.module.scss';
import { ReactComponent as Tick } from '@assets/images/tick.svg';

interface FormInputCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  children?: ReactNode;
}

const FormInputCheckbox = ({
  children,
  name,
  onChange,
  ...props
}: FormInputCheckboxProps) => {
  const localProps = Object.assign({}, props, { type: 'checkbox' });
  return (
    <label className={s.wrap}>
      <div className={s.input}>
        <input
          type="checkbox"
          name={name}
          {...localProps}
          onChange={onChange}
        />
        <Tick className={s.checkMark} />
      </div>
      <div className={s.copy}>{children}</div>
    </label>
  );
};

export default FormInputCheckbox;
