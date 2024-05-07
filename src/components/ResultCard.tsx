import { FC, useContext } from 'react';
import cx from 'classnames';
import Lottie from 'lottie-react';

import { PageContext } from './Page';
import s from './ResultCard.module.scss';
import { Persona, Paths } from '@utils/types';
import ResultCTA from './ResultCTA';
import ResultCardSharePrompt from './ResultCardSharePrompt';

type ResultCardProps = {
  isOpen: boolean;
  persona: Persona;
  variant: Paths;
  personaAnim: unknown;
};

const ResultCard: FC<ResultCardProps> = ({
  isOpen,
  persona,
  variant,
  personaAnim
}) => {
  const { copy, path } = useContext(PageContext);

  return (
    <div className={s.wrap}>
      <div className={cx(s.content, { [s.isOpen]: isOpen })}>
        <div className={s.imgPersona}>
          {Object.keys(personaAnim).length > 0 ? (
            <Lottie animationData={personaAnim} assetsPath={'/images/'} />
          ) : null}
        </div>
        <h1 className={s.anim}>{copy(persona.name)}</h1>
        <div
          className={s.anim}
          dangerouslySetInnerHTML={{ __html: copy(persona.description) }}
        />
        <ResultCardSharePrompt isBuy={variant === Paths.BUY} />
        <div className={cx(s.cta, { [s.isShare]: path !== Paths.BUY })}>
          <ResultCTA persona={persona} />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
