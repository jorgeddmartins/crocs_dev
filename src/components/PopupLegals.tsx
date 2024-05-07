import { useContext } from 'react';
import { PageContext } from './Page';
import PopupLegalsCookieSettings from '@components/PopupLegalsCookieSettings';
import PopupLegalsCookies from '@components/PopupLegalsCookies';
import s from './PopupLegals.module.scss';

const PopupLegals = () => {
  const { cookies } = useContext(PageContext);
  return (
    <div className={s.wrap}>
      <div className={s.layout}>
        {!cookies.showSettings && (
          <PopupLegalsCookies
            onCookieSettings={() => cookies.setShowSettings(true)}
          />
        )}
        {cookies.showSettings && (
          <PopupLegalsCookieSettings
            onSave={() => {
              cookies.setShowSettings(false);
            }}
            onClose={() => cookies.setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PopupLegals;
