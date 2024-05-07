import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Page, { PageProps } from '@components/Page';
import PageResult from '@components/PageResult';
import { readCopy, readPersonas } from '@utils/data';
import { Locale } from '@utils/types';
import { getResultStaticPathsHelper } from '@utils/page';

export const getStaticProps: GetStaticProps<PageProps> = async ({
  params: { locale }
}) => {
  const copy = await readCopy(locale as Locale);
  const personas = await readPersonas();

  return {
    props: {
      copy: copy,
      locale: (locale as Locale) || null,
      personas
    }
  };
};

export const getStaticPaths: GetStaticPaths = getResultStaticPathsHelper;

const ResultPage: NextPage<PageProps> = ({ copy, locale, personas }) => {
  return (
    <Page copy={copy} locale={locale} personas={personas}>
      <PageResult />
    </Page>
  );
};

export default ResultPage;
