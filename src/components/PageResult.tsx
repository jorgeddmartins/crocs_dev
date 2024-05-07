import type { NextPage } from 'next';

import Header from '@components/Header';
import ResultRevealer from './ResultRevealer';

import s from './PageResult.module.scss';

const PageResult: NextPage = () => {
  return (
    <section className={s.resultWrap}>
      <div className={s.header}>
        <Header hasBackButton />
      </div>
      <ResultRevealer />
    </section>
  );
};

export default PageResult;
