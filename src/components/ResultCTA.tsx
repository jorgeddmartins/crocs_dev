import { FC, useContext } from 'react';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
import cx from 'classnames';

import { Paths, Persona } from '@utils/types';
import { convertSrcToFile } from '@utils/file';
import { sendEvent } from '@utils/analytics';
import { shareImage } from '@utils/sharing';
import { PageContext } from './Page';
import Button from './Button';

import s from './ResultCTA.module.scss';

type ResultCTAProps = {
  persona: Persona;
  personaImg?: StaticImageData;
};

const ResultCTA: FC<ResultCTAProps> = ({ persona, personaImg }) => {
  const { path, copy } = useContext(PageContext);

  const sharePersona = async () => {
    if (!personaImg) {
      return;
    }
    const fileBlob = await convertSrcToFile(
      personaImg.src,
      'My Crocs-onality.png'
    );
    sendEvent('image_share', { experiencePath: path });
    shareImage(fileBlob);
  };

  switch (path) {
    case Paths.BUY:
      return (
        <div className={s.buttonContentBuy}>
          <Link href={`${copy(persona.buylink)}`}>
            <Button>{copy(persona.buyCTA)}</Button>
          </Link>
        </div>
      );
    default:
      return (
        <div className={cx(s.buttonContent)}>
          <Button onClick={sharePersona}>{copy('result.share.CTA')}</Button>
        </div>
      );
  }
};

export default ResultCTA;
