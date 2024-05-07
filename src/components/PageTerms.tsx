import { useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { PageContext } from './Page';
import Button from '@components/Button';
import Header from '@components/Header';

import s from './PageTerms.module.scss';

const PageTutorial: NextPage = () => {
  const { copy } = useContext(PageContext);
  const router = useRouter();

  return (
    <section className={s.termsWrap}>
      <Header />
      <div className={s.contenWrap}>
        <div className={s.content}>
          <h2>{copy('terms.title')}</h2>
          <div dangerouslySetInnerHTML={{ __html: copy('terms.copy') }} />
        </div>
        <div className={s.bottomContent}>
          <Button
            onClick={() => {
              router.push({
                pathname: '/[locale]/tutorial',
                query: { locale: router.query.locale }
              });
            }}
          >
            {copy('terms.CTA')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PageTutorial;
