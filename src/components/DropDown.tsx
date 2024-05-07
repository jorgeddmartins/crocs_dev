import { useMemo } from 'react';
import s from './DropDown.module.scss';

import { Locale } from '@utils/types';

import { ReactComponent as UkFlag } from '@assets/images/uk.svg';
import { ReactComponent as FrFlag } from '@assets/images/fr.svg';
import { ReactComponent as DeFlag } from '@assets/images/de.svg';

interface DropDownProps {
  value: string;
  options: { label: string; value: string }[];
  onChange: (newValue: string) => void;
}

const DropDown = ({ value, options, onChange, ...props }: DropDownProps) => {
  const flag = useMemo(() => {
    switch (value) {
      case Locale.ENGLISH:
        return <UkFlag />;
      case Locale.FRENCH:
        return <FrFlag />;
      case Locale.GERMAN:
        return <DeFlag />;
      default:
        return null;
    }
  }, [value]);

  return (
    <label className={s.dropDownWrap} {...props}>
      <span className={s.arrow}></span>
      <select onChange={evt => onChange(evt.target.value)} value={value}>
        {options.map(opt => (
          <option value={opt.value} key={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {flag && <div className={s.flag}>{flag}</div>}
    </label>
  );
};

export default DropDown;
