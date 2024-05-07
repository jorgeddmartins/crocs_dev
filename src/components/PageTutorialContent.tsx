import { Paths } from '@utils/types';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import { PageContext } from './Page';

import s from './PageTutorial.module.scss';

type StepProps = {
  number: number;
  text: string;
};

const Step = ({ number, text }: StepProps) => {
  return (
    <div className={s.step}>
      <div className={s.stepIndicator}>{number}</div>
      <div className={s.stepText} dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

type PageTutorialContentProps = {
  showDisclaimer?: boolean;
};

const PageTutorialContent = ({ showDisclaimer }: PageTutorialContentProps) => {
  const { copy, path } = useContext(PageContext);
  const router = useRouter();
  const locale = router.query.locale;

  return (
    <>
      <Step number={1} text={copy('tutorial.step[1]')} />
      <Step number={2} text={copy('tutorial.step[2]')} />
      <Step
        number={3}
        text={copy(
          path === Paths.SHARE ? 'tutorial.step[3]' : 'tutorial.buy.step[3]'
        )}
      />
      {showDisclaimer && (
        <div
          className={s.disclaimer}
          dangerouslySetInnerHTML={{
            __html: copy('tutorial.disclaimer').replace(
              /\[\[(.*)\]\]/,
              `<a href="/${locale}/terms">$1</a>`
            )
          }}
        />
      )}
    </>
  );
};

export default PageTutorialContent;
