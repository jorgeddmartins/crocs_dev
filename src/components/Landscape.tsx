import { useState, useEffect, useContext } from 'react';
import { PageContext } from './Page';
import s from './Landscape.module.scss';
import useMobileDetect from '@hooks/useMobileDetect';
import Header from '@components/Header';
import { ReactComponent as Rotate } from '../assets/images/rotate.svg';

type LandscapeProps = {
  children: React.ReactNode;
};

const Landscape = ({ children }: LandscapeProps) => {
  const { copy } = useContext(PageContext);
  const isMobileDevice = useMobileDetect();
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    const detect = () => {
      setIsMobileLandscape(
        isMobileDevice &&
          typeof window !== 'undefined' &&
          window.matchMedia('screen and (orientation:landscape)').matches
      );
    };

    window.addEventListener('resize', detect);

    return () => {
      window.removeEventListener('resize', detect);
    };
  });

  if (isMobileLandscape) {
    return (
      <div className={s.wrap}>
        <Header />
        <div className={s.content}>
          <div className={s.landscapeMsg}>
            <div className={s.landscapeContent}>
              <Rotate />
              <h2>{copy('landscape.title')}</h2>
              <p className={s.subTitle}>{copy('landscape.description')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Landscape;
