import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add a base tag to ensure all relative URLs are resolved correctly */}
        <base href="/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}