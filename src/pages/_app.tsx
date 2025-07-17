import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import { CMSProvider, ErrorBoundary } from '../components';
import PrototypeBanner from '../components/common/PrototypeBanner';
import { StorageProvider } from '../components/storage/StorageProvider';

import type { AppProps } from 'next/app';

import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Handle GitHub Pages SPA routing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Handle redirect from 404.html
      const redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      if (redirect && redirect !== location.href) {
        router.replace(redirect);
      }

      // Update base href
      const baseElement = document.querySelector('base');
      if (baseElement) {
        const basePath = router.basePath || '';
        baseElement.setAttribute('href', `${basePath}/`);
      }
    }
  }, [router]);

  return (
    <ErrorBoundary>
      <CMSProvider>
        <StorageProvider>
          <PrototypeBanner />
          <Component {...pageProps} />
        </StorageProvider>
      </CMSProvider>
    </ErrorBoundary>
  );
}
