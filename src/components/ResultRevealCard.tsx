import { useContext, FC } from 'react';
import Image from 'next/image';
import cx from 'classnames';
import { PageContext } from './Page';
import s from './ResultRevealCard.module.scss';
import Button from '@components/Button';
import resultLoaderImg from '@assets/images/resultloader.png';
import revealCardImg from '@assets/images/revealcard.png';
import { ReactComponent as IconClick } from '@assets/images/iconclick.svg';
import { ReactComponent as RevealFrame } from '@assets/images/desktoprevealframe.svg';
import jibbitBoard from '@assets/images/jibbitboard.gif';
import jibbitHand from '@assets/images/jibbithand.gif';
import jibbitMoon from '@assets/images/jibbitmoon.gif';
import jibbitPaddle from '@assets/images/jibbitpaddle.gif';
import jibbitShell from '@assets/images/jibbitshell.gif';

type ResultRevealCardProps = {
  isOpen: boolean;
  setIsOpen: () => void;
};

const ResultRevealCard: FC<ResultRevealCardProps> = ({ isOpen, setIsOpen }) => {
  const { copy } = useContext(PageContext);
  return (
    <div className={cx(s.perspectiveContainer, { [s.revealed]: isOpen })}>
      <div className={s.revealCardPos}>
        <div className={s.revealCardRot}>
          <div className={s.revealCard}>
            <div className={s.cardWrap}>
              <Image
                src={resultLoaderImg.src}
                width={resultLoaderImg.width}
                height={resultLoaderImg.height}
                className={s.resultLoaderCard}
                alt={copy('result.reveal.prompt')}
              />
              <Image
                src={jibbitShell.src}
                width={jibbitShell.width}
                height={jibbitShell.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitShell}
              />
              <Image
                src={jibbitHand.src}
                width={jibbitHand.width}
                height={jibbitHand.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitHand}
              />
              <Image
                src={jibbitPaddle.src}
                width={jibbitPaddle.width}
                height={jibbitPaddle.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitPaddle}
              />
              <Image
                src={jibbitBoard.src}
                width={jibbitBoard.width}
                height={jibbitBoard.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitBoard}
              />
              <Image
                src={jibbitMoon.src}
                width={jibbitMoon.width}
                height={jibbitMoon.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitMoon}
              />
            </div>
            <IconClick onClick={setIsOpen} />
            <h2
              dangerouslySetInnerHTML={{
                __html: copy('result.reveal.prompt')
              }}
            />
          </div>
          <div className={s.revealGraphic}>
            <RevealFrame className={s.frame} />
            <div className={s.cardWrap}>
              <Image
                src={revealCardImg.src}
                width={revealCardImg.width}
                height={revealCardImg.height}
                alt={copy('result.reveal.prompt')}
                className={s.cardGraphic}
              />
              <Image
                src={jibbitShell.src}
                width={jibbitShell.width}
                height={jibbitShell.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitShell}
              />
              <Image
                src={jibbitHand.src}
                width={jibbitHand.width}
                height={jibbitHand.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitHand}
              />
              <Image
                src={jibbitPaddle.src}
                width={jibbitPaddle.width}
                height={jibbitPaddle.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitPaddle}
              />
              <Image
                src={jibbitBoard.src}
                width={jibbitBoard.width}
                height={jibbitBoard.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitBoard}
              />
              <Image
                src={jibbitMoon.src}
                width={jibbitMoon.width}
                height={jibbitMoon.height}
                alt={copy('result.reveal.prompt')}
                className={s.jibbitMoon}
              />
            </div>
            <Button onClick={setIsOpen}>{copy('reveal.CTA')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultRevealCard;
