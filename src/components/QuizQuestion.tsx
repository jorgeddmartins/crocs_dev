import { FC, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Answer, Question } from '@utils/types';

import { PageContext } from './Page';
import QuizAnswer from './QuizAnswer';

import * as questionImgs from '@assets/images/questions';
import s from './QuizQuestion.module.scss';

type QuestionProps = {
  question: Question;
  answerCallback: (answer: Answer, confirm: () => void) => void;
  qid: number;
};

const QuizQuestion: FC<QuestionProps> = ({ question, answerCallback, qid }) => {
  const { copy } = useContext(PageContext);
  return (
    <motion.div
      className={`${s.wrap}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        <QuizAnswer
          angle={qid % 2 === 0 ? 'left' : 'right'}
          answer={question.answer1}
          answerCallback={answerCallback}
          jibbit={questionImgs[`q${qid + 1}_1`]}
          jibbitPos="top"
          delay={0}
        />
        <span className={s.middle}>{copy('quiz.question.prompt.or')}</span>
        <QuizAnswer
          answer={question.answer2}
          angle={qid % 2 !== 0 ? 'left' : 'right'}
          answerCallback={answerCallback}
          jibbit={questionImgs[`q${qid + 1}_2`]}
          jibbitPos="bottom"
          delay={0.2}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizQuestion;
