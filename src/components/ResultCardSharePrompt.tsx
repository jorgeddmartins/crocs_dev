import cx from 'classnames';
import { useRouter } from 'next/router';
import { useQRCode } from 'next-qrcode';
import { FC, useContext } from 'react';

import { PageContext } from './Page';
import s from './ResultCardSharePrompt.module.scss';
import { useMemo } from 'react';

type ResultCardSharePromptProps = {
  isBuy?: boolean;
};

const ResultCardSharePrompt: FC<ResultCardSharePromptProps> = ({
  isBuy = false
}) => {
  const { copy, path } = useContext(PageContext);
  const { SVG } = useQRCode();
  const router = useRouter();
  const qrUrl = useMemo(() => {
    const url = `{process.env.NEXT_PUBLIC_URL}${router.asPath}`;
    let queryChar = '?';
    let finalLink = '';
    if (url.indexOf('?') > -1) {
      queryChar = '&';
    }

    finalLink = `${process.env.NEXT_PUBLIC_URL}${router.asPath}${queryChar}skipreveal=true`;

    if (!router.query.path) {
      finalLink += `&path=${path}`;
    }

    return finalLink;
  }, [router, path]);

  return (
    <div className={cx(s.dontForget)}>
      <div className={cx(s.anim, s.shareBox)}>
        <div className={cx(s.info, { [s.centered]: isBuy })}>
          {isBuy ? (
            <>
              <h3>{copy('result.buy.title')}</h3>
              <div
                className={s.copy}
                dangerouslySetInnerHTML={{ __html: copy('result.buy.copy') }}
              />
            </>
          ) : (
            <>
              <h3>
                <span className={s.textMob}>{copy('result.share.title')}</span>
                <span className={s.textDesk}>{copy('result.qr.title')}</span>
              </h3>
              <h4>
                <span className={s.textMob}>{copy('result.share.copy')}</span>
                <span className={s.textDesk}>{copy('result.qr.copy')}</span>
              </h4>
            </>
          )}
        </div>
        {!isBuy && (
          <div className={cx(s.hideMobile)}>
            <SVG
              text={qrUrl}
              options={{
                level: 'M',
                margin: 3,
                scale: 0,
                width: 170,
                color: {
                  dark: '#231f20',
                  light: '#49c3d4'
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCardSharePrompt;
