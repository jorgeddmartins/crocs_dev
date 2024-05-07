import { useContext, useState } from 'react';
import { PageContext } from './Page';
import Button from '@components/Button';
import s from './PopupLegalsCookieSettings.module.scss';
import FormInputCheckbox from './FormInputCheckbox';

type PopupLegalsCookieSettingProps = {
  value: boolean;
  title: string;
  copy: string;
  onChange?: (newValue: boolean) => void;
  disabled?: boolean;
};

const PopupLegalsCookieSetting = ({
  value,
  title,
  copy,
  onChange
}: // disabled
PopupLegalsCookieSettingProps) => {
  return (
    <div className={s.dataChecks}>
      <h4>{title}</h4>
      <div className={s.message}>
        <FormInputCheckbox
          checked={value}
          onChange={() => {
            if (onChange) onChange(!value);
          }}
        >
          <p>{copy}</p>
        </FormInputCheckbox>
      </div>
    </div>
  );
};

type PopupLegalsCookieSettingsProps = {
  onSave: () => void;
  onClose?: () => void;
};

const PopupLegalsCookieSettings = ({
  onSave
}: PopupLegalsCookieSettingsProps) => {
  const { copy, cookies } = useContext(PageContext);
  const [hasAcceptedAnalytics, setHasAcceptedAnalytics] = useState(true);

  return (
    <div className={s.wrap}>
      <div className={s.wrapContainer}>
        <div className={s.content}>
          <h1>{copy('cookies.settings.title')}</h1>
          <div
            className={s.contentInner}
            dangerouslySetInnerHTML={{
              __html: copy('cookies.settings.copy')
            }}
          />
          <div className={s.settingsContent}>
            <PopupLegalsCookieSetting
              title={copy('cookies.settings.functional.title')}
              copy={copy('cookies.settings.functional.copy')}
              value={true}
              disabled={true}
            />

            <PopupLegalsCookieSetting
              title={copy('cookies.settings.analytics.title')}
              copy={copy('cookies.settings.analytics.copy')}
              value={hasAcceptedAnalytics}
              onChange={newVal => {
                setHasAcceptedAnalytics(newVal);
              }}
            />
          </div>
        </div>
        <div className={s.bottomContent}>
          <Button
            onClick={() => {
              cookies.setAccepted('functional', true);
              cookies.setAccepted('analytics', hasAcceptedAnalytics);
              onSave();
            }}
          >
            {copy('cookies.settings.CTA')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupLegalsCookieSettings;
