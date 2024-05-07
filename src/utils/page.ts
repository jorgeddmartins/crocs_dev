import { GetStaticPaths } from 'next';
import { readQuestions, readPersonas } from './data';
import { Locale } from './types';
export type LocalePaths = {
  params: {
    locale: Locale;
  };
};

export const getStaticPathsHelper: GetStaticPaths = () => {
  const locales = Object.values(Locale);
  const paths = locales
    .map(l => ({
      params: {
        locale: l
      }
    }))
    .flat();

  return {
    paths,
    fallback: false
  };
};

export const getQuestionStaticPathsHelper: GetStaticPaths = async () => {
  const locales = Object.values(Locale);
  const questions = await readQuestions();
  const paths = locales
    .map(l =>
      questions.map((_question, i) => ({
        params: {
          locale: l,
          question: `${i}`
        }
      }))
    )
    .flat();
  return {
    paths,
    fallback: false
  };
};

export const getResultStaticPathsHelper: GetStaticPaths = async () => {
  const locales = Object.values(Locale);
  const personas = await readPersonas();
  const paths = locales
    .map(l =>
      Object.keys(personas).map(key => ({
        params: {
          locale: l,
          result: key
        }
      }))
    )
    .flat();
  return {
    paths,
    fallback: false
  };
};
