import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react';
import { useMount, useSessionStorage } from 'react-use';
import * as Sentry from '@sentry/react';
import { useLocalStorage } from 'react-use';
import { consent } from '@utils/analytics';
import { useRouter } from 'next/router';
import {
  Answer,
  Personas,
  Question,
  Locale,
  Persona,
  Paths
} from '@utils/types';
import Meta from '@components/Meta';
import PopupLegals from './PopupLegals';
import Landscape from '@components/Landscape';

export type Page = {
  copy: (key: string) => string;
  cookies: {
    functional: boolean;
    analytics: boolean;
    terms: boolean;
    setAccepted: (
      key: 'functional' | 'analytics' | 'terms' | 'cookies',
      value: boolean
    ) => void;
    showPopup: boolean;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    showSettings: boolean;
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  };
  path: Paths;
  questions: Question[];
  personas: Record<string, Persona>;
  answers: Answer[];
  setAnswer: (answer: Answer, question: number, complete?: boolean) => void;
  completeQuiz: () => void;
  locale: Locale;
};

export const PageContext = createContext<Page>({
  copy: () => '',
  cookies: null,
  path: Paths.SHARE,
  questions: null,
  personas: null,
  answers: [],
  setAnswer: () => '',
  completeQuiz: () => '',
  locale: null
});

export type PageProps = {
  copy: Record<string, string>;
  children?: ReactNode;
  locale: Locale;
  questions?: Question[];
  personas?: Record<string, Persona>;
  noCookies?: boolean;
};

const Page = ({
  children,
  copy,
  locale,
  questions,
  personas,
  noCookies
}: PageProps) => {
  const [acceptedTerms, setAcceptedTerms] = useLocalStorage(
    'accept-terms',
    false
  );
  const [acceptedFunctionalCookies, setFunctionalCookies] = useLocalStorage(
    'accept-functional',
    false
  );
  const [acceptedAnalyticsCookies, setAnalyticsCookies] = useLocalStorage(
    'accept-analytics',
    false
  );
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [keysOnly, setKeysOnly] = useState(false);
  const [answers, setAnswers] = useSessionStorage<Answer[]>('quiz-answers', []);
  const [path, setPath] = useSessionStorage<Paths>('path', Paths.SHARE);
  const router = useRouter();

  const copyGetter = useCallback(
    (key: string) => {
      if (!copy[key]) {
        console.error(`Copy key not found: ${key}`);
        if (
          typeof window !== 'undefined' &&
          window.location.host.includes('staging')
        ) {
          Sentry.captureMessage(`Copy key not found '${key}'`);
        }
      }
      return keysOnly ? key : copy[key];
    },
    [keysOnly, copy]
  );

  const acceptCookies = useCallback(
    (key: 'functional' | 'analytics' | 'terms' | 'cookies', value: boolean) => {
      if (key === 'functional' || key === 'cookies') {
        setFunctionalCookies(value);
        setShowCookiePopup(false);
      }
      if (key === 'analytics' || key === 'cookies') {
        setAnalyticsCookies(value);
        consent();
      }
      if (key === 'terms') {
        setAcceptedTerms(value);
      }
    },
    [
      setFunctionalCookies,
      setAnalyticsCookies,
      setAcceptedTerms,
      setShowCookiePopup
    ]
  );

  useEffect(() => {
    const keydown = (evt: KeyboardEvent) => {
      if (
        evt.ctrlKey &&
        evt.shiftKey &&
        (evt.key === 'T' || evt.keyCode === 88)
      ) {
        setKeysOnly(k => !k);
        evt.preventDefault();
      }
    };

    window.addEventListener('keydown', keydown);

    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  useMount(() => {
    // for dev purposes show the copy so we
    if (process.env.NODE_ENV === 'development') {
      console.dir(copy);
    }

    try {
      const functional =
        JSON.parse(localStorage.getItem('accept-functional')) || false;
      const analytics =
        JSON.parse(localStorage.getItem('accept-analytics')) || false;

      if (!functional) {
        setShowCookiePopup(true);
      }
      if (analytics) {
        consent();
      }
    } catch (e) {
      console.warn('Localstorage not supported, always showing cookie popup');
    }
  });

  const completeQuiz = useCallback(() => {
    const scores = {};
    Object.entries(Personas).forEach(([, value]) => {
      scores[value as Personas] = 0;
    });

    answers.forEach(answer => {
      Object.entries(Personas).forEach(([, value]) => {
        scores[value as Personas] += answer[value];
      });
    });
    const sorted = Object.entries(scores).sort(
      (a: [string, number], b: [string, number]) => {
        return b[1] - a[1];
      }
    );

    const winner = sorted[0];

    if (winner && personas[winner[0]]) {
      setAnswers([]);

      router.push({
        pathname: '/[locale]/result/[result]',
        query: {
          locale: router.query.locale,
          result: personas[winner[0]].id
        }
      });
    } else {
      throw new Error('Winning persona not found');
    }
  }, [answers, router, personas, setAnswers]);

  const setAnswer = useCallback(
    (answer: Answer, question: number, complete = false) => {
      const updatedAnswers: Answer[] = [...answers];

      updatedAnswers[question] = answer;
      setAnswers(updatedAnswers);
      if (complete) {
        completeQuiz();
      }
    },
    [setAnswers, answers, completeQuiz]
  );

  useEffect(() => {
    const paths = Object.values(Paths) as string[];
    const current = String(router.query.path);
    if (paths.includes(current) && path !== current) {
      setPath(router.query.path as Paths);
    }
  }, [router, setPath, path]);

  return (
    <PageContext.Provider
      value={{
        copy: copyGetter,
        cookies: {
          terms: acceptedTerms,
          analytics: acceptedAnalyticsCookies,
          functional: acceptedFunctionalCookies,
          setAccepted: acceptCookies,
          showPopup: showCookiePopup,
          setShowPopup: setShowCookiePopup,
          showSettings: showCookieSettings,
          setShowSettings: setShowCookieSettings
        },
        path,
        questions,
        personas,
        answers,
        setAnswer,
        locale,
        completeQuiz
      }}
    >
      <Meta copy={copy} locale={locale} />
      <Landscape>
        {children}
        {showCookiePopup !== null && !noCookies && showCookiePopup && (
          <PopupLegals />
        )}
      </Landscape>
    </PageContext.Provider>
  );
};

export default Page;
