import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import { CMSProvider, ErrorBoundary } from '../components';

import type { AppProps } from 'next/app';

import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Update the base href dynamically based on the current path
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseElement = document.querySelector('base');
      if (baseElement) {
        const basePath = router.basePath || '';
        baseElement.setAttribute('href', `${basePath}/`);
      }
    }
  }, [router.basePath]);

  return (
    <ErrorBoundary>
      <CMSProvider>
        <Component {...pageProps} />
      </CMSProvider>
    </ErrorBoundary>
  );
}
