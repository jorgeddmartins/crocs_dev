import { useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@components/Button';
import Dropdown from '@components/DropDown';
import s from './PageLanguage.module.scss';
import { PageContext } from './Page';
import { Locale } from '@utils/types';

const PageLanguage = () => {
  const { copy } = useContext(PageContext);
  const router = useRouter();

  const getLanguage = (lang: string) => {
    for (const [, value] of Object.entries(Locale)) {
      if (value.indexOf(`${lang}_`) > -1) {
        return value;
      }
    }
  };

  const [language, setLanguage] = useState(() => {
    const supported = Object.values(Locale).map(key => key.substring(0, 2));
    const browserLang =
      typeof window === 'undefined' ? 'en' : window.navigator.language;
    const lang = getLanguage(browserLang.substring(0, 2));
    return supported.includes(lang) ? lang : Locale.ENGLISH;
  });

  const languages = useMemo(() => {
    return Object.values(Locale).map(key => ({
      label: copy(`language.dropdown.${key}`),
      value: key
    }));
  }, [copy]);

  const submit = useCallback(() => {
    router.push({
      pathname: '/[locale]',
      query: {
        ...router.query,
        locale: language
      }
    });
  }, [router, language]);

  return (
    <section className={s.languageWrap}>
      <div className={s.content}>
        <h2>{copy('language.title')}</h2>
        <p>{copy('language.copy')}</p>
        <Dropdown
          value={language}
          options={languages}
          onChange={newVal => setLanguage(newVal as Locale)}
        />
        <Button onClick={submit}>{copy('language.CTA')}</Button>
      </div>
    </section>
  );
};

export default PageLanguage;
