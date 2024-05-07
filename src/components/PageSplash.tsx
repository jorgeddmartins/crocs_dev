import { useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Header from '@components/Header';
import Button from '@components/Button';
import { PageContext } from './Page';

import frameMobile from '@assets/images/splash-mobile.png';
import frameDesktop from '@assets/images/splash-desktop.png';

import s from './PageSplash.module.scss';
import { sendEvent } from '@utils/analytics';

const Landing: NextPage = () => {
  const { copy, path } = useContext(PageContext);
  const router = useRouter();
  return (
    <section className={s.landingWrap}>
      <Header />
      <div className={s.contentWrap}>
        <div className={s.content}>
          <h2 dangerouslySetInnerHTML={{ __html: copy('landing.copy') }} />
          <Image className={s.frame_mobile} src={frameMobile} alt="" />
          <Image className={s.frame_desktop} src={frameDesktop} alt="" />
        </div>
        <div className={s.bottomContent}>
          <Button
            onClick={() => {
              sendEvent('start_experience', { experiencePath: path });
              router.push({
                pathname: '/[locale]/tutorial',
                query: { locale: router.query.locale }
              });
            }}
          >
            {copy('landing.CTA')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
