import type { NextPage } from 'next';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import Header from '@components/Header';
import QuizQuestion from '@components/QuizQuestion';
import s from './PageQuestion.module.scss';
import { PageContext } from './Page';
import { useRouter } from 'next/router';
import { Answer, Question } from '@utils/types';
import { useMount } from 'react-use';
import { AnimatePresence } from 'framer-motion';
import { mapLinear } from '@utils/math';
import PopupTutorial from './PopupTutorial';

const PageQuestion: NextPage = () => {
  const { questions, setAnswer, answers, copy } = useContext(PageContext);
  const router = useRouter();
  const questionId = parseInt(router.query.question as string, 10);
  const quizLength = questions.length;
  const [currentQuestion, setCurrentQuestion] = useState<Question>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [completed, setCompleted] = useState(false);
  const isAnswering = useRef(false);

  const nextQuestion = useCallback(() => {
    if (isAnswering.current) {
      router
        .push({
          pathname: router.pathname,
          query: {
            ...router.query,
            question: `${questionId + 1}`
          }
        })
        .then(() => {
          isAnswering.current = false;
        });
    }
  }, [router, questionId]);

  const sendAnswer = useCallback(
    (answer: Answer, confirm: () => void) => {
      if (isAnswering.current) {
        return;
      }
      confirm();

      // hide current question
      isAnswering.current = true;
      setCurrentQuestion(null);

      if (quizLength > questionId + 1) {
        // Save answer and wait for animation to complete
        setAnswer(answer, questionId);
      } else {
        // Quiz has been completed
        setAnswer(answer, questionId, true);
        isAnswering.current = false;
        setCurrentQuestion(null);
        setCompleted(true);
      }
    },
    [setAnswer, questionId, quizLength, setCurrentQuestion]
  );

  const question = questions[questionId];

  useMount(() => {
    if (questionId > 0 && !answers[questionId - 1]) {
      const lastUnanswered =
        answers.length > 0
          ? answers.findIndex(val => typeof val !== 'object')
          : 0;
      router.push({
        pathname: router.pathname,
        query: Object.assign({}, router.query, {
          question: `${lastUnanswered > 0 || answers.length}`
        })
      });
    }
    setCurrentQuestion(question);
  });

  const progress = useMemo(() => {
    if (completed) return 100;
    return mapLinear(questionId + 1, 0, questions.length + 1, 0, 100);
  }, [completed, questions, questionId]);

  useEffect(() => {
    setCurrentQuestion(question);
  }, [question, setCurrentQuestion]);

  return (
    <section className={s.quizWrap}>
      <Header
        hasBackButton
        hasInfoButton
        onBack={router.back}
        onInfo={() => setShowInfo(!showInfo)}
      />
      <div className={s.top}>
        <div className={s.progressBar}>
          <span
            className={s.progressHandle}
            style={{
              width: `${progress}%`,
              transition: '.7s ease-in-out'
            }}
          ></span>
        </div>
        <h2>{copy(question.copy)}</h2>
      </div>
      <div className={s.content}>
        <AnimatePresence onExitComplete={() => nextQuestion()}>
          {currentQuestion && (
            <QuizQuestion
              question={currentQuestion}
              answerCallback={sendAnswer}
              qid={questionId}
            />
          )}
        </AnimatePresence>
      </div>
      <PopupTutorial show={showInfo} onClose={() => setShowInfo(false)} />
    </section>
  );
};

export default PageQuestion;
