import { useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { PageContext } from './Page';
import PageTutorialContent from './PageTutorialContent';
import Button from '@components/Button';
import Header from '@components/Header';

import s from './PageTutorial.module.scss';

const PageTutorial: NextPage = () => {
  const { copy } = useContext(PageContext);
  const router = useRouter();

  return (
    <section className={s.tutorialWrap}>
      <Header />
      <div className={s.layout}>
        <div className={s.contentWrap}>
          <div className={s.content}>
            <PageTutorialContent showDisclaimer />
          </div>
        </div>
        <div className={s.bottomContent}>
          <Button
            onClick={() =>
              router.push({
                pathname: '/[locale]/question/[question]',
                query: { locale: router.query.locale, question: 0 }
              })
            }
          >
            {copy('tutorial.CTA')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PageTutorial;
