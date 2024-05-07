import * as Sentry from '@sentry/browser';
type GAParams = Record<string, unknown>;

const getScrollPercent = () => {
  const doc = document.documentElement;
  const bod = document.body;
  const st = 'scrollTop',
    sh = 'scrollHeight';

  return (
    ((doc[st] || bod[st]) / ((doc[sh] || doc[sh]) - doc.clientHeight)) * 100
  );
};

export const trackScrollDepth = (params: GAParams, name: string) => {
  if (typeof gtag === 'undefined') {
    console.error('no gtag found');
    return;
  }
  const trackingCall = trackScrollDepthCallback(params, name);
  document.addEventListener('scroll', trackingCall);
  return () => {
    document.removeEventListener('scroll', trackingCall);
  };
};

const trackScrollDepthCallback = (params: GAParams, name: string) => {
  return () => {
    const percent = getScrollPercent();
    const rawMarker = Math.round(percent / 25) * 25;
    if (rawMarker > 100) {
      Sentry.captureException(
        new Error(
          `Unexpected scroll amount. Expected less than 100, got: ${rawMarker}`
        )
      );
    }
    const marker = Math.min(rawMarker, 100);
    if (marker > 0) {
      sendEvent(name, { ...params, scroll_depth: `scroll${marker}` });
    }
  };
};

export const sendCTA = (params: GAParams, path: string) => {
  if (typeof gtag === 'undefined') {
    console.error('no gtag found');
    return;
  }
  gtag('event', 'cta', {
    ...params,
    page_title: path
  });
};

export const sendEvent = (name: string, params: GAParams) => {
  if (typeof gtag === 'undefined') {
    console.error('no gtag found');
    return;
  }
  gtag('event', name, {
    ...params
  });
};

export const sendOutbound = (params: GAParams, path: string) => {
  if (typeof gtag === 'undefined') {
    console.error('no gtag found');
    return;
  }
  gtag('event', 'outbound', {
    ...params,
    page_title: path
  });
};

export const sendPageview = (path: string) => {
  if (typeof gtag === 'undefined') {
    console.error('no gtag found');
    return;
  }
  gtag('event', 'page_view', {
    page_title: path,
    page_location: path
  });
};

export const consent = () => {
  gtag('consent', 'update', {
    ad_storage: 'granted',
    analytics_storage: 'granted'
  });
};
