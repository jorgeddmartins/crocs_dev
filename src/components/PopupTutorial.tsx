import classnames from 'classnames';

import PageTutorialContent from './PageTutorialContent';

import { ReactComponent as CloseIcon } from '@assets/images/iconclose.svg';
import s from './PopupTutorial.module.scss';

type PopupTutorialProps = {
  show: boolean;
  onClose: () => void;
};

const PopupTutorial = ({ show, onClose }: PopupTutorialProps) => {
  return (
    <div
      className={classnames({
        [s.container]: true,
        [s.show]: show
      })}
    >
      <div className={s.overlay} onClick={onClose} />
      <div className={s.popup}>
        <CloseIcon className={s.closeIcon} onClick={onClose} />
        <PageTutorialContent />
      </div>
    </div>
  );
};

export default PopupTutorial;
