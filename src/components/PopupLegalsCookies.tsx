import { useContext } from 'react';
import { PageContext } from './Page';
import Button, { ButtonVariants } from '@components/Button';
import s from './PopupLegalsCookies.module.scss';

type PopupLegalsCookiesProps = {
  onCookieSettings: () => void;
};

const PopupLegalsCookies = ({ onCookieSettings }: PopupLegalsCookiesProps) => {
  const { copy, cookies } = useContext(PageContext);

  return (
    <div className={s.cookiesContent}>
      <h1
        className={s.title}
        dangerouslySetInnerHTML={{ __html: copy('cookies.title') }}
      />
      <div
        className={s.mainCopy}
        dangerouslySetInnerHTML={{ __html: copy('cookies.copy') }}
      />
      <Button
        onClick={() => {
          cookies.setAccepted('cookies', true);
        }}
      >
        {copy('cookies.CTA.accept')}
      </Button>
      <Button onClick={onCookieSettings} variant={ButtonVariants.SECONDARY}>
        {copy('cookies.CTA.settings')}
      </Button>
    </div>
  );
};

export default PopupLegalsCookies;
