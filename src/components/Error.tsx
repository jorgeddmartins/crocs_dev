import s from './Error.module.scss';
import Button from '@components/Button';
import Header from '@components/Header';

type ErrorProps = {
  eventId?: string;
  error?: Error;
  notFound?: boolean;
};

export default function Error({ notFound }: ErrorProps) {
  return (
    <section className={s.errorWrap}>
      <Header />
      <div className={s.contentWrap}>
        <div className={s.content}>
          <h1>oops</h1>
          <h2>What a bunch of crocs</h2>
          {notFound && (
            <span className={s.subTitle}>
              We couldn’t find the page you’re looking for.
            </span>
          )}
        </div>
        <div className={s.buttonContent}>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    </section>
  );
}
