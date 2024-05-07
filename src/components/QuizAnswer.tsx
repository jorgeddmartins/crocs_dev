import { Answer } from '@utils/types';
import { useContext, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import cx from 'classnames';
import { motion } from 'framer-motion';

import { PageContext } from './Page';

import { ReactComponent as AnswerFrame } from '@assets/images/answerframe.svg';

import s from './QuizAnswer.module.scss';
import { FC } from 'react';

type QuizAnswerProps = {
  answer: Answer;
  answerCallback: (answer: Answer, confirm: () => void) => void;
  angle?: 'left' | 'right';
  jibbit: StaticImageData;
  jibbitPos?: 'top' | 'bottom';
  delay?: number;
};

const QuizAnswer: FC<QuizAnswerProps> = ({
  answer,
  answerCallback,
  angle = 'left',
  jibbit,
  jibbitPos = 'top',
  delay = 0
}) => {
  const { copy } = useContext(PageContext);

  const [isSelected, setIsSelected] = useState(false);

  const variants = {
    selected: {
      scale: 1.35,
      rotate: angle === 'left' ? '-5deg' : '5deg',
      transition: { delay: 0 },
      opacity: 0
    },
    default: {
      opacity: 1,
      transition: { delay: delay },
      rotate: angle === 'left' ? '10deg' : '-10deg'
    }
  };

  return (
    <motion.div
      className={cx(s.wrap, {
        [s.skewLeft]: angle === 'left',
        [s.skewRight]: angle !== 'left'
      })}
      onClick={() => {
        answerCallback(answer, () => {
          setIsSelected(true);
        });
      }}
      transition={{ type: 'spring', stiffness: 25, mass: 100 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      variants={variants}
      animate={isSelected ? 'selected' : 'default'}
    >
      <AnswerFrame style={{ fill: answer.color }} />
      <span
        className={cx({
          [s.answer]: true,
          [s.lightText]: answer.lighttext,
          [s.long]: copy(answer.copy).length > 70
        })}
      >
        {copy(answer.copy)}
      </span>
      {jibbit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Image
            src={jibbit.src}
            width={jibbit.width}
            height={jibbit.height}
            alt={copy(answer.copy)}
            className={cx(s.jibbit, {
              [s.top]: jibbitPos === 'top',
              [s.bottom]: jibbitPos === 'bottom'
            })}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizAnswer;
