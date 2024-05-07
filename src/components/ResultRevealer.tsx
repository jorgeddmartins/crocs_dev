import { useRouter } from 'next/router';
import { useCallback, useState, useContext, useEffect } from 'react';
import cx from 'classnames';
import { PageContext } from './Page';
import { StaticImageData } from 'next/image';

import ResultCard from './ResultCard';
import ResultRevealCard from './ResultRevealCard';
import s from './ResultRevealer.module.scss';
import * as personaImgs from '@assets/images/results';
import * as personaAnimations from '@assets/animations';
import ResultCTA from './ResultCTA';
import { useMount } from 'react-use';
import { sendEvent, trackScrollDepth } from '@utils/analytics';
import { Locale } from '@utils/types';

const getPersonaImage = (
  images: Record<string, StaticImageData>,
  persona: string,
  locale: Locale
) => {
  const key = `${persona}_${locale}`;
  return images[key];
};

const ResultRevealer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { personas, path, locale } = useContext(PageContext);
  const personaId = router.query.result as string;
  const personaImg = getPersonaImage(
    personaImgs,
    personaId.replace('-', ''),
    locale
  );
  const personaAnim = personaAnimations[personaId.replace('-', '')]
    ? personaAnimations[personaId.replace('-', '')]
    : {};
  const result = personas[personaId];

  const revealResult = useCallback(() => {
    setIsOpen(!isOpen);
    sendEvent('reveal_result', {
      experiencePath: path
    });
  }, [setIsOpen, isOpen, path]);

  useEffect(() => {
    if (router.query.skipreveal !== undefined && !isOpen) {
      setIsOpen(true);
    }
  }, [router.query.skipreveal, setIsOpen, isOpen]);

  useEffect(() => {
    const cancelScrollTrack = trackScrollDepth(
      { experiencePath: path },
      'result_scrolldepth'
    );
    return cancelScrollTrack;
  });

  useMount(() => {
    sendEvent('results_pre_reveal', { experiencePath: path });
  });

  return (
    <>
      <div className={s.wrap}>
        <ResultRevealCard isOpen={isOpen} setIsOpen={revealResult} />
        <ResultCard
          persona={result}
          isOpen={isOpen}
          variant={path}
          personaAnim={personaAnim}
        />
      </div>
      <div className={cx(s.cta, { [s.isOpen]: isOpen })}>
        <ResultCTA persona={result} personaImg={personaImg} />
      </div>
    </>
  );
};

export default ResultRevealer;
