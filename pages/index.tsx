import type { NextPage, GetStaticProps } from 'next';

import Page from '@components/Page';
import PageLanguage from '@components/PageLanguage';
import { readCopy } from '@utils/data';
import { Locale } from '@utils/types';

type HomeProps = {
  copy: Record<string, string>;
  locale: Locale;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const locale = 'en_GB' as Locale;
  const copy = await readCopy(locale);

  return {
    props: {
      copy,
      locale
    }
  };
};

const HomePage: NextPage = ({ copy, locale }: HomeProps) => {
  return (
    <Page copy={copy} locale={locale}>
      <PageLanguage />
    </Page>
  );
};

export default HomePage;
