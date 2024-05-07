import { useEffect } from 'react';
import { sendPageview } from '../utils/analytics';
import { useRouter } from 'next/router';

function useGARouterTracking() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = url => {
      sendPageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // Send initial page view (default GTAG is disabled)
    handleRouteChange(window.location.pathname);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}

export default useGARouterTracking;
