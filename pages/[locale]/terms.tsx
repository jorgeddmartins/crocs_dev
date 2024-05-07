import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Page, { PageProps } from '@components/Page';
import PageTerms from '@components/PageTerms';
import { readCopy } from '@utils/data';
import { getStaticPathsHelper } from '@utils/page';
import { Locale } from '@utils/types';

export const getStaticProps: GetStaticProps<PageProps> = async ({
  params: { locale }
}) => {
  const copy = await readCopy(locale as Locale);

  return {
    props: {
      copy: copy,
      locale: (locale as Locale) || null
    }
  };
};

export const getStaticPaths: GetStaticPaths = getStaticPathsHelper;

const TermsScreen: NextPage<PageProps> = ({ copy, locale }) => {
  return (
    <Page copy={copy} locale={locale}>
      <PageTerms />
    </Page>
  );
};

export default TermsScreen;
