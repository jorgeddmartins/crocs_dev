import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Page, { PageProps } from '@components/Page';
import PageQuestion from '@components/PageQuestion';
import { readCopy, readPersonas, readQuestions } from '@utils/data';
import { Locale } from '@utils/types';
import { getQuestionStaticPathsHelper } from '@utils/page';

export const getStaticProps: GetStaticProps<PageProps> = async ({
  params: { locale, question }
}) => {
  const copy = await readCopy(locale as Locale);
  const questions = await readQuestions();
  const personas = await readPersonas();

  return {
    props: {
      copy: copy,
      locale: (locale as Locale) || null,
      question,
      questions,
      personas
    }
  };
};

export const getStaticPaths: GetStaticPaths = getQuestionStaticPathsHelper;

const QuestionPage: NextPage<PageProps> = ({
  copy,
  locale,
  questions,
  personas
}) => {
  // console.log({ questions })

  return (
    <Page copy={copy} locale={locale} questions={questions} personas={personas}>
      <PageQuestion />
    </Page>
  );
};

export default QuestionPage;
