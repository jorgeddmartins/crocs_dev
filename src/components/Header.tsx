import { useRouter } from 'next/router';

import { ReactComponent as Logo } from '../assets/images/logo.svg';
import { ReactComponent as Back } from '../assets/images/back.svg';
import { ReactComponent as Info } from '../assets/images/info.svg';

import s from './Header.module.scss';

type HeaderProps = {
  hasBackButton?: boolean;
  onBack?: () => void;
  hasInfoButton?: boolean;
  onInfo?: () => void;
};

const Header = ({
  hasBackButton,
  onBack,
  hasInfoButton,
  onInfo
}: HeaderProps) => {
  const router = useRouter();

  return (
    <header className={s.header}>
      <nav className={s.nav}>
        {hasBackButton ? (
          <Back className={s.back} onClick={onBack || router.back} />
        ) : (
          <div className={s.back} />
        )}
        <Logo className={s.logo} />
        {hasInfoButton ? (
          <Info className={s.info} onClick={onInfo} />
        ) : (
          <div className={s.info} />
        )}
      </nav>
    </header>
  );
};

export default Header;
