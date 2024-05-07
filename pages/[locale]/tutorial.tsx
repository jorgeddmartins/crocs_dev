import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Page, { PageProps } from '@components/Page';
import PageTutorial from '@components/PageTutorial';
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

const TutorialScreen: NextPage<PageProps> = ({ copy, locale }) => {
  return (
    <Page copy={copy} locale={locale}>
      <PageTutorial />
    </Page>
  );
};

export default TutorialScreen;
