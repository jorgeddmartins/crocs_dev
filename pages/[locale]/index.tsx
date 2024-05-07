import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Page, { PageProps } from '@components/Page';
import PageSplash from '@components/PageSplash';
import { readCopy } from '@utils/data';
import { Locale } from '@utils/types';
import { getStaticPathsHelper } from '@utils/page';

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

const SplashPage: NextPage<PageProps> = ({ copy, locale }) => {
  return (
    <Page copy={copy} locale={locale}>
      <PageSplash />
    </Page>
  );
};

export default SplashPage;
